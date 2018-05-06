var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//Importing all the routes
var indexRouter = require('./routes/index');
var createUser = require('./routes/create');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var profile = require('./routes/profile');
var loginUser = require('./routes/loginUser');
var updateUser = require('./routes/updateUser');
var updateNumber = require('./routes/updateNumber');

//Initializing our app
var app = express();
mongoose.connect('mongodb://localhost:27017/iii');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

//log routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

//other routes
app.use('/', indexRouter);
app.use('/create', createUser);
app.use('/loginUser', loginUser);
app.use('/updateUser', updateUser);
app.use('/updateNumber', updateNumber);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log('The 1st');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	console.log('The 2nd');

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
