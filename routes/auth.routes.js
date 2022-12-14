const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require('./../middleware/jwt.middleware');






const router = require("express").Router()
const saltRounds = 10;

// post /auth/signup


router.post('/signup', (req, res, next) => {
    const { name, email, password } = req.body;

    if (email === '' || password === '' || name === '') {
        res.status(400).json({ message: "Email, password, and name required." });
        return;
    }

    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address."});
        return;
    }
    
    const passwordRegex = /(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: "Password must have at least 6 characters and one uppercase letter."});
        return;
    }
    
    User.findOne({ email })

.then((foundUser) => {
    
    if (foundUser) {
        res.status(400).json({ message: "User already exists"});
        return;
    }
//
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return User.create({email, passwordHash: hashedPassword, name });
}) 
.then((createdUser) => {
    console.log(createdUser)
   
    const { email, name, _id} = createdUser;

    const user = { email, name, _id };

    res.status(201).json({ user: user});
})
.catch(err => {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" })
});

});

//post /auth/login

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password."});
        return;
    }

    User.findOne({ email })
    .then((foundUser) => {
        if(!foundUser) {
            res.status(401).json({ message: "User not found."})
            return;
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.passwordHash);

        if(passwordCorrect) {
console.log(foundUser)
            if(foundUser.profileId != null){
                foundUser.populate('profileId')
                .then(populatedFoundUser => {
                    const { _id, email, name, profileId } = populatedFoundUser;

                    const payload = { _id, email, name, profileId };
                    console.log(payload)
                    const authToken = jwt.sign(
                        payload, 
                        process.env.TOKEN_SECRET,
                        { algorithm: 'HS256', expiresIn: "6h" }
                    );
                    
                    res.status(200).json({ authToken: authToken });
                })
            } else {
                const { _id, email, name, profileId } = foundUser;

                    const payload = { _id, email, name, profileId };
                    console.log(payload)
                    const authToken = jwt.sign(
                        payload, 
                        process.env.TOKEN_SECRET,
                        { algorithm: 'HS256', expiresIn: "6h" }
                    );
                    
                    res.status(200).json({ authToken: authToken });
            }
            
            
        }
        else {
            res.status(401).json({ message: "Unable to authenticate the user."});
        }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error"}));

});


router.get('/verify', isAuthenticated, (req, res, next) => {
    console.log(`req.payload`, req.payload);

    res.status(200).json(req.payload);
});









module.exports = router;

