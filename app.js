const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

//**********************引入路由文件开始**********************//
const index = require('./routes/index');
const users = require('./routes/users');
const doc = require('./routes/doc');
const config = require('./config')
//**********************引入路由文件结束**********************//



// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 加载中间件
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//**********************设置路由开始**********************//
app.use('/', index);
app.use('/users', users);
app.use('/doc', doc);

//**********************设置路由结束**********************//

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (req.url.substr(0, 5) == "/doc/") {
    var file = config.RelativePath + req.url.substr(5);
    console.log(file);
    if (fs.existsSync(file)) {
      console.log(file);
      res.sendFile(file);
      return;
    }
  }

  var err = new Error('Not Found' + JSON.stringify(req.url));
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
