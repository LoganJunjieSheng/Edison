module.exports.getAlarmList = function (req, res, next) {
	let async = require("async");
	let mysql = require('mysql');
	let connection = mysql.createConnection({
		host: 'rainbowdb01',
		user: 'junjie.sheng',
		password: 'TCDAvDol9gAczLav',
		database: 'monitor'
	});
	let sql = 'select * from alert order by status desc;';
	let activePage = req.param('activePage');
	let alermList = [];
	let pages = 0;
	//使用async进行流程控制，nodejs是异步非阻塞，读取mysql时，会执行后面的语句。
	//waterfall可以将上一次的结果通过callback回调给下一次操作 
	async.waterfall([
		function (callback) {
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		function (RESULTS, callback) {
			alermList = RESULTS.slice((activePage - 1) * 10, activePage * 10);
			pages = Math.ceil(RESULTS.length / 10);
			let sqlList = {};
			alermList.map((item, index) => {
				let key = 'key' + index;
				sqlList[key] = "select * from data_type_map where data_type=" + "'" + item.type + "'";
			})
			async.map(sqlList, function (item, callbackMap) {
				connection.query(item, function (err, results) {
					if (err) throw err;
					callbackMap(err, results)
				});
			}, function (err, results) {
				results.map((item, index) => {
					if (item.length) {
						alermList[index]['hasRatio'] = item[0].table_name;
					} else {
						alermList[index]['hasRatio'] = false;
					}
				})
				callback(null, alermList)
			});
		},
		function (arg1) {
			res.json({
				'alermList': alermList,
				'pages': pages,
			})
		}
	]);
}