var mykafka = require('../kafka/mykafka');
module.exports.handleKafka = function (req, res, next) {
    let operation = req.body.operation;
    let server = req.body.server;
    let option = req.body.option;
    let myDate = new Date()
	let tempMessage={
        type:server,
        operation:operation,
        option:option,
        time:myDate.toLocaleString()
    }
    let jsonMessage=JSON.stringify(tempMessage);

	let zookeeper = 'zk01:2181,zk02:2181,zk03:2181';
	let topic = 'picasso_cmd';

	mykafka.sendMessage(res,zookeeper,topic,jsonMessage)
};
