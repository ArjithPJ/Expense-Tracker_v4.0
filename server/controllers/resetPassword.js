const User = require('../models/users');
const ForgotPasswordRequest = require('../models/forgotPasswordRequests');
const bcrypt = require('bcrypt');
const path = require('path');

require('dotenv').config();


exports.getResetPassword = async (req, res, next) => {
    const uuid = req.params.uuid;
    console.log(uuid);
    try{
        res.sendFile(path.join(__dirname, '../', '../','client', 'Login', 'resetPassword.html'));
    }
    catch(error){
        console.error(error);
    }
};

exports.postResetPassword = async (req, res, next) => {
    const newPassword = req.body.password;
    const email = req.body.email;
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltrounds);
    try{
        const user = await User.findOne({ email: email});
        const isActive = await ForgotPasswordRequest.findOne({userId: user.id });
        if(isActive.isActive){
        
            await User.updateOne(
                { password: hashedPassword },
                { email: email }
            );
            await ForgotPasswordRequest.updateOne(
                {isActive: false},
                {userId: user._id}
            );
            res.status(200).json({message: "Password Updated"});
        }
        else{
            res.status(401).json({message: "Reset Password Link expired"});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
