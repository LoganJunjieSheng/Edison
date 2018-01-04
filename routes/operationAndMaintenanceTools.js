var express = require('express');
var router = express.Router();
var drill=require('../public/javascripts/operationAndMaintenanceTools/drill');
var drill=require('../assets/public/index.html');

router.get('/', function (req, res, next) {
    res.json({
        'get': 'Hello from dataMonitoringAndAlarm!'
    })
});
router.post('/drill/restart', function (req, res, next) {
    drill.restart(req, res, next);
});
module.exports = router;