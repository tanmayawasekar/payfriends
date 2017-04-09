const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const utils = require('./helpers/utils');
const verifyJwtToken = require('./controlers/verifyJwtToken');
require('./config/allConfig');
require('./models/users');

const index = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	'extended': false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//verifyJwtToken
app.use(verifyJwtToken);

//render routes
app.use('/', index);
app.use('/users', users);

//api routes
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Route Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	err.status = utils.getErrorStatus(err.message);
	err.message = err.status === 500 ? 'Internal Server Error' : err.message;
	res.status(err.status);
	res.send(err.message);
});

module.exports = app;