module.exports.getAlarmList = function (req, res, next) {
    let async = require("async");
    let mysql = require('mysql');
    let connection = mysql.createConnection({
         host: 'rainbowdb01',
         user: 'junjie.sheng',
         password: 'TCDAvDol9gAczLav',
         database: 'monitor'
    });
    //let sql="select * from alert where type = 'active_contactplus_cn';";
    let sql='select * from alert order by status asc;';
    //console.log(sql);
    let activePage=req.param('activePage');
    let alermList=[];
    let pages=0;
    
	    //res.json({
            //    'alermList':alermList,
	//	'pages':pages,
          //  })
    
    async.waterfall([
        function(callback) {
	    connection.query(sql, function (err, results, fields) {
	        if (err) throw err;
		callback(err, results);
	    })
        },
        function(RESULTS,callback) {
            alermList=RESULTS.slice((activePage-1)*10,activePage*10);
	    pages=Math.ceil(RESULTS.length/10);
//	    alermList.map((item,index)=>{
		//console.log(item)
//		connection.query("select * from data_type_map where data_type="+"'"+item.type+"'", function (err, results, fields) {
//                    if (err) throw err;    
		    //console.log(results[0])
//		    if(results.length){
		    	//console.log(1);
//			alermList[index]['hasRatio']=results[0].table_name;
//		    } else{
			//console.log(0)
//			alermList[index]['hasRatio']=false;
//		    }
		    //callback(err,index,RESULTS,results)
//	        })
//            })
	    //console.log('finish')
		callback('alermList')
//		console.log(alermList)
        },
	function(callback){
	//function(alermList,callback){
	    console.log('111');
	    callback('111');
	}
    ]);
    //console.log(alermList)
};
