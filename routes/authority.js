var express = require('express');
var router = express.Router();
var group = require('../public/javascripts/authority/group');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html')); 
});
router.post('/group/getData', function (req, res, next) {
    group.getData(req, res, next);
	//console.log(req)
});

//router.post('/group/', function (req, res, next) {
    //group.getData2(req, res, next);
//});

module.exports = router;
