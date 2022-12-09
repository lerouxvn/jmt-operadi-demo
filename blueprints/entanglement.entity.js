const {Blueprint} = require('jmt-api');
const model = {
    collection: 'entanglements.entities',
    projection: {
        name: 1,
        _idDocument: 1,
        _idCoupling: 1,
        update: 1,
        error: 1,
        errorMessage: 1,
        action: 1,
        _hash: 1
    },
    sort: {
        name: 1
    },
    defaultData: {
        name: ''
    },
    search: 'name',
    version: 'EE1'
};

class EntanglementEntityBlueprint extends Blueprint {

    constructor(jmtMongo) {
        super(model, jmtMongo);
    }

    async beforeSaveAsync(master, data, user) {
        // console.log('SAVE ENTANGLEMENT ENTITY',master,data)
        return super.beforeSaveAsync(master, data, user);
    }

    async afterSaveAsync(master, data, user, session, hasChanges = false) {
        // console.log('afterSave ENTANGLEMENT ENTITY',master,data)
        return super.afterSaveAsync(master, data, user, session, hasChanges);
    }

}

module.exports.EntanglementEntityBlueprint = EntanglementEntityBlueprint;
