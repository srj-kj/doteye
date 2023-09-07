import express from 'express';
import dotenv from 'dotenv'
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import {  Response, NextFunction } from "express";

import User from '../model/userSchema';

dotenv.config();
const router = express.Router()


const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback' as string, 
    clientID: config.CLIENT_ID  as string,
    clientSecret: config.CLIENT_SECRET as string,
    passReqToCallback: true as true, 
    
}

async function verifyCallback(req:any,accessToken: string, refreshToken:string, profile:any, done:any) {
    console.log('Google profile', profile)
    await User.create(profile)
    done(null, profile) 
}


// Configure the Google strategy for use by Passport.js
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

// Save the session to the cookie
passport.serializeUser((user, done) => {
    done(null, user)
})

// Extract / Read the session from the cookie
passport.deserializeUser(({id}, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})



// Serialize the user profile into the session
function checkLoggedIn(req:any, res:Response, next:NextFunction) {
    console.log('Current user is:', req.user)
    const isLoggedIn = req.isAuthenticated() && req.user
    if (!isLoggedIn) {
        return res.status(401).json({
            error: 'You must be logged in!',
        })
    }
    next()
}

router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['email'],
    })
)

router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect: '/',
        session: true,
    }),
    (req, res) => {
        console.log('Google called us back!')
    }
)

router.get('/auth/logout', (req:any, res) => {
    req.logout() 
    return res.status(200).json({msg:"logout successfully"})
})

router.get('/secret', checkLoggedIn, (req, res) => {
    return res.status(200).json({msg:'Your personal secret value is 42!'})
})

router.get('/failure', (req, res) => {
    return res.status(200).json({msg:'You have failed to login!'})
})


export default router;