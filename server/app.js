const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//const errorController =require('./controllers/error');
// const sequelize = require('./util/database');

const Users = require('./models/users');
const Expenses = require('./models/expenses');
const Orders = require('./models/purchases');
const ForgotPasswordRequests = require('./models/forgotPasswordRequests');
const FileUrls = require('./models/fileUrls');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require("compression");
const morgan = require("morgan");

const app = express();
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// app.set('view engine', 'ejs');
// app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());


app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}),);


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());



app.use(adminRoutes);
//app.use(errorController.get404);

// Users.hasMany(Expenses);
// Expenses.belongsTo(Users, { foreignKey: 'id'});

// Users.hasMany(Orders);
// Orders.belongsTo(Users);

// Users.hasMany(ForgotPasswordRequests);
// ForgotPasswordRequests.belongsTo(Users);

mongoose
  .connect(
    'mongodb://localhost:27017/expense_tracker'
  )
  .then(result => {
    // User.findOne().then(user => {
    //   if(!user){
    //     const user = new User({
    //       name: 'Arjith',
    //       email: 'pjarjith@gmail.com',
    //       cart: {
    //         items: []
    //       }
    //     });
    //     user.save(); 
    //   }
      
    // });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });



