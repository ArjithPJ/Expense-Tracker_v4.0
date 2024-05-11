const User = require('../models/users');

const ForgotPasswordRequest = require('../models/forgotPasswordRequests');

const { v4: uuidv4 } = require('uuid');
const Sib = require('sib-api-v3-sdk');

require('dotenv').config();


exports.postForgotPassword = async (req, res, next) => {
    const email =req.body.email;
    const client = Sib.ApiClient.instance;
    try{
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SMTP_API_KEY;

        const resetToken = uuidv4();
        const resetLink = `http://localhost:3000/password/resetpassword/${resetToken}`;
        console.log("Reset Link:", resetLink);

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'pjarjith@gmail.com'
        }
        const receivers = [
            {
                email: email
            }
        ]

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password',
            htmlContent: `Click <a href="${resetLink}">here</a> to reset your password.`
        });
        console.log("Email Sent");
        console.log(resetToken);

        const user = await User.findOne({ email: email});
        let userId;
        console.log(user.id);
        if(user){
            userId = user.id;
            const newForgotPasswordRequest = new ForgotPasswordRequest({
                uuid: resetToken,
                userId: userId,
                isActive: true
            });
            await newForgotPasswordRequest.save();
        }
        else{
            throw error;
        }
        
        res.status(200).json({message: "Email sent", email: email});
    }
    catch(error){
        console.error(error);
        console.log("Email couldn't be sent");
        res.status(500).json({message: "Internal Server Error"});
    }
};
