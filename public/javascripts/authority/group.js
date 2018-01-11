module.exports.getData = function (req, res, next) {
	let async = require("async");
	let mysql = require('mysql');
	let connection = mysql.createConnection({
		host: 'rainbowdb01',
		user: 'junjie.sheng',
		password: 'TCDAvDol9gAczLav',
		database: 'picasso'
	});
	let hadoop_group_meta = [];
	let hadoop_user_group = [];
	let groupName = []; //group数组
	let userName = []; //users数组
	let groupList = []; //[{group:,description:,userList:[]}]
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
			groupName.map((item, index) => {
				let userList = [];
				groupMapUser.map((item1, index1) => {
					if (item === item1.group_name) {
						userList.push(item1.username);
					}
				})
				//let description='';
				groupList.push({
					type: 'group',
					group: item,
					description: hadoop_group_meta[index].group_description,
					userList: userList,
					userNumber: userList.length,
				});
			})
			res.json({
				//'hadoop_user_group':hadoop_user_group,
				//'hadoop_group_meta':hadoop_group_meta,
				//'groupName':groupName,
				'userName': userName,
				'groupList': groupList,
			})
		}
	]);
};

//module.exports.getData2 = function  (req,res,next) {
//    console.log(1);
//}