const {Blueprint} = require('jmt-api');

const model = {
    collection: 'users',
    projection: {
        name: 1,
        avatar: 1,
        emails: {_id: 1, value: 1},
        authorised: 1
    },
    sort: {
        name: 1
    },
    defaultData: {
        name: '',
        emails: []
    },
    search: 'name',
    version: 'v1'
};

class UserBlueprint extends Blueprint {

    constructor(jmtMongo) {
        super(model, jmtMongo);
    }

    async beforeSaveAsync(master, data, user, options) {
        if (master && data.emails && master.emails) {
            for (let dataEmail of data.emails) {
                for (let masterEmail of master.emails) {
                    if (dataEmail.value === masterEmail.value) {
                        dataEmail._id = masterEmail._id;
                        break;
                    }
                }
            }
        }
        return super.beforeSaveAsync(master, data, user, options);
    }

}

module.exports.UserBlueprint = UserBlueprint;
