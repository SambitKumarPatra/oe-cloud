/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
// var loopback = require ('loopback');
// var uuid = require ('node-uuid');
// var logger = require ('../../lib/logger');
// var debug = require('debug')('req-logging-filter');
var log = require('../../lib/logger')('req-logging-filter');

/**
 * Request Logging Filter
 *
 * @name Request Logging Filter
 * @memberof Middleware
 */

module.exports = function ReqLoggingFilter(options) {
  return function doLog(req, res, next) {
    // log runs into circular json object issues - this is a problem that should be dealt with
    log.debug(req.callContext, 'Request received -- ', req);
    next();
  };
};
