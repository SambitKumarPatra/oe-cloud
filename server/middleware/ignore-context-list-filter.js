/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var logger = require('../../lib/logger');
var log = logger('ingore-context-list-filter');

/**
 * This filter is used to populate ignore list which will be used to ignore the particular
 * value while calculationg score in data personalization.
 * It reads the header key 'x-ignore-context' and puts in callContext.ignoreContextList.
 *
 * @name ignore context list filter
 * @author Ramesh Choudhary
 * @memberof Middleware
 */

module.exports = function IgnoreContextListFilter(req, res, callContext, callback) {
  if (req.headers['x-ignore-context']) {
    log.debug(req.callContext, 'Setting callContext.ignoreContextList from headers');
    callContext.ignoreContextList = JSON.parse(req.headers['x-ignore-context']);
  } else if (req.query && req.query['x-ignore-context']) {
    log.debug(req.callContext, 'Setting callContext.ignoreContextList from query string');
    callContext.ignoreContextList = JSON.parse(req.query['x-ignore-context']);
  }
  callback(null);
};
