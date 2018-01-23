var express = require('express');
var router = express.Router();
var group = require('../public/javascripts/authority/group');
var user = require('../public/javascripts/authority/user');
var passport = require('../public/javascripts/passport_config.js')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname,'index.html')); 
});
router.post('/group/getData',passport.authenticate('jwt'), function (req, res, next) {
    group.getData(req, res, next);
});
router.post('/group/deleteGroup',passport.authenticate('jwt'), function (req, res, next) {
    group.deleteGroup(req, res, next);
});
router.post('/group/editUserList', passport.authenticate('jwt'),function (req, res, next) {
    group.editUserList(req, res, next);
});
router.post('/group/editDescription', passport.authenticate('jwt'),function (req, res, next) {
    group.editDescription(req, res, next);
});

router.post('/group/addGroup', passport.authenticate('jwt'),function (req, res, next) {
    group.addGroup(req, res, next);
});

router.post('/user/getData',passport.authenticate('jwt'), function (req, res, next) {
    user.getData(req, res, next);
});

router.post('/user/deleteUser', passport.authenticate('jwt'),function (req, res, next) {
	user.deleteUser(req, res, next);
});
router.post('/user/editGroupList', passport.authenticate('jwt'),function (req, res, next) {
    user.editGroupList(req, res, next);
});

router.post('/user/addUser', passport.authenticate('jwt'),function (req, res, next) {
    user.addUser(req, res, next);
});


module.exports = router;
