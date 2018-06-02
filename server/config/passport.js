const passport = require('passport')
const LocalPassport = require('passport-local')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../data/User')

const facebookVariables = {
    clientID: '187186388779432',
    clientSecret: 'bd7451ee07809848b3292a999a798db5',
    callbackURL: 'http://localhost:1337/auth/facebook/callback'
  }

const authenticateUser = (username, password, done) => {
    User.findOne({ email: username }).then(user => {
        if (!user) {
            return done(null, false);
        }

        if (!user.authenticate(password)) {
            return done(null, false);
        }

        return done(null, user);
    });
};

module.exports = () => {
    passport.use(new LocalPassport({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser));

    passport.use(new FacebookStrategy({
        clientID: facebookVariables.clientID,
        clientSecret: facebookVariables.clientSecret,
        callbackURL: facebookVariables.callbackURL,
        profileFields: ['email', 'displayName']
    }, function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.displayName }, (err, user) => {
            if (err) {
                console.log(err)
            }
            if (!err && user !== null) {
                done(null, user)
            } else {
                // using displayName only for login to Facebook
                User.create({
                    email: profile.displayName,
                    type: 'fb'
                }).then((user) => {
                    done(null, user)
                })
            }
        })
    }
    ))

    passport.serializeUser((user, done) => {
        if (!user) {
            return done(null, false);
        }

        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            if (!user) {
                return done(null, false)
            }

            return done(null, user);
        })
    })
}