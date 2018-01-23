var express = require('express');
var router = express.Router();

var passport = require('../public/javascripts/passport_config.js')
var jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html'));
    
});
router.post('/test', passport.authenticate('local'), function(req, res) {
	res.json({
		type:"success",
		token:jwt.sign({username:req.user.username},'sjj')
	});
});

router.post('/jwt', passport.authenticate('jwt'), function(req, res) {
    console.log(req.user);
    res.json({
        type:"success",
    });

});

module.exports = router;
