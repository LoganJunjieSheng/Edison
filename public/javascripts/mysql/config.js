let mysql = require('mysql');
exports.connect = (host,user,password,database) =>{
	let conn;
	handleError = ()=>{
		conn = mysql.createConnection({
        	host: host,
        	user: user,
        	password: password,
        	database: database,
    	});
		conn.connect(function (err) {
        	if (err) {
            	console.log('error when connecting to db:', err);
            	setTimeout(handleError , 2000);
        	}
    	});
		conn.on('error', function (err) {
        	console.log('db error', err);
        	// 如果是连接断开，自动重新连接
        	if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            	handleError();
        	} else {
            	throw err;
        	}
    	});
	}
	handleError();
	return conn;
}


