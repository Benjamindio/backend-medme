require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var medicamentsRouter = require('./routes/medicaments')
var ordersRouter = require('./routes/orders')
var pharmacieRouter = require('./routes/pharmacie')

var app = express();
require('./models/connection');
const cors = require('cors');

const fileUpload = require('express-fileupload');


 // creer la base de donnee et connection string
app.use(fileUpload());
 app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/medicaments', medicamentsRouter)
app.use('/orders', ordersRouter)
app.use('/pharmacies', pharmacieRouter)
console.log("ici")
module.exports = app;
