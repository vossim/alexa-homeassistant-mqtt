require('dotenv').config();
const commandController = require('./lib/commandController');

const connectionOptions = {
	host: process.env.MQTT_HOST,
	port: process.env.MQTT_PORT,
	username: process.env.MQTT_USERNAME,
	password: process.env.MQTT_PASSWORD,
	protocol: process.env.MQTT_PROTOCOL
}

var domain = 'light'
var entity = 'keuken_1'
var field = 'state'
const eventTopic = getTopic(process.env.BASE_EVENT_TOPIC, domain, entity, field)
const commandTopic = getTopic(process.env.BASE_COMMAND_TOPIC, domain, entity, field)

const stateTimeout = process.env.STATE_TIMEOUT ? process.env.STATE_TIMEOUT : 1000;

function getTopic(configuredTopic, domain, entity, field) {
	var base = configuredTopic.endsWith('/') ? configuredTopic : `${configuredTopic}/`
	return `${base}${domain}/${entity}/${field}`
}

commandController.publish(connectionOptions, eventTopic, commandTopic, 'NEW-VALUE', stateTimeout);