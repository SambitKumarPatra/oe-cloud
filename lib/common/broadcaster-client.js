/*
©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

var WebSocket = require('ws');
var process = require('process');

var logger = require('../logger');
var log = logger('broadcaster-client');
var EventEmitter = require('events');

var emitter = new EventEmitter();

module.exports = {
  init: init,
  publish: publish,
  subscribe: subscribe
};

var readyState = {};
readyState.CONNECTING = 0;
readyState.OPEN = 1;
readyState.CLOSING = 2;
readyState.CLOSED = 3;

var pendingData = [];
var ws;

function trySend() {
  if (ws && ws.readyState === readyState.OPEN) {
    if (pendingData.length > 0) {
      var data = pendingData.shift();
      try {
        ws.send(data, function wsSendFn() {
          if (pendingData.length > 0) {
            process.nextTick(function nextTickSendFn() {
              trySend();
            });
          }
        });
      } catch (ex) {
        pendingData.unshft(data);
        setTimeout(trySend, 3000);
      }
    }
  } else if (!ws) {
    init();
  }
}

var firstTime = true;
function init() {
  if (ws) {
    return;
  }
  var broadcasterHost = process.env.BROADCASTER_HOST || 'localhost';
  var portNumber = process.env.BROADCASTER_PORT || 2345;
  ws = new WebSocket('ws://' + broadcasterHost + ':' + portNumber, {
    perMessageDeflate: false
  });
  ws.on('open', function open() {
    trySend();
  });

  ws.on('close', function closeFn() {
    ws = null;
    setTimeout(init, 3000);
  });

  ws.on('message', function messageFn(buf) {
    var data = JSON.parse(buf);
    process.nextTick(function nextTickMessageFn() {
      emitter.emit(data.topic, data.msg);
    });
  });

  ws.on('error', function errorFn(e) {
    if (e.code === 'ECONNREFUSED') {
      if (firstTime) {
        log.error(log.defaultContext(), 'could not connect to broadcaster service');
        firstTime = false;
      }
    } else {
      log.error(log.defaultContext(), 'broadcaster client error ', e);
    }
    if (ws) {
      ws.close();
    }
    ws = null;
  });
}

function publish(topic, msg) {
  if (!ws) {
    init();
  }
  var data = {
    topic: topic,
    msg: msg
  };
  var buf = new Buffer(JSON.stringify(data));
  pendingData.push(buf);
  trySend();
}

function subscribe(topic, cb) {
  emitter.on(topic, function emitterFn(message) {
    cb(message);
  });
}
