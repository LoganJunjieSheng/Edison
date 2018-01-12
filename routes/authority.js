var express = require('express');
var router = express.Router();
var group = require('../public/javascripts/authority/group');
var user = require('../public/javascripts/authority/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html')); 
});
router.post('/group/getData', function (req, res, next) {
    group.getData(req, res, next);
});
router.post('/group/deleteUser', function (req, res, next) {
    group.deleteUser(req, res, next);
});
router.post('/user/getData', function (req, res, next) {
    user.getData(req, res, next);
    //console.log(req)
});

module.exports = router;
