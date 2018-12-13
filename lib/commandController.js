const mqtt = require('mqtt');

function publish(connectionOptions, eventTopic, commandTopic, value, timeout) {
	client = mqtt.connect(connectionOptions);
    client.on('connect', () => subscribe(client, eventTopic));
    client.once('message', (receivedTopic, message) => receiveRetainedMessage(receivedTopic, message, eventTopic, client));
	client.once('publish', (timedOut) => publishCommand(client, eventTopic, commandTopic, value, timedOut));
	
    setTimeout(function () {
		timeoutProtect = null;
		client.emit('publish', true);
    }, timeout);    
}

function subscribe(client, topic) {
	client.subscribe(topic, function (err) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
}

function receiveRetainedMessage(topic, message, expectedTopic, client) {
	if (topic === expectedTopic) {
		console.debug(`${topic}: Current vallue is: ${message}`);
		client.removeAllListeners('message');		
		client.emit('publish');
	}
}

function receiveStateMessage(topic, message, expectedTopic) {
	if (topic === expectedTopic) {
		console.debug(`${topic}: Current value is: ${message}`);
		process.exit(0);
	}
}

function publishCommand(client, eventTopic, commandTopic, value, timedOut) {
	if (timedOut) {
		console.debug("Timed out, no retained message was received");
	}
	console.debug(`${commandTopic}: Now publishing ${value}`)
	client.on('message', (receivedTopic, message) => receiveStateMessage(receivedTopic, message, eventTopic));
	client.publish(commandTopic, value);
}

module.exports = {
    publish: publish
}