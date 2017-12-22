var express = require('express');
var router = express.Router();
var alarmList=require('../public/javascripts/dataMonitoringAndAlarm/alarmList');

router.get('/', function (req, res, next) {
    res.json({
        'get': 'Hello from dataMonitoringAndAlarm!'
    })
});
router.post('/alarmList', function (req, res, next) {
    alarmList.getalarmList(req, res, next);
});
module.exports = router;