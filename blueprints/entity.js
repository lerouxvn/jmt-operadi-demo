const {Blueprint} = require('jmt-api');
const {EntanglementEntityBlueprint} = require('./entanglement.entity')
const model = {
    collection: 'entities',
    // projection: {
    //     name: 1,
    // },
    sort: {
        name: 1
    },
    defaultData: {
        name: '',
        emails: []
    },
    search: 'name',
    auditTrail: true,
    version: 'B1'
};

class EntityBlueprint extends Blueprint {

    entanglementBlueprint

    constructor(jmtMongo) {
        super(model, jmtMongo);
        this.entanglementBlueprint = new EntanglementEntityBlueprint(jmtMongo);
    }

    async beforeSaveAsync(master, data, user, options) {
        console.log('SAVE ENTITY')
        if (data.company)
            data.name = data.company.regName;
        // if (master && master.entanglements)
        //     for (let entanglement of master.entanglements) {
        //         if (!data.entanglements)
        //             data.entanglements = [];
        //         data.entanglements.push({_id: entanglement._id, update: true})
        //     }

        return super.beforeSaveAsync(master, data, user, options);
    }

    async afterSaveAsync(master, data, user, options, hasChanges = false) {
        console.log('---------------------', hasChanges)
        if (hasChanges) {
            // await this.entanglementBlueprint.updateManyAsync({_idDocument: data._id}, {$set: {update: true}})
            const ent = await this.entanglementBlueprint.findAsync({
                match: {_idDocument: data._id, action: 'push'},
                session: options.session
            })
            for (let e of ent.documents) {
                await this.entanglementBlueprint.saveAsync({_id: e._id, update: true, _hash: e._hash}, options, user)
            }
        }
        setTimeout(() => {
            console.log("BEFORE ASYNC---------------------------")
            // console.log(base)
            // base.initAsync().catch(console.error)
            console.log("AFTER ASYNC---------------------------")
        }, 0)
        return super.afterSaveAsync(master, data, user, options, hasChanges);
    }

}

module.exports.EntityBlueprint = EntityBlueprint;

