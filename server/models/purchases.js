const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  paymentid: {
    type: String,
    required: true
  },
  // orderid: {
  //   type: String,
  //   required: true
  // },
  status: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);


// const Orders = sequelize.define('orders', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   paymentid: Sequelize.STRING,

//   orderid: Sequelize.STRING,
//   status: Sequelize.STRING
// });

// module.exports = Orders;

