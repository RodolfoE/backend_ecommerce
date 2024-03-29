var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var produto = require('./routes/produto');
var cliente = require('./routes/cliente');
var compra = require('./routes/compra');
var envio = require('./routes/envio');
var funcionario = require('./routes/funcionario');

///Authentication Packages
var session = require('express-session');
var passport = require('passport'); 

var app = express();
app.use(express.static('uploads'));

var cors = require('cors')
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Code for session 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
  ///,cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/cli', cliente);
app.use('/prod', produto);

app.use('/comp', compra);
app.use('/env', envio);
app.use('/func', funcionario);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
