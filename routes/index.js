var express = require('express');
var router = express.Router();
var passport = require('../public/javascripts/passport_config.js')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html'));
    
});
router.post('/test', passport.authenticate('local'), function(req, res) {
	console.log(req.user);
	console.log(req.session);
	res.json({type:"success"});

});

module.exports = router;
