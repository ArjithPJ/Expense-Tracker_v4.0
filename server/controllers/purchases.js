const Users = require('../models/users');
const Expenses = require('../models/expenses');
const Order = require('../models/purchases');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Razorpay = require('razorpay');
require('dotenv').config();


exports.postbuyPremium = async (req, res, next) => {
    try{
        console.log("Req.body: ", req.body);
        const { paymentId, token } = req.body;
        
        // Here, you would typically store the payment ID in your database
        // This is just a placeholder response
        const id = jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if(err){
                console.log("Something went wrong");
            }
            else{
                return decoded;
            }
        });
        const newOrder = new Order({
            paymentid: paymentId,
            status: "Paid",
            userId: id.id
        });

        await newOrder.save();

        console.log('Storing payment ID:', paymentId);
        console.log(id);
        await Users.findOneAndUpdate({
            id: id.id,
            premium: true
        });
        res.status(200).json({ message: 'Payment ID stored successfully', payment_id: paymentId, premium: true });
    }
    catch(error){
        console.error("Error processing premium purchase:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};


exports.postLeaderboard = async (req, res, next) => {
    try{
        const users =await Users.find({})
        .select('_id name totalExpense')
        .sort({totalExpense: -1});
        res.status(200).json({ leaderboard: users});
    }
    catch(error){
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};