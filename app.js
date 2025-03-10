require('dotenv').config();
require('./models/connection');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cartsRouter = require('./routes/carts');
var articlesRouter = require('./routes/articles'); // imports pour utiliser les routes d'articles
var ordersRouter = require('./routes/orders');
var reviewsRouter = require('./routes/reviews')

var app = express();
const cors = require('cors');
app.use(cors());

const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/carts', cartsRouter);
app.use('/orders', ordersRouter);

app.use('/articles', articlesRouter); //
app.use('/reviews', reviewsRouter);


module.exports = app;
