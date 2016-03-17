var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http =require('http');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  if (req.cookies.user == null) {
    res.redirect('/signin');
  } else {
    res.sendfile('views/index.html');
  }
});

app.get('/signin', function (req, res) {
	console.log("get signin");
	res.sendfile('views/signin.html');
  //res.send('ok');
});

app.post('/signin', function (req, res) {
  if (users[req.body.name]) {
    //存在，则不允许登陆
    res.redirect('/signin');
  } else {
    //不存在，把用户名存入 cookie 并跳转到主页
    res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  }
});
//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
var users = {};//存储在线用户列表的对象


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
     
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
 
});

//app.use(express.cookieParser());

var cookieParser = require('cookie-parser')
app.use(cookieParser())


var server = http.createServer(app);
var io = require('socket.io').listen(server);
console.log("socket io success");
io.sockets.on('connection', function (socket) {
	 console.log("yonghu shangxian");
	
	//有人上线
socket.on('online', function (data) {
  //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
 
  socket.name = data.user;
  //users 对象中不存在该用户名则插入该用户名
  if (!users[data.user]) {
    users[data.user] = data.user;
  }
  //向所有用户广播该用户上线信息
  io.sockets.emit('online', {users: users, user: data.user});
});
//有人发话
socket.on('say', function (data) {
  if (data.to == 'all') {
    //向其他所有用户广播该用户发话信息
    socket.broadcast.emit('say', data);
  } else {
    //向特定用户发送该用户发话信息
    //clients 为存储所有连接对象的数组
    var clients = io.sockets.clients();
    //遍历找到该用户
    clients.forEach(function (client) {
      if (client.name == data.to) {
        //触发该用户客户端的 say 事件
        client.emit('say', data);
      }
    });
  }
});
});
server.listen(8000);
module.exports = app;
