const express = require("express");
const process = require('node:process');
const bodyParser = require("body-parser");
const path = require("path");
const passport = require('passport');
const cookieSession = require('cookie-session');
const morgan = require('morgan')
const settings = require('./auth/settings');
const {Api} = require('jmt-api');
const app = express();

// console.log(settings)
app.api = new Api(settings);
app.use(morgan('dev'))
app.use(cookieSession({
    name: 'jmt',
    maxAge: 24 * 60 * 60 * 1000,
    keys: settings.keys
}));

app.use(bodyParser.json());

const server = app.listen(process.env.PORT || 4000, function () {
    console.log("JMT now running:", server.address());
});

app.use(passport.initialize({}));
app.use(passport.session({pauseStream: true}));

// app.all("*", (req, res, next) => {
//     console.log(`${(new Date(Date.now())).toUTCString()} - ${req.originalUrl}`)
//     next()
// })


app.get("/api/status", (req, res) => {
    res.status(200).json({status: "UP"});
});

app.get("/api/", (req, res) => {
    res.status(200).json({status: "Jedi Mind Tricks - API"});
});

app.api.jmtMongo.connectAsync()
    .then(() => {
        const auth = require('./routes/auth')
        app.use('/auth', auth);
        const authService = require('./auth/authService');
        const distDir = __dirname + "/dist/jmt-app";
        app.use(express.static(distDir));
        //app.use(app.api.jmtMongo.parseOptions)

        //register
        const {EntityBlueprint} = require('./blueprints/entity')
        app.api.registerBlueprint(EntityBlueprint);
        const {EntanglementEntityBlueprint} = require('./blueprints/entanglement.entity')
        app.api.registerBlueprint(EntanglementEntityBlueprint);

        // const {CouplingBlueprint} = require('jmt-operadi')
        // console.log('register')
        // app.api.registerBlueprint(CouplingBlueprint);

        // const baseCoupling = require('./coupling/base')
        // baseCoupling.initAsync().catch(console.error)
        setInterval(() => {
            app.api.jmtMongo.rabbit.publish('1')
        }, 30000)
        console.log('couplings')
        const {Orchestrator} = require('jmt-operadi');
        const orchestrator = new Orchestrator(app.api, path.join(__dirname, 'couplings'), authService.apiGuard);
        app.use('/api/couplings', orchestrator.router);
        app.use('/api', authService.apiGuard, app.api.router);
        app.get("*", authService.guard, function (req, res) {
            console.log('PIET IS HIER')
            res.sendFile(path.join(__dirname, '/dist/jmt-app/index.html'));
        });
    })
    .catch(err => {
        console.log('MONGO CONNECTION FAILED -- ' + err.toString())
    })

module.exports.api = app.api;
