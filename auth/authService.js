const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const settings = require('./settings')
const {isNullOrUndefined} = require("jmt-api");
const {api} = require("./../app");
const {UserBlueprint} = require("./user");
const user = api.registerBlueprint(UserBlueprint)
const users = {};

// console.log("user.getNew()",user.getNew())

passport.serializeUser(function (user, cb) {
    users[user._id] = user;
    cb(null, user._id);
});

passport.deserializeUser(function (obj, cb) {
    if (users[obj])
        cb(null, users[obj])
    else {
        console.log('deserializeUser', obj)
        user.getOneByIdAsync(obj, undefined)
            .then(user => {
                user.rabbit = settings.rabbit
                users[obj] = user;
                cb(null, users[obj]);
            })
            .catch(err => {
                console.error(err);
            })
    }
});

passport.use(new GoogleStrategy({
        clientID: settings.google.clientId,
        clientSecret: settings.google.clientSecret,
        callbackURL: settings.google.redirect || "http://localhost:4000/auth/google/callback",
        // callbackURL: "http://localhost:4000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        user.getOneAsync({googleId: profile.id}, undefined)
            .then(userData => {
                console.log(userData)
                if (isNullOrUndefined(userData)) {
                    const newUser = user.getNew();
                    console.log('newUser', newUser)
                    return user.saveAsync({
                        ...newUser,
                        name: profile.displayName,
                        avatar: profile.photos[0].value,
                        emails: profile.emails,
                        googleId: profile.id
                    }, undefined, {name: 'SYSTEM'})
                } else
                    return user.saveAsync({
                        _id: userData._id,
                        emails: profile.emails,
                        name: profile.displayName,
                        avatar: profile.photos[0].value,
                        _hash: userData._hash
                    }, undefined, userData);
            })
            .then(userData => {
                userData.rabbit = settings.rabbit
                cb(undefined, userData)
            })
            .catch(err => {
                console.error(err);
            });
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
    }
));

const guard = (req, res, next) => {
    if (req.user && req.user.authorised) {
        // console.log(req.user)
        next();
    } else if (req.user && !req.user.authorised) {
        res.redirect('/auth/unauthorised');
    } else {
        res.redirect('/auth/login');
    }
}

const apiGuard = (req, res, next) => {
    if (req.user && req.user.authorised) {
        // console.log(req.user)
        next();
    } else if (req.user && !req.user.authorised) {
        res.json({error: true, message: 'Unauthorised', errorCode: 2});
    } else {
        res.json({error: true, message: 'Invalid token', errorCode: 1});
    }
}

module.exports.guard = guard;
module.exports.apiGuard = apiGuard;
