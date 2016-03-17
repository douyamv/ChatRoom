var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signin', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


*/
router.get('/', function (req, res) {
	console.log("get ///");
  if (req.cookies.user == null) {
    res.redirect('/signin');
  } else {
    res.render('index');
  }
});
router.get('/signin', function (req, res) {
	console.log("get signin");
  res.sendFile('views/index.html');
});

router.post('/signin', function (req, res) {
  if (users[req.body.name]) {
	  console.log("get signin2");
    //存在，则不允许登陆
    res.redirect('/signin');
  } else {
    //不存在，把用户名存入 cookie 并跳转到主页
    res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  }
});
module.exports = router;
