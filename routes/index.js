var express = require('express');
var router = express.Router();
var passport = require('../public/javascripts/passport_config.js')
var jwt = require('jsonwebtoken');
var logger = require('../logs/config.js').logger
router.get('/', function (req, res, next) {
	res.sendfile(path.join(__dirname, 'index.html'));
});
//用户登录，如果账户密码验证成功返回一个24小时有效的token
router.post('/test', passport.authenticate('local'), function (req, res) {
	logger.info('action : 用户登录成功 \n' + 'username : ' + req.body.username + '  password : ' + req.body.password);
	res.json({
		type: "success",
		token: jwt.sign({
			username: req.user.username
		}, 'sjj', {
			expiresIn: 60 * 60 * 24
		}) //第一个字段为token加密的内容，第二个字段为秘钥，第三个字段为toke有效实际
	});
});
//用于验证本地的token是否有效的接口，测试用，无实际用处
router.post('/jwt', passport.authenticate('jwt'), function (req, res) {
	res.json({
		type: "success",
	});

});

module.exports = router;