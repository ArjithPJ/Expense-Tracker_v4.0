const User = require('../models/users');
const Expenses = require('../models/expenses');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

exports.postLogin = async (req, res, next) => {
    try{
        
        const email = req.body.email;
        const password = req.body.password;

    
        const user = await User.findOne({ email: email });

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (isPasswordCorrect) {
                const userId = user._id;
                const premium = user.premium;
                console.log("User id:", userId);
                const expenses = await Expenses.find({userId: userId});
                let total;
                if (!expenses) {
                    total = 0;
                }
                else{
                    total = expenses.length;
                }
                const pageExpenses = await Expenses.find({userId: userId}).limit(5);
                console.log("pageExpenses:", pageExpenses);
                const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET);
                res.status(200).json({ token: token, id: userId, expenses: expenses, premium: premium, pageExpenses: pageExpenses, currentPage: 1,
                    hasNextPage: 5<total,
                    nextPage: 2,
                    hasPreviousPage: 1 > 1,
                    previousPage: 0,
                    lastPage: Math.ceil(total/5),
                    selectedValue: 5});
            } else {
                res.status(401).json({ message: "Incorrect Password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};