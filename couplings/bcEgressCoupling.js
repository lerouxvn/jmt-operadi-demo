const {Coupling} = require('./baseBcCoupling')
const https = require("https");
const url = require('url')
const {api} = require("../app");
const fetch = require("node-fetch");

class BcEgressCoupling extends Coupling {

    constructor(couplingBlueprint, couplingData, processBlueprint) {
        super(couplingBlueprint, couplingData, processBlueprint);
        console.log('BcEgressCoupling constructor - ')
        couplingData.action = 'push';
    }

    async execAsync(user) {
        if (this.couplingData.executing) return;
        try {
            user ||= {name: this.couplingData.couplingType}
            await this.updateEntanglements(user)

            const match = {
                _idCoupling: this.couplingData._id,
                update: true
            };
            let entanglement = await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.getOneAsync(match, {projection: {}})
            // console.log("entanglement", entanglement, this.couplingData._id, this.dbProjection)
            while (entanglement) {
                let processData = this.processBlueprint.getNew();
                console.log("processData", processData)
                processData._idCoupling = this.couplingData._id;
                processData.events.push(this.processBlueprint.getEvent('Sync Start'))
                let updateDocument = await this.couplingBlueprint.dataBlueprint.getOneByIdAsync(entanglement._idDocument, {projection: this.dbProjection});
                // console.log('updateDocument', updateDocument)
                const hash = api.jmtMongo.getHash(updateDocument);
                entanglement.error = {__delete: true};
                entanglement.errorMessage = {__delete: true};
                if (entanglement.sourceHash !== hash) {
                    // console.log('-----------------update document', updateDocument)
                    try {
                        processData.events.push(this.processBlueprint.getEvent('Update BC'));
                        [updateDocument, entanglement] = await this.fromDocument(updateDocument, entanglement);
                        // console.log('-----------save', updateDocument)
                        if (Object.keys(updateDocument).length > 1) {
                            const hashDocument = await this.couplingBlueprint.dataBlueprint.getOneByIdAsync(entanglement._idDocument, {
                                projection: {
                                    _id: 1,
                                    _hash: 1
                                }
                            });
                            updateDocument._hash = hashDocument._hash;
                            updateDocument = await this.saveDocument(updateDocument, user);
                            processData.events.push(this.processBlueprint.getEvent('BC Updated'))
                        }
                    } catch (updateError) {
                        entanglement.update = false;
                        entanglement.error = true;
                        entanglement.errorMessage = updateError;
                        processData.error = true;
                        processData.errorMessage = updateError.toString();
                        processData.events.push(this.processBlueprint.getEvent(updateError.toString(), 'Error'))
                    }
                    entanglement.sourceHash = hash;
                } else
                    processData.events.push(this.processBlueprint.getEvent('Unchanged'))
                entanglement.update = false;
                await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.saveAsync(entanglement, {}, user)
                await this.updateCoupling(this.couplingData, user);
                if (this.couplingData.stopExecute)
                    break;
                entanglement = await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.getOneAsync(match, {projection: {}})
                processData.events.push(this.processBlueprint.getEvent('Sync End'))
                this.processBlueprint.saveAsync(processData, {ignoreRabbit: true}, user).catch(console.error);
            }
            this.couplingData.error = {__delete: true};
            this.couplingData.stopExecute = {__delete: true};
            this.couplingData.errorMessage = {__delete: true};
        } catch (err) {
            this.couplingData.error = true;
            this.couplingData.errorMessage = err.toString();
            console.log('BC - pushAsync', this.couplingData, err.toString())
            throw err
        } finally {
            this.couplingData = await this.getStatsAsync()
            this.couplingData.executing = false;
            this.couplingData = await this.couplingBlueprint.saveAsync(this.couplingData, {}, user);
        }

    }

    async getStatsAsync(data) {
        console.log('STATS__________________________________________________')
        return super.getStatsAsync(data);
    }

