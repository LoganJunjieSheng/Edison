var mykafka = require('../kafka/mykafka');
let async = require("async");
let mysql = require('mysql');
let connection = mysql.createConnection({
     host: 'rainbowdb01',
     user: 'junjie.sheng',
     password: 'TCDAvDol9gAczLav',
     database: 'picasso'
});


module.exports.getData = function  (req,res,next) {
    let hadoop_group_meta=[];
	let hadoop_user_group=[];
	let groupName=[];//group数组
	let userName=[];//users数组
	let groupList=[];//[{group:,description:,userList:[]}]
	async.waterfall([
		function (callback) {
			let sql='select * from hadoop_group_meta;';
			connection.query(sql, function (err, results, fields) {
			if (err) throw err;
				callback(err, results);
	    	})
		},
		function (results,callback) {
			hadoop_group_meta=results;
			let sql='select * from hadoop_user_group;';
            connection.query(sql, function (err, results, fields) {
            if (err) throw err;
                callback(err, results);
		})
		},
		function (results,callback) {
			hadoop_user_group=results;
			callback(null)
		},
		function(){
			hadoop_group_meta.map((item,index)=>{
				groupName.push(item.group_name);
			});
			let hash={};
			hadoop_user_group.map((item,index)=>{
				if(!hash[item.username]){
					hash[item.username] = true;
					userName.push(item.username);
				}
			})
			hash=null;
			let groupMapUser=hadoop_user_group.slice(0);
			groupName.map((item,index)=>{
				let userList=[];
				groupMapUser.map((item1,index1)=>{
					if(item === item1.group_name){
						userList.push(item1.username);
					}
				})
				//let description='';
				groupList.push({
					type : 'group',
					group : item,
					description :  hadoop_group_meta[index].group_description,
					userList : userList,
					userNumber : userList.length,
				});
			})
			res.json({
				//'hadoop_user_group':hadoop_user_group,
				//'hadoop_group_meta':hadoop_group_meta,
				//'groupName':groupName,
				'userName':userName,
				'groupList':groupList,
			})
		}
	]);
};

module.exports.deleteGroup = function  (req,res,next) {
	let group_name=req.body.groupName;
	let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
	let topic = 'picasso_cmd';
	let jsonMessage = JSON.stringify({
			action:'group_delete_group',
			group_name:group_name,
	})
	mykafka.sendMessage(res,zookeeper,topic,jsonMessage);
	console.log(jsonMessage)
}

module.exports.editUserList = function  (req,res,next) {
	let user_list_old=[];
	let user_list_new=[];
	let group_name=req.body.groupName;
	user_list_new=req.body.userList;
    let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
    let topic = 'picasso_cmd';
	async.waterfall([
		function (callback) {
			let sql='select * from hadoop_user_group where group_name ='+"'"+group_name+"'";
			connection.query(sql, function (err, results, fields) {
			if (err) throw err;
				callback(err, results);
	    	})
		},
		function (results,callback){
			results.map((item)=>{
				user_list_old.push(item.username);
			});
			//console.log(user_list_old);
			//console.log(user_list_new);
			let old_set=new Set(user_list_old);
			let new_set=new Set(user_list_new);
			let remove_set=new Set([...old_set].filter(x => !new_set.has(x)));
			let add_set=new Set([...new_set].filter(x => !old_set.has(x)));
			let remove_list=[...remove_set];
			let add_list=[...add_set];
			//console.log(add_list);
			//console.log(remove_list);
			add_list.map((item)=>{
				jsonMessage = JSON.stringify({
					action:'group_add_user',
					group_name:group_name,
					user_name:item,
				});
			mykafka.sendMessageLoop(res,zookeeper,topic,jsonMessage);
			console.log(jsonMessage);			
			});
			remove_list.map((item)=>{
                jsonMessage = JSON.stringify({
                    action:'group_remove_user',
                    group_name:group_name,
                    user_name:item,
                });
            mykafka.sendMessageLoop(res,zookeeper,topic,jsonMessage);
            console.log(jsonMessage);
            })
			res.json({type:'success'});
		}
	]);
}

module.exports.editDescription = function  (req,res,next) {
    let group_name=req.body.groupName;
	let description=req.body.description
    let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
    let topic = 'picasso_cmd';
    let jsonMessage = JSON.stringify({
			action:'group_edit_description',
			group_name:group_name,
			description:description,
		});
    mykafka.sendMessage(res,zookeeper,topic,jsonMessage);
	console.log(jsonMessage)
}

module.exports.addGroup = function  (req,res,next) {
    let group_name=req.body.groupName;
    let description=req.body.description;
	let user_list=req.body.userList;
    let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
    let topic = 'picasso_cmd';
    let jsonMessage = JSON.stringify({
			action:'group_add_group',
			group_name:group_name,
		});
    mykafka.sendMessageLoop(res,zookeeper,topic,jsonMessage);
	console.log(jsonMessage);
	jsonMessage = JSON.stringify({
            action:'group_edit_description',
            group_name:group_name,
			description:description,
        });
    mykafka.sendMessageLoop(res,zookeeper,topic,jsonMessage);
    console.log(jsonMessage);
	user_list.map((item,index)=>{
		jsonMessage = JSON.stringify({
			action:'group_add_user',
			group_name:group_name,
			user_name:item
		});
		mykafka.sendMessageLoop(res,zookeeper,topic,jsonMessage);
		console.log(jsonMessage);
	});
	res.json({
		type:'success'
	})
}



