var express = require('express');
var router = express.Router();
var restartAndSwitch = require('../public/javascripts/operationAndMaintenanceTools/restartAndSwitch');

router.get('/', function (req, res, next) {
    res.json({
        'get': 'Hello from dataMonitoringAndAlarm!'
    })
});
router.post('/restartAndSwitch', function (req, res, next) {
    restartAndSwitch.handleKafka(req, res, next);
});
module.exports = router;
