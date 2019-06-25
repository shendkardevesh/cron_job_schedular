var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var schedule = require('node-schedule');

// get email cron job controller
let emailCronCtrl = require('./controller/emailCron');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

schedule.scheduleJob('email', '0 10-20/1 * * *', function(fireDate) {
  console.log('cron job started');
  console.log(fireDate);
  console.log(fireDate.toLocaleString());
  let date = new Date(fireDate.toLocaleString());
  console.log(date.getHours());
  console.log(date.getMinutes());
  if (date.getHours() == 19) {
    console.log('time to send email');
    emailCronCtrl.sendEmail(date)
      .then(response => {
        console.log(`email send with message id '${response}'`);
      })
      .catch(err => {
        console.log(err);
      })
  } else {
    console.log('into else condition :');
    emailCronCtrl.save(date)
      .then(response => {
        console.log(`record created successfully for ${date.getHours()}`);
      })
      .catch(err => {
        console.log(err);
      });
  }
});

module.exports = app;
