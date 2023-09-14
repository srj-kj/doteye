"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userSchema_1 = __importDefault(require("../model/userSchema"));
dotenv_1.default.config();
const router = express_1.default.Router();
const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
};
const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    passReqToCallback: true,
};
async function verifyCallback(req, accessToken, refreshToken, profile, done) {
    console.log('Google profile', profile);
    // await User.create(profile)
    done(null, profile);
}
// Configure the Google strategy for use by Passport.js
passport_1.default.use(new passport_google_oauth20_1.Strategy(AUTH_OPTIONS, verifyCallback));
// Save the session to the cookie
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
// Extract / Read the session from the cookie
passport_1.default.deserializeUser(({ id }, done) => {
    userSchema_1.default.findById(id).then((user) => {
        done(null, user);
    });
});
// Serialize the user profile into the session
function checkLoggedIn(req, res, next) {
    console.log('Current user is:', req.user);
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) {
        return res.status(401).json({
            error: 'You must be logged in!',
        });
    }
    next();
}
router.get('/auth/google', passport_1.default.authenticate('google', {
    scope: ['email'],
}));
router.get('/auth/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true,
}), (req, res) => {
    console.log('Google called us back!');
});
router.get('/auth/logout', (req, res) => {
    req.logout();
    return res.status(200).json({ msg: "logout successfully" });
});
router.get('/secret', checkLoggedIn, (req, res) => {
    return res.status(200).json({ msg: 'Your personal secret value is 42!' });
});
router.get('/failure', (req, res) => {
    return res.status(200).json({ msg: 'You have failed to login!' });
});
exports.default = router;
