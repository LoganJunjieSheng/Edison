module.exports.sendMessage = function (res,zookeeper,topic,jsonMessage) {
	let kafka = require('kafka-node');
    let Producer = kafka.Producer;
    let KeyedMessage = kafka.KeyedMessage;
    let client = new kafka.Client(zookeeper);
    let producer = new Producer(client);
    let km = new KeyedMessage("key", "message");
    let payloads = [{
        topic: topic,
        messages: [jsonMessage],
    }];
	producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            if(err === null){
                res.json({
                    type : 'success',
                    data : data,
                });
            } else{
                res.json({
                    type : 'defeat',
                    data : err,
                });

            }

        });
    });
    producer.on('error', function (err) {
		res.json({
            type : 'defeat',
            data : 'err'
        })

    })
}
