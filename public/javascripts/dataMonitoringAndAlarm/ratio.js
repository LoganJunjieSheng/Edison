module.exports.getRatio = function (req, res, next) {
    let mysql = require('mysql');
    let connection = mysql.createConnection({
         host: 'rainbowdb01',
         user: 'junjie.sheng',
         password: 'TCDAvDol9gAczLav',
         database: 'monitor'
    });
    let type=req.param('type');
    let table=req.param('table');
    let sql='select * from '+table+' where data_type='+"'"+type+"'";
    
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
		results.map((item)=>{
			item.date=item.date.toLocaleDateString();//对utc事件进行处理
		});
        res.json({
        'ratioList':results
        })
    })

    //res.json({
        //'res': ' alarmList success'
    //});
};

