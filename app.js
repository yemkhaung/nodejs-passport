var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// configure Mongoose
// mongoose.connect('mongodb+srv://dev01:password01@dev-cluster-01-zskll.gcp.mongodb.net/devdb01?retryWrites=true', { useNewUrlParser: true });
mongoose.connect('mongodb://user1:password1@ds251588.mlab.com:51588/dev01', { useNewUrlParser: true });
// mongoose.connect('mongodb://localhost:27017/dev01');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.set('debug', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

require('./models/user');
require('./passport');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', passport.authenticate('jwt', {session: false}), usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
