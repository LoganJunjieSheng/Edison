module.exports.getRatio = function (req, res, next) {
	let db = require('../mysql');
	let connection = db.config.connect('rainbowdb01','junjie.sheng','TCDAvDol9gAczLav','monitor');
    let type = req.body.type;
    let table = req.body.table;
    let sql = 'select * from ' + table + ' where data_type=' + "'" + type + "'";

    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        results.map((item) => {
            item.date = item.date.toLocaleDateString(); //对utc事件进行处理
        });
        res.json({
            'ratioList': results
        })
    })

    //res.json({
    //'res': ' alarmList success'
    //});
};
