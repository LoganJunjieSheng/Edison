var express = require('express');
var router = express.Router();
var restartAndSwitch = require('../public/javascripts/operationAndMaintenanceTools/restartAndSwitch');
var passport = require('../public/javascripts/passport_config.js')

router.get('/', passport.authenticate('jwt'),function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html'));
});
router.post('/restartAndSwitch',passport.authenticate('jwt'), function (req, res, next) {
    restartAndSwitch.handleKafka(req, res, next);
});
module.exports = router;
