module.exports.sendMessage = function (zookeeper,topic,jsonMessage) {
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
        console.log('connect kafka')
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
    });
    producer.on('error', function (err) {
        console.log(err)
    })
}
