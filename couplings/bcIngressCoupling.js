const {Coupling} = require('./baseBcCoupling')
const https = require("https");
const url = require('url')
const {api} = require("../app");
const fetch = require("node-fetch");

class BcIngressCoupling extends Coupling {

    constructor(couplingBlueprint, couplingData, processBlueprint) {
        super(couplingBlueprint, couplingData, processBlueprint);

        console.log('BcIngressCoupling constructor - ', couplingData.information.action)
        if (couplingData.information.status)
            this._registerWebhook();
    }

    _registerWebhook() {
        this.getWebhookAsync().then(data => {
            let wh
            if (data.value) {
                for (let v of data.value) {
                    // console.log(v)
                    if (v.clientState === this.couplingData._id.toString()) {
                        wh = v;
                    }
                }
            }
            if (!wh) {
                return this.registerWebhookAsync()
            } else {
                return this.updateWebhookAsync(wh);
            }
        }).then(console.log).catch(console.error)
    }

    async webhookAsync(req) {
        if (!this.couplingData.executing)
            this.execAsync({name: `Webhook - ${this.couplingData.couplingType}`}).catch(err => {
                console.log('webhookAsync pull ERROR', err.toString())
            })
        return await super.webhookAsync(req);
    }

    async getWebhookAsync() {
        const environment = this.couplingData.information.environment;
        const companyId = this.couplingData.information.companyId;
        const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/subscriptions`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal'
            }
        })
        // console.log('getWebhookAsync response', response)
        if (response.ok) {
            const jsonData = await response.json()
            // console.log('getWebhookAsync response',jsonData)
            if (jsonData) {
                return jsonData
            }
            return {}
        } else {
            console.log(`Error getWebhookAsync to BC`, response.json())
            return {error: response.statusText || `Receive status code of ${response.statusCode}`}
        }
    }

    async registerWebhookAsync() {
        const environment = this.couplingData.information.environment;
        // const tenantId = this.couplingData.information.tenantId;
        const companyId = this.couplingData.information.companyId;
        const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const data = JSON.stringify({
            notificationUrl: `https://coupling.jedimindtricks.co.za/api/couplings/webhook/${this.couplingData._id.toString()}`,
            resource: `/api/v2.0/companies(${companyId})/${dataSource}`,
            clientState: this.couplingData._id.toString()
        });

        console.log('registerWebhookAsync - data -', data)

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal',
                'Content-Length': data.length
            },
            body: data
        })
        console.log('registerWebhookAsync response', response)
        if (response.ok) {
            const jsonData = await response.json()
            // console.log(jsonData)
            if (jsonData) {
                return jsonData
            }
            return {}
        } else {
            console.log(`Error registerWebhookAsync to BC`)
            response.json().then(console.log)
            return {error: response.statusText || `Receive status code of ${response.statusCode}`}
        }
    }

    async updateWebhookAsync(data) {
        const environment = this.couplingData.information.environment;
        // const companyId = this.couplingData.information.companyId;
        // const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/subscriptions('${data.subscriptionId}')`, {
            method: 'PATCH',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal',
                'If-Match': data['@odata.etag']
            },
            body: JSON.stringify({clientState: data.clientState})
        })

        if (response.ok) {
            const jsonData = await response.json()
            // console.log(jsonData)
            if (jsonData) {
                return jsonData;
            }
            return {}
        } else {
            console.log(`Error updateWebhookAsync to BC`, response.statusText, response, data)
            response.json().then(console.log)
            return {error: response.statusText || `Receive status code of ${response.statusCode}`}
        }
    }

    async execAsync(user) {
        if (this.couplingData.executing) return;
        user ||= {name: this.couplingData.couplingType}
        try {
            this.couplingData.executing = true;
            this.couplingData = await this.couplingBlueprint.saveAsync(this.couplingData, {projection: {}}, user);
            this.couplingData.stats ||= {};
            this.couplingData.stats.total = await this.pullCountAsync();
            let pendingCount = await this.pullCountAsync(this.couplingData.information.lastDate || 0);
            console.log("pendingCount", pendingCount)
            this.couplingData.stats.entangled = this.couplingData.stats.total - pendingCount;
            this.couplingData = await this.couplingBlueprint.saveAsync(this.couplingData, {
                projection: {},
                ignoreRabbit: true,
                ignoreBeforeSaveAsync: true
            }, user);
            let updateData = JSON.stringify({stats: this.couplingData.stats})
            this.couplingBlueprint.jmtMongo.rabbit.publish(`2|${this.couplingBlueprint.model.collection}|${this.couplingData._id.toString()}|${this.couplingData._hash}|${updateData}`)
            //let data = await this.pullNextAsync();

            // while (Object.keys(data).length > 0) {
            while (pendingCount > 0) {
                let data = await this.pullNextAsync();
                console.log(data)
                let options = {rabbits: []};
                try {
                    options.session = await this.couplingBlueprint.jmtMongo.getSessionAsync();
                    options.session.startWriteTransaction();
                    const [document, entanglement] = await this.toDocument(data);
                    console.log(document, entanglement)
                    await this.couplingBlueprint.dataBlueprint.saveAsync(document, options, user);
                    await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.saveAsync(entanglement, options, user);
                    await options.session.commitTransaction();
                } catch (err) {
                    console.log(err.toString())
                    await options.session.abortTransaction();
                } finally {
                    await options.session.endSession()
                    options.rabbits.forEach(rabbit => rabbit());
                    pendingCount = await this.pullCountAsync(this.couplingData.information.lastDate || 0);
                    this.couplingData.stats.entangled = this.couplingData.stats.total - pendingCount;
                    this.couplingData = await this.couplingBlueprint.saveAsync(this.couplingData, {
                        projection: {},
                        ignoreRabbit: true,
                        ignoreBeforeSaveAsync: true
                    }, user);
                    updateData = JSON.stringify({stats: this.couplingData.stats})
                    this.couplingBlueprint.jmtMongo.rabbit.publish(`2|${this.couplingBlueprint.model.collection}|${this.couplingData._id.toString()}|${this.couplingData._hash}|${updateData}`)
                }
                if (this.couplingData.stopExecute)
                    break;
                data = await this.pullNextAsync();
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
            // await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.updateManyAsync({_idCoupling:this.couplingData._id},{$set:{update:false}})
            this.couplingData.executing = false;
            this.couplingData = await this.couplingBlueprint.saveAsync(this.couplingData, {}, user);
        }

    }

    async pullNextAsync() {
        const environment = this.couplingData.information.environment;
        const companyId = this.couplingData.information.companyId;
        const dataSource = this.couplingData.information.dataSource;
        const lastDate = this.couplingData.information.lastDate || 0;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/companies(${companyId})/${dataSource}?
            $filter=lastModifiedDateTime gt ${this.timestampToDateString(lastDate)}&$top=1&$orderby=lastModifiedDateTime`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal'
            }
        })

        if (response.ok) {
            const jsonData = await response.json()
            // console.log(jsonData)
            if (jsonData.value && jsonData.value[0]) {
                return jsonData.value[0];
            }
            return {}
        } else {
            console.log(`Error pullNextAsync to BC`, response.statusText)
            return {error: response.statusText || `Receive status code of ${response.statusCode}`}
        }
    }

    async pullCountAsync(lastDate = undefined) {
        const environment = this.couplingData.information.environment;
        const companyId = this.couplingData.information.companyId;
        const dataSource = this.couplingData.information.dataSource;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/companies(${companyId})/${dataSource}/$count${lastDate ? `?$filter=lastModifiedDateTime gt ${this.timestampToDateString(lastDate)}` : ''}`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal'
            }
        })

        if (response.ok) {
            const jsonData = await response.json();
            if (jsonData) {
                if (jsonData.error)
                    throw jsonData.error + 'pullCountAsync'
                else
                    return jsonData;
            }
            return 0;
        } else {
            console.log(`Error pullNextAsync to BC`, response.statusText)
            throw response.statusText || `Receive status code of ${response.statusCode}` + 'pullCountAsync'
        }
    }

    async toDocument(data) {
        let entanglement = await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.getOneAsync({
            _idCoupling: this.couplingData._id,
            'data.bcId': data.id
        }, {projection: {}})

        this.couplingData.information.lastDate = this.dateStringToTimestamp(data.lastModifiedDateTime);
        delete data['@odata.etag'];
        delete data['balance'];
        delete data['balanceDue'];
        delete data['taxAreaDisplayName'];
        delete data['lastModifiedDateTime'];
        const hash = api.jmtMongo.getHash(data);
        let currentEntity;
        if (entanglement === null) {
            currentEntity = this.couplingBlueprint.dataBlueprint.getNew();
            entanglement = this.couplingBlueprint.dataBlueprint.entanglementBlueprint.getNew();
            entanglement._idDocument = currentEntity._id;
            entanglement._idCoupling = this.couplingData._id;
            entanglement.data = {bcId: data.id}
        } else {
            currentEntity = await this.couplingBlueprint.dataBlueprint.getOneByIdAsync(entanglement._idDocument, {
                projection: {
                    _id: 1,
                    _hash: 1
                }
            });
        }
        if (entanglement.sourceHash !== hash) {
            currentEntity.company = {
                regName: data.displayName,
                vatNumber: data.taxRegistrationNumber,
            };
            if (this.couplingData.information.dataSource === 'customers') {
                currentEntity.client = {accNumber: data.number};
            } else if (this.couplingData.information.dataSource === 'vendors') {
                currentEntity.vendor = {accNumber: data.number};
            } else {
                currentEntity.company.accNumber = data.number;
            }
            entanglement.sourceHash = hash;
        }
        entanglement.error = {__delete: true};
        entanglement.errorMessage = {__delete: true};
        return [currentEntity, entanglement]
    }

    async getStatsAsync(data) {
        let total = await this.pullCountAsync();
        // console.log(total)
        data ||=this.couplingData;
        let match = api.jmtMongo.checkObjectId({_idCoupling: data._id});
        const entPipe = [
            {$match: match},
            {
                $group: {
                    _id: null,
                    entangled: {$sum: {$sum: {$cond: {if: "$update", then: 0, else: 1}}}},
                    error: {$sum: {$cond: {if: "$error", then: 1, else: 0}}}
                }
            },
            {$project: {entangled: 1, error: 1}}
        ]
        const ent = await this.couplingBlueprint.dataBlueprint.entanglementBlueprint.aggregateAsync(entPipe, {});

        // console.log(entPipe)
        // console.log(ent[0])
        data.stats = {entangled: 0, error: 0, total: total, ...ent[0]};
        return data;
    }
}

module.exports.Coupling = BcIngressCoupling;
module.exports.meta = {
    name: 'bcIngressCoupling',
    description: 'Business Central Ingress Coupling',
    descriptionTemplate: 'Business Central Ingress {{companyName}} {{dataSource}}',
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
        },
    }
}