module.exports.handleKafka = function (req, res, next) {
    let type = req.param('type');
    let status = req.param('status');
    let description = req.param('description');
    
    let kafka = require('kafka-node');
    let Producer = kafka.Producer;
    let KeyedMessage = kafka.KeyedMessage;
    let client = new kafka.Client('localhost:2181');//zookeeper address
    let producer = new Producer(client);
    let km = new KeyedMessage("key", "message");

    let myDate = new Date()

    let tempMessage={
        type:type,
        status:status,
        description:description,
        time:myDate.toLocaleString()
    }
    let jsonMessage=JSON.stringify(tempMessage);
    let payloads = [{
        topic: 'alarmAck',
        messages: [jsonMessage],
    }];

    producer.on('ready', function () {
        console.log('connect kafka')
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
    })
    producer.on('error', function (err) {
        console.log('producer can`t on')
    })
    res.json({
        'res': ' drill restart'
    });
};

