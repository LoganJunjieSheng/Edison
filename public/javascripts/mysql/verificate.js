let db = require('./config.js');
let async = require("async");
exports.verificate = function(username) {
let connection = db.connect('rainbowdb01','junjie.sheng','TCDAvDol9gAczLav','picasso');
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
