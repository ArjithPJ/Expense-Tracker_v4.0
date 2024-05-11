const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileUrlSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('FileUrl', fileUrlSchema);



// const FileUrls = sequelize.define('fileUrls', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     filename: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     fileUrl: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         primaryKey: true
//     }
// });

// module.exports = FileUrls;

