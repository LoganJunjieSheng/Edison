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
router.post('/group/deleteGroup', function (req, res, next) {
    group.deleteGroup(req, res, next);
});
router.post('/group/editUserList', function (req, res, next) {
    group.editUserList(req, res, next);
});
router.post('/group/editDescription', function (req, res, next) {
    group.editDescription(req, res, next);
});

router.post('/group/addGroup', function (req, res, next) {
    group.addGroup(req, res, next);
});

router.post('/user/getData', function (req, res, next) {
    user.getData(req, res, next);
});

router.post('/user/deleteUser', function (req, res, next) {
	user.deleteUser(req, res, next);
});
router.post('/user/editGroupList', function (req, res, next) {
    user.editGroupList(req, res, next);
});

router.post('/user/addUser', function (req, res, next) {
    user.addUser(req, res, next);
});


module.exports = router;
