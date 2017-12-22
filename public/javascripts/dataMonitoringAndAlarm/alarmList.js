module.exports.getalarmList = function (req, res, next) {
    // var mysql = require('mysql');
    // var connection = mysql.createConnection({
    //     host: 'rainbowdb01',
    //     user: 'junjie.sheng',
    //     password: 'TCDAvDol9gAczLav',
    //     database: 'monitor'
    // });
    // res.send('respond with a resource');
    // connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    //     if (err) throw err;
    //     console.log('The solution is: ', rows[0].solution);
    // });
    // console.log(req.param('id'));
    res.json({
        'res': ' alarmList success'
    });
};