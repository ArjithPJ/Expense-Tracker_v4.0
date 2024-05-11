const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
// const sequelize = require('../util/database');
const mongoose = require('mongoose');
require('dotenv').config();


exports.getSignup = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', '../','client', 'Signup', 'signup.html'));
};

exports.postSignup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email});
        if (existingUser) {
            console.log("Account already exists");
            return res.status(409).json({message: "Account already exists"});
        }

        // Encrypt the password
        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);

        // Create user with encrypted password
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword // Store the hashed password
        });
        console.log(newUser);
        newUser.save()
        .then(result => {
            const token = jwt.sign({id: newUser._id}, process.env.TOKEN_SECRET);
            return res.status(201).json({message: "Signup successful", token: token});
        })
        .catch(err => {
            console.log(err);
        })
                
    } 
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
