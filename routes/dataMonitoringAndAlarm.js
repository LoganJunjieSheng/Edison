var express = require('express');
var router = express.Router();
var alarmList=require('../public/javascripts/dataMonitoringAndAlarm/alarmList');
var ratio=require('../public/javascripts/dataMonitoringAndAlarm/ratio');
var ack=require('../public/javascripts/dataMonitoringAndAlarm/ack');
router.get('/', function (req, res, next) {
    res.json({
        'get': 'Hello from dataMonitoringAndAlarm!'
    })
});
router.post('/alarmList', function (req, res, next) {
    alarmList.getAlarmList(req, res, next);
});
router.post('/ratio', function (req, res, next) {
    ratio.getRatio(req, res, next);
});
router.post('/ack', function (req, res, next) {
    ack.handleKafka(req, res, next);
});



module.exports = router;
