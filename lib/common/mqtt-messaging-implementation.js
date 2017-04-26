/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var mqtt = require('mqtt');
var app = require('../../server/server.js').app;
var process = require('process');
var os = require('os');
var mqttOptions = app.get('mqttOptions');

var logger = require('../logger');
var log = logger('util');

var client = mqtt.connect(mqttOptions);
var clientId = os.hostname() + '.' + process.pid;

module.exports = {
  init: init,
  publish: publish,
  subscribe: subscribe
};

client.on('connect', function clientConnectListnerFn() {
  log.info(log.defaultContext(), 'Connected to MQTT broker');
});

client.on('error', function clientErrorListnerFn(error) {
  log.info(log.defaultContext(), 'Error connecting to MQTT broker ', error);
});

client.on('offline', function clientOfflineListnerFn() {
  log.info(log.defaultContext(), 'MQTT broker is offline');
});

client.on('reconnect', function clientReconnectListnerFn() {
  log.debug(log.defaultContext(), 'Reconnecting to MQTT broker');
});

function init() {
  // TODO implement this
  Function.prototype();
}

function publish(topic, msg) {
  if (client) {
    msg.clientId = clientId;
    client.publish(topic, JSON.stringify(msg));
  }
}

function subscribe(topicToSubscribe, listenToSelf, cb) {
  if (client) {
    client.subscribe(topicToSubscribe);
    client.on('message', function clientMessageListnerFn(topicOfMsg, message) {
      var msgObj = JSON.parse(message);
      if (topicToSubscribe === topicOfMsg && (listenToSelf || msgObj.clientId !== clientId)) {
        cb(msgObj);
      }
    });
  }
}
