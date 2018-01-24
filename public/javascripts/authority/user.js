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
			//console.log(res)
		}
	]);
};

module.exports.deleteUser = function (req, res, next) {
	let user_name = req.body.userName;
	async.waterfall([
		function (callback) {
			let sql = 'delete from hadoop_user_group where username =' + "'" + user_name + "'";
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		function (results) {
			res.json({
				type: 'success'
			});
		}
	]);
}

module.exports.editGroupList = function (req, res, next) {
	let group_list_old = [];
	let group_list_new = [];
	let user_name = req.body.userName;
	group_list_new = req.body.groupList;
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
			let old_set = new Set(group_list_old);
			let new_set = new Set(group_list_new);
			let remove_set = new Set([...old_set].filter(x => !new_set.has(x)));
			let add_set = new Set([...new_set].filter(x => !old_set.has(x)));
			let remove_list = [...remove_set];
			let add_list = [...add_set];
			let tempParameter = [];
			let tempValue = [];
			if (add_list.length !== 0) {
				add_list.map((item) => {
					tempParameter.push('(?,?)');
					tempValue.push(user_name);
					tempValue.push(item);
				});
				let sql = {
					sql: 'insert into hadoop_user_group (username,group_name) values ' + tempParameter.toString(),
					values: tempValue,
				}
				connection.query(sql, function (err, results, fields) {
					if (err) throw err;
					callback(err, remove_list);
				});
			} else {
				callback(null, remove_list)
			}	
		},
		function (remove_list, callback) {
			if (remove_list.length !== 0) {
				let sql = [];
				remove_list.map((item) => {
					sql.push({
						sql: 'delete from hadoop_user_group where username =? and group_name = ?',
						values: [user_name, item],
					})
				});
				async.map(sql,
					function (item, callbackMap) {
						connection.query(item, function (err, results) {
							if (err) throw err;
							callbackMap(err, results)
						});
					},
					function (err, results) {
						callback(err, results);
					})
			} else {
				callback(null);
			}
		}
	], function (err, result) {
		if (err === null) {
			res.json({
				type: 'success'
			});
		}
	});
}

module.exports.addUser = function (req, res, next) {
	let user_name = req.body.userName;
	let group_list = req.body.groupList;
	async.waterfall([
		function (callback) {
			let tempParameter = [];
			let tempValue = [];
			if(group_list.length!==0){
			group_list.map((item) => {
				tempParameter.push('(?,?)');
				tempValue.push(user_name);
				tempValue.push(item);
			})
			let sql = {
				sql: 'insert into hadoop_user_group (username,group_name) values ' + tempParameter.toString(),
				values: tempValue,
			}
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
			}else{callback(null,null)}
		},
		function (results) {
			res.json({
				type: 'success'
			});
		}
	])
}
