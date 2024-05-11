const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  premium: {
    type: Boolean,
    default: false
  },
  totalExpense: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);


// const Users = sequelize.define('users', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false
    
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   premium: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   },
//   totalExpense: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   }
// });

// module.exports = Users;



