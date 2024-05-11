const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);

// const Expenses = sequelize.define('expenses', {
//   expense_id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   amount: {
//     type: Sequelize.INTEGER,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
    
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false
//   }
// });

// module.exports = Expenses;