    async fromDocument(document, entanglement) {
        let accNumber;
        if (this.couplingData.information.dataSource === 'customers') {
            accNumber = document.client.accNumber
        } else if (this.couplingData.information.dataSource === 'vendors') {
            accNumber = document.vendor.accNumber
        } else {
            accNumber = document.company.accNumber;
        }
        let serverData = await this.getAsync(accNumber)

        if (Object.keys(serverData).length > 0) {
            delete serverData.balance
            delete serverData.balanceDue
            delete serverData.taxAreaDisplayName
            delete serverData.lastModifiedDateTime
            serverData.displayName = document.name;
            // test.taxRegistrationNumber = entity.company.vatNumber;
            serverData = await this.patchPromise(serverData);
        } else {
            serverData = {
                number: accNumber,
                displayName: document.name,
                // addressLine1: 'Aviator Way, 3000',
                // addressLine2: 'Manchester Business Park',
                // city: 'Manchester',
                // state: '',
                // country: 'GB',
                // postalCode: 'M22 5TG',
                // phoneNumber: '',
                // email: 'toby.rhode@contoso.com',
                // website: '',
                // taxRegistrationNumber: entity.company.vatNumber,
            }
            serverData = await this.postAsync(serverData);
        }

        const doc = {_id: document._id}
        if (Object.keys(serverData).length > 0) {
            if (serverData.error) {
                throw `${serverData.error} - ${serverData.error_description}`;
            } else {
                if (this.couplingData.information.dataSource === 'customers') {
                    if (document.client.accNumber !== serverData.number)
                        doc.client = {accNumber: serverData.number};
                } else if (this.couplingData.information.dataSource === 'vendors') {
                    if (document.vendor.accNumber !== serverData.number)
                        doc.vendor = {accNumber: serverData.number};
                } else {
                    if (document.company.accNumber !== serverData.number)
                        doc.company = {accNumber: serverData.number};
                }
                entanglement.data = {bcId: serverData.id}
                // delete serverData['@odata.context'];
                // delete serverData['@odata.etag'];
                // delete serverData['balance'];
                // delete serverData['balanceDue'];
                // delete serverData['taxAreaDisplayName'];
                // delete serverData['lastModifiedDateTime'];
            }
        }
        console.log('doc', doc)
        return [doc, entanglement];
    }

    async getAsync(number) {
        const environment = this.couplingData.information.environment;
        const companyId = this.couplingData.information.companyId;
        const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/companies(${companyId})/${dataSource}?$filter=number eq '${number}'`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal'
            }
        })

        if (response.ok) {
            const jsonData = await response.json()
            // console.log("getAsync", jsonData)
            if (jsonData.error) {
                throw `${jsonData.error} - ${jsonData.error_description}`;
            } else {
                if (jsonData.value && jsonData.value[0])
                    return jsonData.value[0];
            }
            return {};
        } else {
            console.log(`Error getPromiseAsync to BC`, response.statusText, response.statusCode)
            throw response.statusText || `Receive status code of ${response.statusCode}`
        }
    }

    async postAsync(data) {
        const environment = this.couplingData.information.environment;
        const companyId = this.couplingData.information.companyId;
        const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/companies(${companyId})/${dataSource}`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal'
            },
            body: JSON.stringify(data)
        })
        console.log('postAsync response', response)
        if (response.ok) {
            const jsonData = await response.json()
            // console.log(jsonData)
            if (jsonData) {
                return jsonData
            }
            return {}
        } else {
            console.log(`Error postAsync to BC`, response.statusText, response.statusCode)
            return {error: response.statusText || `Receive status code of ${response.statusCode}`}
        }
    }

    async patchPromise(data) {
        const environment = this.couplingData.information.environment;
        const companyId = this.couplingData.information.companyId;
        const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/companies(${companyId})/${dataSource}(${data.id})`, {
            method: 'PATCH',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal',
                'If-Match': data['@odata.etag']
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const jsonData = await response.json()
            // console.log('patchPromise', jsonData)
            if (jsonData) {
                return jsonData;
            }
            return {}
        } else {
            console.log(`Error patchPromise to BC`, response.statusText, response, data)
            return {error: response.statusText || `Receive status code of ${response.statusCode}`}
        }
    }

}

module.exports.Coupling = BcEgressCoupling;
module.exports.meta = {
    name: 'bcEgressCoupling',
    description: 'Business Central Egress Coupling',
    descriptionTemplate: 'Business Central Egress {{companyName}} {{dataSource}}',
    collection: 'entities',
    version: 'B1',
    auth: {
        environment: {
            type: 'text',
            required: true,
            description: 'Environment',
            hint: 'Environment Production or Sandbox',
            error: ''
        },
        tenantId: {
            type: 'text',
            required: true,
            description: 'TenantId',
            hint: 'TenantId'
        },
        clientId: {
            type: 'text',
            required: true,
            description: 'ClientId',
            hint: 'ClientId'
        },
        secret: {
            type: 'text',
            required: true,
            description: 'Secret',
            hint: 'Secret'
        }
    },
    data: {
        companyId: {
            type: 'selectInfo',
            disabled: false,
            required: true,
            description: 'Company',
            valueField: 'companyName',
            hint: 'Company Id',
            source: 'companies'
        },
        dataSource: {
            type: 'select',
            required: true,
            description: 'Data Source',
            options: [
                {key: 'customers', value: 'Customers'},
                {key: 'vendors', value: 'Vendors'},
                {key: 'employees', value: 'Employees'}
            ]
        }
    }
}