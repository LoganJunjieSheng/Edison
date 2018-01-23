var express = require('express');
var router = express.Router();
var alarmList=require('../public/javascripts/dataMonitoringAndAlarm/alarmList');
var ratio=require('../public/javascripts/dataMonitoringAndAlarm/ratio');
var ack=require('../public/javascripts/dataMonitoringAndAlarm/ack');
var passport = require('../public/javascripts/passport_config.js');
router.get('/', passport.authenticate('jwt'),function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html'));
});
router.post('/alarmList',passport.authenticate('jwt'), function (req, res, next) {
    alarmList.getAlarmList(req, res, next);
});
router.post('/ratio', passport.authenticate('jwt'),function (req, res, next) {
    ratio.getRatio(req, res, next);
});
router.post('/ack', passport.authenticate('jwt'),function (req, res, next) {
    ack.handleKafka(req, res, next);
});



module.exports = router;
