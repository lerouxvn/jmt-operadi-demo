const {CouplingBase} = require('jmt-operadi')
const https = require("https");
const url = require('url')
const {api} = require("../app");
const fetch = require("node-fetch");

class BaseBcCoupling extends CouplingBase {

    TOKENS = {};
    dbProjection = {};

    constructor(couplingBlueprint, couplingData, processBlueprint) {
        super(couplingBlueprint, couplingData, processBlueprint);
        this.dbProjection = {
            name: 1,
            company: {accNumber: 1},
            client: {accNumber: 1},
            vendor: {accNumber: 1},
            _hash: ''
        }

        console.log('BaseBcCoupling constructor - ', couplingData.information.action)
    }

    async getTokenAsync() {
        const tenantId = this.couplingData.information.tenantId;
        const clientId = this.couplingData.information.clientId;
        const clientSecret = this.couplingData.information.secret;
        let data = `client_id=${clientId}&Client_secret=${clientSecret}&grant_type=client_credentials&scope=https://api.businesscentral.dynamics.com/.default`

        const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/V2.0/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            },
            body: data
        })

        if (response.ok) {
            const jsonData = await response.json()
            // console.log(jsonData)
            if (jsonData.error) {
                throw `${jsonData.error} - ${jsonData.error_description}`;
            } else {
                this.TOKENS[tenantId] = {[clientId]: jsonData}
                return this.TOKENS[tenantId][clientId];
            }
        } else {
            console.log(`Error getTokenAsync to BC`, response.statusText, response.statusCode)
            throw response.statusText || `Receive status code of ${response.statusCode}`
        }
    }

    async getCompanyDataAsync() {
        const environment = this.couplingData.information.environment;
        const token = await this.getTokenAsync();

        const response = await fetch(`https://api.businesscentral.dynamics.com/v2.0/${environment}/api/v2.0/companies?$select=id,name`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token.access_token,
                'Accept': 'application/json; odata.metadata=minimal',
                'Content-Type': 'application/json; odata.metadata=minimal'
            }
        })
        if (response.ok) {
            const jsonData = await response.json()
            console.log(jsonData)
            if (jsonData.error) {
                throw `${jsonData.error} - ${jsonData.error_description}`;
            } else {
                if (jsonData.value && jsonData.value[0])
                    return jsonData.value.map((item) => {
                        return {key: item.id, value: item.name}
                    });
                else
                    throw 'Company not found';
            }
        } else {
            console.log(`Error getCompanyDataAsync to BC`, response.statusText, response.statusCode)
            throw response.statusText || `Receive status code of ${response.statusCode}`
        }
    }

    async testConnectionAsync() {
        console.log(' BC coupling testConnectionAsync-----')
        const t = await this.getCompanyDataAsync();
        // console.log('testConnectionAsync-----', t)
        this.couplingData.testResult = true;
        this.couplingData.information.meta = {companies: t}
        await super.testConnectionAsync()
        return this.couplingData;
    }

    timestampToDateString(timestamp) {
        console.log(timestamp)
        return (new Date(timestamp)).toISOString();
    }

    dateStringToTimestamp(dateString) {
        return (new Date(dateString)).getTime();
    }

}

module.exports.Coupling = BaseBcCoupling;
// module.exports.meta = {
//     name: 'baseBcCoupling',
//     description: 'Base Bc Coupling',
//     descriptionTemplate: 'Business Central {{companyName}} {{dataSource}} {{action}}',
//     collection: 'entities',
//     version: 'B1',
//     auth: {
//         environment: {
//             type: 'text',
//             required: true,
//             description: 'Environment',
//             hint: 'Environment Production or Sandbox',
//             error: ''
//         },
//         tenantId: {
//             type: 'text',
//             required: true,
//             description: 'TenantId',
//             hint: 'TenantId'
//         },
//         clientId: {
//             type: 'text',
//             required: true,
//             description: 'ClientId',
//             hint: 'ClientId'
//         },
//         secret: {
//             type: 'text',
//             required: true,
//             description: 'Secret',
//             hint: 'Secret'
//         }
//     },
//     data: {
//         companyId: {
//             type: 'selectInfo',
//             disabled: false,
//             required: true,
//             description: 'Company',
//             valueField: 'companyName',
//             hint: 'Company Id',
//             source: 'companies'
//         },
//         dataSource: {
//             type: 'select',
//             required: true,
//             description: 'Data Source',
//             options: [
//                 {key: 'customers', value: 'Customers'},
//                 {key: 'vendors', value: 'Vendors'},
//                 {key: 'employees', value: 'Employees'}
//             ]
//         },
//         action: {
//             type: 'select',
//             required: true,
//             description: 'Action',
//             options: [{key: 'pull', value: 'Pull'}, {key: 'push', value: 'Push'}, {
//                 key: 'ingress',
//                 value: 'Ingress'
//             }, {key: 'egress', value: 'Egress'}]
//         }
//     }
// }