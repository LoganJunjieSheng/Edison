var mykafka = require('../kafka/mykafka');
let async = require("async");
let mysql = require('mysql');
let connection = mysql.createConnection({
	host: 'rainbowdb01',
	user: 'junjie.sheng',
	password: 'TCDAvDol9gAczLav',
	database: 'picasso'
});

module.exports.getData = function (req, res, next) {
	let hadoop_group_meta = [];
	let hadoop_user_group = [];
	let groupName = []; //group数组
	let userName = []; //users数组
	let userList = []; //[{user:'',userNumber:num,userList:[]}]
	async.waterfall([
		function (callback) {
			let sql = 'select * from hadoop_group_meta;';
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		function (results, callback) {
			hadoop_group_meta = results;
			let sql = 'select * from hadoop_user_group;';
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		function (results, callback) {
			hadoop_user_group = results;
			callback(null)
		},
		function () {
			hadoop_group_meta.map((item, index) => {
				groupName.push(item.group_name);
			});
			let hash = {};
			hadoop_user_group.map((item, index) => {
				if (!hash[item.username]) {
					hash[item.username] = true;
					userName.push(item.username);
				}
			})
			hash = null;
			let groupMapUser = hadoop_user_group.slice(0);
			userName.map((item, index) => {
				let groupList = [];
				groupMapUser.map((item1, index1) => {
					if (item === item1.username) {
						groupList.push(item1.group_name);
					}
				})
				//let description='';
				userList.push({
					type: 'user',
					user: item,
					groupList: groupList,
					groupNumber: groupList.length,
				});
			})
			res.json({
				//'hadoop_user_group':hadoop_user_group,
				//'hadoop_group_meta':hadoop_group_meta,
				'groupName': groupName,
				//'userName':userName,
				'userList': userList,
			})
		}
	]);
};

module.exports.deleteUser = function (req, res, next) {
	let user_name = req.body.userName;
	let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
	let topic = 'picasso_cmd';
	let jsonMessage = JSON.stringify({
		aciton: 'user_delete_user',
		user_name: user_name
	})
	mykafka.sendMessage(res, zookeeper, topic, jsonMessage);
	console.log(jsonMessage);
}

module.exports.editGroupList = function (req, res, next) {
	let group_list_old = [];
	let group_list_new = [];
	let user_name = req.body.userName;
	group_list_new = req.body.groupList;
	let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
	let topic = 'picasso_cmd';

	async.waterfall([
		function (callback) {
			let sql = 'select * from hadoop_user_group where username =' + "'" + user_name + "'";
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		function (results, callback) {
			results.map((item) => {
				group_list_old.push(item.group_name);
			})
			//console.log(group_list_old);
			//console.log(group_list_new);
			let old_set = new Set(group_list_old);
			let new_set = new Set(group_list_new);
			let remove_set = new Set([...old_set].filter(x => !new_set.has(x)));
			let add_set = new Set([...new_set].filter(x => !old_set.has(x)));
			let remove_list = [...remove_set];
			let add_list = [...add_set];
			//console.log(add_list);
			//console.log(remove_list);
			add_list.map((item) => {
				jsonMessage = JSON.stringify({
					action: 'group_add_user',
					group_name: item,
					user_name: user_name,
				});
				console.log(jsonMessage);
				mykafka.sendMessageLoop(res, zookeeper, topic, jsonMessage);
			});
			remove_list.map((item) => {
				jsonMessage = JSON.stringify({
					action: 'group_remove_user',
					group_name: item,
					user_name: user_name,
				});
				mykafka.sendMessageLoop(res, zookeeper, topic, jsonMessage);
				console.log(jsonMessage);
			});
			res.json({
				type: 'success'
			});
		}
	]);
}

module.exports.addUser = function (req, res, next) {
	let user_name = req.body.userName;
	let group_list = req.body.groupList;
	let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
	let topic = 'picasso_cmd';
	let jsonMessage = JSON.stringify({
		action: 'user_add_user',
		user_name: user_name,
	})
	mykafka.sendMessageLoop(res, zookeeper, topic, jsonMessage);
	console.log(jsonMessage)
	group_list.map((item) => {
		jsonMessage = JSON.stringify({
			action: 'group_add_user',
			group_name: item,
			user_name: user_name,
		})
		console.log(jsonMessage)
		mykafka.sendMessageLoop(res, zookeeper, topic, jsonMessage);
	})
	res.json({
		type: 'success'
	})
}