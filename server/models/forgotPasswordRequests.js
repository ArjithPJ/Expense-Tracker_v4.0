const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);


// const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests', {
//   uuid: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true
//   },
//   userId: {
//     type: Sequelize.INTEGER,
//     allowNull: false
//   },
//   isActive: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//     defaultValue: true
//   }
// });

// module.exports = ForgotPasswordRequests;