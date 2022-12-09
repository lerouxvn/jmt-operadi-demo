const {CouplingBase} = require("jmt-operadi");
const {api} = require("../app");
const fetch = require("node-fetch");

class BaseHaloCoupling extends CouplingBase {

    dbProjection = {
        name: 1,
        _hash: ''
    };
    TOKENS = {}

    constructor(couplingBlueprint, couplingData, processBlueprint) {
        super(couplingBlueprint, couplingData, processBlueprint);

        console.log('BaseHaloCoupling constructor')
    }

    async getTokenAsync() {
        console.log(this.couplingData.information)
        const tenant = this.couplingData.information.tenant
        const clientId = this.couplingData.information.clientId
        if (this.TOKENS[tenant] && this.TOKENS[tenant][clientId] && this.TOKENS[tenant][clientId]["lastCall"]
            && (new Date()).getTime() - this.TOKENS[tenant][clientId]["lastCall"] < 3500 * 1000) {
            return this.TOKENS[tenant][clientId]
        } else {
            const response = await fetch(`https://${this.couplingData.information.tokenUrl.replace(/^https?\:\/\//i, '')}/token?tenant=${tenant}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `client_id=${clientId}&client_secret=${this.couplingData.information.secret}&grant_type=client_credentials&scope=all`
            })
            if (response.ok) {
                const jsonData = await response.json()
                console.log(jsonData)
                jsonData.lastCall = (new Date()).getTime();
                this.TOKENS[tenant] = {[clientId]: jsonData}
                return (this.TOKENS[tenant][clientId]);
            } else {
                console.log(`Error connecting to halo`, response.statusText, response)
                throw response.statusText || `Receive status code of ${response.statusCode}`
            }
        }
    }

    async pushAsync(user) {
        try {
            user ||= {name: this.couplingData.couplingType}
            await this.updateEntanglements(user)

            const match = {
                _idCoupling: this.couplingData._id,
                update: true
            };
            let entanglement = await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.getOneAsync(match, {projection: {}})
            console.log("entanglement", entanglement, this.couplingData._id, this.dbProjection)

            while (entanglement) {
                let updateDocument = await this.couplingBlueprint.dataBlueprint.getOneByIdAsync(entanglement._idDocument, {projection: this.dbProjection});
                // console.log('updateDocument', updateDocument)
                const hash = api.jmtMongo.getHash(updateDocument);
                entanglement.error = {__delete: true};
                entanglement.errorMessage = {__delete: true};
                if (entanglement.sourceHash !== hash) {
                    console.log('-----------------update document', updateDocument)
                    try {
                        [updateDocument, entanglement] = await this.fromDocument(updateDocument, entanglement);
                        console.log([updateDocument, entanglement])
                        if (Object.keys(updateDocument).length > 1) {
                            console.log('-----------save', updateDocument)
                            updateDocument = await this.saveDocument(updateDocument, user);
                        }
                    } catch (updateError) {
                        entanglement.error = true;
                        entanglement.errorMessage = updateError;
                        entanglement.update = false
                    }
                    entanglement.sourceHash = hash;
                }
                entanglement.update = false;
                console.log('--------------------------------------------------------------entanglement',entanglement)
                await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.saveAsync(entanglement, {}, user)
                await this.updateCoupling(this.couplingData, user);
                if (this.couplingData.stopExecute)
                    break;
                entanglement = await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.getOneAsync(match, {projection: {}})
            }

            this.couplingData.error = {__delete: true};
            this.couplingData.stopExecute = {__delete: true};
            this.couplingData.errorMessage = {__delete: true};
        } catch (err) {
            this.couplingData.error = true;
            this.couplingData.errorMessage = err.toString();
            console.log('Halo - pushAsync', this.couplingData, err.toString())
            throw err
        } finally {
            this.couplingData.executing = false;
            this.couplingData = await this.couplingBlueprint.saveAsync(this.couplingData, {}, user);
        }

        return await super.pushAsync(user);
    }

    async getAsync() {
        // const environment = this.couplingData.information.environment;
        // const companyId = this.couplingData.information.companyId;
        const tenant = this.couplingData.information.tenant;
        const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://${tenant}.haloitsm.com/api/${dataSource}`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const jsonData = await response.json()
            // console.log("getAsync", jsonData)
            if (jsonData.error) {
                throw `${jsonData.error}`;
            } else {
                if (jsonData.value && jsonData.value[0])
                    return jsonData.value[0];
            }
            return {};
        } else {
            throw response.statusText || `Receive status code of ${response.statusCode}`
        }
    }

    async postAsync(data) {
        const tenant = this.couplingData.information.tenant;
        const dataSource = this.couplingData.information.dataSource;
        console.log(dataSource)
        const token = await this.getTokenAsync();
        console.log(token)


        const response = await fetch(`https://${tenant}.haloitsm.com/api/${dataSource}`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([data])
        })
        console.log('postAsync response', response)
        if (response.ok) {
            const jsonData = await response.json()
            console.log(jsonData)
            if (jsonData) {
                return jsonData
            }
            return {}
        } else {
            let error = response.statusText
            let message
            console.log(`Error postAsync to Halo`, response.statusText, response.statusCode)
            try {
                message = await response.json()
                return {
                    error: error,
                    errorMessage: message.Message
                }
            } catch {
                return {
                    error: response.statusCode,
                    errorMessage: error
                }
            }
        }
    }

    async fromDocument(document, entanglement) {
        // let serverData = await this.getAsync()
        const serverData = await this.postAsync({
            id: entanglement.data?.haloId,
            name: document.name
        });
        console.log(serverData)
        if (!serverData.error) {
            entanglement.data = {
                haloId: serverData.id
            }
        } else {
            entanglement.error = serverData.error
            entanglement.errorMessage = serverData.errorMessage
        }
        console.log(entanglement)
        return [{}, entanglement];
    }


    async testConnectionAsync() {
        try {
            await this.getTokenAsync()
            await super.testConnectionAsync()
            return this.couplingData
        } catch (err) {
            throw err
        }
    }

}


module.exports.Coupling = BaseHaloCoupling
module.exports.meta = {
    name: 'baseHaloCoupling',
    description: 'Base Halo Coupling',
    descriptionTemplate: 'Halo {{action}} {{dataSource}} {{action}}',
    collection: 'entities',
    version: 'B1',
    auth: {
        tenant: {
            type: 'text',
            required: true,
            description: 'Tenant',
            hint: 'Environment Production or Sandbox',
            error: ''
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
        },
        tokenUrl: {
            type: 'text',
            required: true,
            description: 'Token Url',
            hint: 'Url to request token from'
        },
    },
    data: {
        // companyId: {
        //     type: 'text',
        //     disabled: true,
        //     required: true,
        //     description: 'Company Id',
        //     hint: 'Company Id'
        // },
        dataSource: {
            type: 'select',
            required: true,
            description: 'Data Type',
            options: [
                {key: 'client', value: 'Client'},
                {key: 'agent', value: 'Agent'},
                // {key: 'employees', value: 'Employees'}
            ]
        },
        action: {
            type: 'select',
            required: true,
            description: 'Action',
            options: [{key: 'push', value: 'Push'},{key: 'egress', value: 'Egress'}]
        }
    }
}

