var express = require('express');
var router = express.Router();

var passport = require('../public/javascripts/passport_config.js')
var jwt = require('jsonwebtoken');
var winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: '../../logs/test.log', level: 'error' }),
    new winston.transports.File({ filename: '../..logs/test.log' })
  ]
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html'));
});
router.post('/test', passport.authenticate('local'), function(req, res) {
	res.json({
		type:"success",
		token:jwt.sign({username:req.user.username},'sjj',{expiresIn:60*60*24})
	});
});

router.post('/jwt', passport.authenticate('jwt'), function(req, res) {
    console.log(req.user);

	logger.info('1111')
    res.json({
        type:"success",
    });

});

module.exports = router;
