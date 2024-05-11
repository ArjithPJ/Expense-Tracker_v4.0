const Users = require('../models/users');
const Expense = require('../models/expenses');
const jwt = require('jsonwebtoken');
require('dotenv').config();



exports.getExpenses = async (req, res, next) => {
    try{
        const page = req.query.page;
        const selectedValue = req.query.selectedValue;
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header is missing or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract just the token value
        console.log("Token:", token);
        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
        const id = decoded.id;
        const total = await Expense.countDocuments({ userId: id});
        console.log(total);
        let pageExpenses = await Expense.find({userId: id}).skip((page-1)*selectedValue).limit(selectedValue);        
        console.log("pageExpenses:", pageExpenses);
        res.status(200).json({
            pageExpenses: pageExpenses,
            currentPage: parseInt(page,10),
            hasNextPage: parseInt(selectedValue,10)*parseInt(page,10)<total,
            nextPage: parseInt(page,10) + 1,
            hasPreviousPage: parseInt(page,10) > 1,
            previousPage: parseInt(page,10) - 1,
            lastPage: Math.ceil(total/parseInt(selectedValue,10))
        });
        
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error});
    }
}


exports.postAddExpense = async (req, res, next) => {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const token = req.body.token;
    const currentPage = req.body.currentPage;
    const selectedValue = req.body.selectedValue;
    try {
        // Verify the token
        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Decoded token:', decoded);

        // Create the expense
        const newExpense = new Expense({
            amount: amount,
            description: description,
            category: category,
            userId: decoded.id
        });

        await newExpense.save();
        console.log(newExpense);
        // Increment the totalExpense for the user
        await Users.findByIdAndUpdate(
            decoded.id, {$inc: { totalExpense: amount}}
        );
        // Fetch the updated expenses
        const expenses = await Expense.find({userId: decoded.id});

        // Send the response
        console.log("Final Expenses: ", expenses);

        const skip = (currentPage -1)* selectedValue;

        const total = expenses.length;
        const pageExpenses = await Expense.find({
            userId: decoded.id}).skip(skip).limit(selectedValue);        
        const lastPage = Math.ceil(total/selectedValue);        
        console.log("pageExpenses:",pageExpenses);
        console.log("Expenses:", expenses);
        return res.status(200).json({ message: 'Expense Added', expenses: expenses, pageExpenses: pageExpenses,currentPage: parseInt(currentPage,10),
        hasNextPage: parseInt(currentPage,10)<total,
        nextPage: parseInt(currentPage, 10)+1,
        hasPreviousPage: parseInt(currentPage,10) > 1,
        previousPage: parseInt(currentPage,10) - 1,
        lastPage: parseInt(lastPage,10),
        selectedValue: selectedValue });
        
        
    } 
    catch (error) {
        // Rollback the transaction if an error occurs
        console.error('Error creating expense:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.postDeleteExpense = async (req, res, next) => {
    const expenseId = req.body.expense_id;
    const token = req.body.token;
    const currentPage = req.body.currentPage;
    const selectedValue = req.body.selectedValue;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Decoded token:', decoded.id);

        try {
            // Find the expense by its primary key and delete it
            const expense = await Expense.findByIdAndDelete(expenseId);
            const amount = expense.amount;
            await Users.findByIdAndUpdate(decoded.id, { $inc: { totalExpense: -amount } });
            
            const pageExpenses = await Expense.find({ userId: decoded.id })
            .skip((currentPage - 1) * selectedValue)
            .limit(selectedValue);
    
            // Retrieve updated expenses
            const expenses = await Expense.find({ userId: decoded.id });
            console.log("pageExpenses:",pageExpenses);
            console.log("Expenses:", expenses);
            let total = 0;
            if(!expenses){
                total = 0;
            }
            else{
                total =expenses.length;
            }
            if(!pageExpenses){
                pageExpenses = await Expense.find({userId: decoded.id}).skip((currentPage-2)*selectedValue).limit(selectedValue);
                console.log("pageExpenses:", pageExpenses);
                res.status(200).json({
                    pageExpenses: pageExpenses,
                    currentPage: parseInt(currentPage,10)-1,
                    hasNextPage: parseInt(selectedValue,10)*(parseInt(currentPage,10)-1)<total,
                    nextPage: parseInt(currentPage,10),
                    hasPreviousPage: (parseInt(currentPageage,10)-1) > 1,
                    previousPage: parseInt(currentPage,10) - 2,
                    lastPage: Math.ceil(total/parseInt(selectedValue,10))
                });
            }
            else{
                const lastPage = Math.ceil(total/selectedValue);
                return res.status(200).json({ message: 'Expense Added', expenses: expenses, pageExpenses: pageExpenses,currentPage: parseInt(currentPage,10),
                hasNextPage: parseInt(currentPage,10)<total,
                nextPage: parseInt(currentPage, 10)+1,
                hasPreviousPage: parseInt(currentPage,10) > 1,
                previousPage: parseInt(currentPage,10) - 1,
                lastPage: parseInt(lastPage,10),
                selectedValue: selectedValue });
            }
            
        } catch (error) {
            console.log('Error deleting expense:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    } catch (error) {
        console.log('Token Verification failed:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};








