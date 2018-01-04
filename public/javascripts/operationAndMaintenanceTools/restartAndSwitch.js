module.exports.handlekafka = function (req, res, next) {
    let operation = req.param('operation');
    let server = req.param('server');
    let option = req.param('option');

    let kafka = require('kafka-node');
    let Producer = kafka.Producer;
    let KeyedMessage = kafka.KeyedMessage;
    let client = new kafka.Client('localhost:2181');
    let producer = new Producer(client);
    let km = new KeyedMessage("key", "message");

    let myDate = new Date()

    let tempMessage={
        operation:operation,
        server:server, 
        option:option,
        time:myDate.toLocaleString()
    }
    let jsonMessage=JSON.stringify(tempMessage);
    let payloads = [{
        topic: 'restartAndSwitch',
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
