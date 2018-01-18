var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var operationAndMaintenanceTools=require('./routes/operationAndMaintenanceTools');
var dataMonitoringAndAlarm=require('./routes/dataMonitoringAndAlarm');
var authority=require('./routes/authority')
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
var app = express();
var expressSession = require('express-session');
var passport = require('./public/javascripts/passport_config.js');
//前后路由连接中间件
app.use('/', require('connect-history-api-fallback')()); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets/build')));
//app.listen('192.168.1.48');
app.use(allowCrossDomain);
app.use(expressSession({
	secret: 'cheneyxu',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
app.use('/dataMonitoringAndAlarm',dataMonitoringAndAlarm);
app.use('/operationAndMaintenanceTools',operationAndMaintenanceTools);
app.use('/authority',authority)
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
