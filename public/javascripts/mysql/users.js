let mysql = require('mysql');
let async = require("async");
let connection = mysql.createConnection({
	host: 'rainbowdb01',
	user: 'junjie.sheng',
	password: 'TCDAvDol9gAczLav',
	database: 'picasso'
});
exports.findById = function(id, cb) {
	async.waterfall([
		(callback) => {
			let sql = 'select * from hadoop_admin_user;';
			connection.query(sql, function (err, results, fields) {
				if (err) throw err;
				callback(err, results);
			})
		},
		(records,callback) => {
			process.nextTick(function() {
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

exports.findByUsername = function(username, cb) {
	async.waterfall([
        (callback) => {
            let sql = 'select * from hadoop_admin_user;';
            connection.query(sql, function (err, results, fields) {
                if (err) throw err;
                callback(err, results);
            })
        },
		(records,callback) => {
			process.nextTick(function() {
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

