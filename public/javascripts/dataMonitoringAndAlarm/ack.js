module.exports.handleKafka = function (req, res, next) {
	let action = req.body.action;
    let type = req.body.type;
    let status = req.body.status;
    let description_old = req.body.description_old;
	let description_new = req.body.description_new;
    let kafka = require('kafka-node');
    let Producer = kafka.Producer;
    let KeyedMessage = kafka.KeyedMessage;
    let client = new kafka.Client('zk01:2181,zk02:2181,zk03:2181'); //zookeeper address
    let producer = new Producer(client);
    let km = new KeyedMessage("key", "message");
    let myDate = new Date()

    let tempMessage = {
		action: action,
        type: type,
        status: status,
        description_old: description_old,
		description_new: description_new,
        time: myDate.toLocaleString()
    }
    let jsonMessage = JSON.stringify(tempMessage);
    let payloads = [{
        topic: 'picasso_cmd',
        messages: [jsonMessage],
    }];
    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {});
    })
    producer.on('error', function (err) {
        console.log('producer can`t on')
    })
    res.json({
        'res': ' drill restart'
    });
};
