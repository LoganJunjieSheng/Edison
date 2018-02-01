let async = require("async");
let db = require('./config.js');
exports.findById = function (id, cb) {
let connection = db.connect('rainbowdb01','junjie.sheng','TCDAvDol9gAczLav','picasso');
	async.waterfall([
		(callback) => {
			let sql = 'select * from hadoop_admin_user;';
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		(records, callback) => {
			process.nextTick(function () {
				var idx = id - 1;
				if (records[idx]) {
					cb(null, records[idx]);
				} else {
					cb(new Error('User ' + id + ' does not exist'));
				}
			});
		}
	])
}

exports.findByUsername = function (username, cb) {
let connection = db.connect('rainbowdb01','junjie.sheng','TCDAvDol9gAczLav','picasso');
	async.waterfall([
		(callback) => {
			let sql = 'select * from hadoop_admin_user;';
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		(records, callback) => {
			process.nextTick(function () {
				for (var i = 0, len = records.length; i < len; i++) {
					var record = records[i];
					if (record.username === username) {
						return cb(null, record);
					}
				}
				return cb(null, null);
			});
		}
	])
}
