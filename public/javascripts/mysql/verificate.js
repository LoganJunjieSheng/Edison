ql = require('mysql');
let async = require("async");
let connection = mysql.createConnection({
	host: 'rainbowdb01',
	user: 'junjie.sheng',
	password: 'TCDAvDol9gAczLav',
	database: 'picasso'
});
exports.verificate = function(username) {
	async.waterfall([
		(callback) => {
			let sql = 'select * from hadoop_admin_user where username = '+"'"+username+"'";
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		(results,callback) => {
			console.log(results);
		}
	])
}
