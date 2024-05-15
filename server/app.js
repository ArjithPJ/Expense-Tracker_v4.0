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


mongoose
  .connect(
    `mongodb://Arjith:${process.env.DB_PASSWORD}@docdb-2024-05-14-11-43-16.cluster-c3iekgymi65b.us-east-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`
  )
  .then(result => {
    console.log("Database connected")
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });



