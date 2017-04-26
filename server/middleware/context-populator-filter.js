/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var loopback = require('loopback');
var log = require('../../lib/logger')('context-populator-filter');
/**
 * Context Populator Filter
 * This middleware sets the current Context from req to loopback current context
 * There is a bug in loopback passport component that if session is used
 * then current context is lost after session layer handles the request
 * so it is possible to call this middleware in each of layer
 * so that callContext which is populated in pre-auth-context-populator
 * middleware can be set into loopback current context.
 * If you want to use session then this middleware needs to be configured
 * in each of phases in middleware.json.
 *
 * @name Context Populator Filter
 * @memberof Middleware
 */

module.exports = function ContextPopulatorFilter(options) {
  return function populateContext(req, res, next) {
    if (req.callContext) {
      var loopbackContext = loopback.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('callContext', req.callContext);
        log.debug(req.callContext, 'context set = ', JSON.stringify(req.callContext));
      } else {
        throw (new Error('call context is null'));
      }
    }
    next();
  };
};
