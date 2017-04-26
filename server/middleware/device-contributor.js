/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var logger = require('../../lib/logger');
var log = logger('device-contributor');

/**
 * This contributor reads the 'device' variable value from header or query
 * string and puts in callContext.ctx.device and 'deviceweight' variable value
 * from header or query string and puts in callContext.ctxWeights.device
 *
 * @memberof Middleware
 * @name Device Contributor
 * @author Ramesh Choudhary
 */

module.exports = function DeviceContributor(req, res, callContext, callback) {
  if (req.headers.device) {
    log.debug(callContext, 'Setting callContext.scopeVars.device from headers');
    callContext.ctx.device = req.headers.device;
  } else if (req.query && req.query.device) {
    log.debug(callContext, 'Setting callContext.scopeVars.device from query string');
    callContext.ctx.device = req.query.device;
  }

  if (callContext.ctx.device) {
    if (req.headers.deviceweight) {
      callContext.ctxWeights.device = req.headers.deviceweight;
    } else if (req.query.deviceweight) {
      callContext.ctxWeights.device = req.query.deviceweight;
    } else {
      callContext.ctxWeights.device = '0';
    }
  }
  callback(null);
};
