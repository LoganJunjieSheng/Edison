module.exports.handleKafka = function (req, res, next) {
    let operation = req.body.operation;
    let server = req.body.server;
    let option = req.body.option;
    let kafka = require('kafka-node');
    let Producer = kafka.Producer;
    let KeyedMessage = kafka.KeyedMessage;
    let client = new kafka.Client('zk01:2181,zk02:2181,zk03:2181');
    let producer = new Producer(client);
    let km = new KeyedMessage("key", "message");

    let myDate = new Date()

    let tempMessage={
        type:server,
	operation:operation, 
        option:option,
        time:myDate.toLocaleString()
    }
    let jsonMessage=JSON.stringify(tempMessage);
    let payloads = [{
        topic: 'picasso_cmd',
        messages: [jsonMessage],
    }];
    console.log(jsonMessage);
    producer.on('ready', function () {
        console.log('connect kafka')
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
    });
    producer.on('error', function (err) {
        console.log(err)
    })
    //res.json({
    //    'res': ' drill restart'
    //});
};
