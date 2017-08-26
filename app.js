const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const utils = require('./helpers/utils');
// const token = require('./controlers/token');
const helmet = require('helmet');
require('./config/allConfig');
require('./models/users');

const index = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger(':method :url :date :remote-addr :status :response-time'));
//Security Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	'extended': false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//verifyJwtToken
// app.use(token.verifyJwtToken);

//render routes
app.use('/', index);
app.use('/users', users);

//api routes
app.use('/api', api);

// app.use(sendNewToken);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	console.log(err.stack);
	err.status = utils.getErrorStatus(err);
	err.message = err.status === 500 ? 'Internal Server Error' : err.message;
	res.status(err.status);
	res.send(err.message);
});

module.exports = app;