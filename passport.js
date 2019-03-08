const passport = require('passport');
const passportJWT = require('passport-jwt');
const mongoose = require('mongoose');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const UserModel = mongoose.model('UserModel');

const TOKEN_SECRET = require('./secret.token');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, function(email, password, done) {
    return UserModel.findOne({email, password})
        .then(user => {
            if(!user) {
                return done(null, false, {message: 'Incorrect email or password'});
            }
            return done(null, user, {message: 'Logged in successfully'});
        })
        .catch(err => done(err));
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: TOKEN_SECRET
}, function(jwtPayload, done) {

    return UserModel.findOneById(jwtPayload.id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        })
}));