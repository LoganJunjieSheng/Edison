var express = require('express');
var router = express.Router();
var alarmList = require('../public/javascripts/dataMonitoringAndAlarm/alarmList');
var ratio = require('../public/javascripts/dataMonitoringAndAlarm/ratio');
var ack = require('../public/javascripts/dataMonitoringAndAlarm/ack');
var passport = require('../public/javascripts/passport_config.js');
var jwt = require('jsonwebtoken');
var logger = require('../logs/config.js').logger

router.get('/', passport.authenticate('jwt'), function (req, res, next) {
    res.sendfile(path.join(__dirname, 'index.html'));
});
//获取报警表
router.post('/alarmList', passport.authenticate('jwt'), function (req, res, next) {
    alarmList.getAlarmList(req, res, next);
});
//获取同环比数据
router.post('/ratio', passport.authenticate('jwt'), function (req, res, next) {
    ratio.getRatio(req, res, next);
});
//ack
router.post('/ack', passport.authenticate('jwt'), function (req, res, next) {
    console.log(req.body)
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    ack.handleKafka(req, res, next);
    logger.info('ack一个报警\n' +
        'username: ' + username + '\n' +
        'type: ' + req.body.type + '\n' +
        'description: ' + req.body.description)
});
module.exports = router;