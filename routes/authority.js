var express = require('express');
var router = express.Router();
var group = require('../public/javascripts/authority/group');
var user = require('../public/javascripts/authority/user');
var passport = require('../public/javascripts/passport_config.js')
var jwt = require('jsonwebtoken');
var logger = require('../logs/config.js').logger

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname, 'index.html'));
});
//获取group对应的users
router.post('/group/getData', passport.authenticate('jwt'), function (req, res, next) {
	if(req.user.authority_authority_management==='1'){
    	group.getData(req, res, next);
	} else{
		res.json({type:'noPermission'})
	}
});
//删除一个group
router.post('/group/deleteGroup', passport.authenticate('jwt'), function (req, res, next) {
	if(req.user.authority_authority_management==='1'){
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    group.deleteGroup(req, res, next);
    logger.info(' 删除了一个group\n' +
        'username: ' + username + '\n' +
        'groupname: ' + req.body.groupName)
	} else{
        res.json({type:'noPermission'})
    }

});
//修改一个group
router.post('/group/editUserList', passport.authenticate('jwt'), function (req, res, next) {
if(req.user.authority_authority_management==='1'){
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    group.editUserList(req, res, next);
    logger.info(' 修改了一个group的userList\n' +
        'username: ' + username + '\n' +
        'groupname: ' + req.body.groupName + '\n' +
        'userList: ' + req.body.userList)
} else{
        res.json({type:'noPermission'})
    }

});
//修改了一个group的description
router.post('/group/editDescription', passport.authenticate('jwt'), function (req, res, next) {
if(req.user.authority_authority_management==='1'){
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    group.editDescription(req, res, next);
    logger.info(' 修改了一个group的desciption\n' +
        'username: ' + username + '\n' +
        'groupname: ' + req.body.groupName + '\n' +
        'descripition: ' + req.body.description)
} else{
        res.json({type:'noPermission'})
    }
});
//增加一个group
router.post('/group/addGroup', passport.authenticate('jwt'), function (req, res, next) {
if(req.user.authority_authority_management==='1'){
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    group.addGroup(req, res, next);
    logger.info(' 增加了一个group\n' +
        'username: ' + username + '\n' +
        'groupname: ' + req.body.groupName + '\n' +
        'descripition: ' + req.body.description + '\n' +
        'userList: ' + req.body.userList)
} else{
        res.json({type:'noPermission'})
    }
});
//获取user
router.post('/user/getData', passport.authenticate('jwt'), function (req, res, next) {
if(req.user.authority_authority_management==='1'){
    user.getData(req, res, next);
} else{
        res.json({type:'noPermission'})
    }
});
//删除一个user
router.post('/user/deleteUser', passport.authenticate('jwt'), function (req, res, next) {
if(req.user.authority_authority_management==='1'){
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    user.deleteUser(req, res, next);
    logger.info(' 删除了一个user\n' +
        'username: ' + username + '\n' +
        'userName: ' + req.body.userName)
} else{
        res.json({type:'noPermission'})
    }
});
//修改一个user的group
router.post('/user/editGroupList', passport.authenticate('jwt'), function (req, res, next) {
if(req.user.authority_authority_management==='1'){
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    user.editGroupList(req, res, next);
    logger.info(' 修改了一个user的groupList\n' +
        'username: ' + username + '\n' +
        'userName: ' + req.body.userName + '\n' +
        'groupList: ' + req.body.groupList)
} else{
        res.json({type:'noPermission'})
    }

});
//增加一个user
router.post('/user/addUser', passport.authenticate('jwt'), function (req, res, next) {
if(req.user.authority_authority_management==='1'){
    let username = jwt.decode(req.headers.authorization.slice(7)).username;
    user.addUser(req, res, next);
    logger.info(' 增加一个user\n' +
        'username: ' + username + '\n' +
        'userName: ' + req.body.userName + '\n' +
        'groupList: ' + req.body.groupList)
} else{
        res.json({type:'noPermission'})
    }

});


module.exports = router;
