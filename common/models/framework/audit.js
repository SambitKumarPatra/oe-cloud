/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var logger = require('../../../lib/logger')('audit.js');
var bunyan = require('bunyan');
var gelfStream = require('gelf-stream');
var auditConfig = require('../../../server/audit-config');

module.exports = function auditModel(Audit) {
  Audit.disableRemoteMethod('deleteById', true);
  Audit.disableRemoteMethod('upsert', true);
  Audit.disableRemoteMethod('updateAll', true);
  Audit.disableRemoteMethod('updateAttributes', false);

  Audit.prototype.event = function auditLog() {
    if (auditConfig) {
      var stream = gelfStream.forBunyan(auditConfig.host, auditConfig.port);
      var log = bunyan.createLogger({
        name: 'audit',
        streams: [{
          type: 'raw',
          stream: stream
        }]
      });

      var message = '';
      for (var i = 0; i < arguments.length; i++) {
        message = message + arguments[i];
      }

      log.info(logger.defaultContext(), message);
      stream.end();
    } else {
      logger.fatal(logger.defaultContext(), 'Audit failed');
      // var err = new Error('Audit failed');
      // err.retriable = false;
      // cb(err , 'Audit failed');
    }
  };
};
