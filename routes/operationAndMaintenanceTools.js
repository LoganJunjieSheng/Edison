var express = require('express');
var router = express.Router();
var restartAndSwitch = require('../public/javascripts/operationAndMaintenanceTools/restartAndSwitch');
var passport = require('../public/javascripts/passport_config.js')
var jwt = require('jsonwebtoken');
var logger=require('../logs/config.js').logger

router.get('/', passport.authenticate('jwt'),function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html'));
});
//往kafka传json数据
router.post('/restartAndSwitch',passport.authenticate('jwt'), function (req, res, next) {
	let username = jwt.decode(req.headers.authorization.slice(7)).username;
    restartAndSwitch.handleKafka(req, res, next);
	logger.info('运维工具使用 \n'
				+'username: '+username+'\n'
				+'operation: '+req.body.operation+' , server: '+req.body.server+' , option: '+req.body.option)
});
module.exports = router;
