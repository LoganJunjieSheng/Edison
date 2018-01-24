var express = require('express');
var router = express.Router();
var passport = require('../public/javascripts/passport_config.js')
var jwt = require('jsonwebtoken');
var logger=require('../logs/config.js').logger
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html'));
});
router.post('/test', passport.authenticate('local'), function(req, res) {
	logger.info('action : 用户登录成功 \n'+'username : '+req.body.username+'  password : '+req.body.password);
	res.json({
		type:"success",
		token:jwt.sign({username:req.user.username},'sjj',{expiresIn:60*60*24})
	});
});

router.post('/jwt', passport.authenticate('jwt'), function(req, res) {
    res.json({
        type:"success",
    });

});

module.exports = router;
