/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This middleware overrides http method
 * Some corporate firewalls do not allow making calls to methods like DELETE and PUT
 * as their security policy. In such situation the API caller can use POST method to
 * call the API and specify the actual method they intended to call in the query
 * string or as part of HTTP header (X-HTTP-METHOD-OVERRIDE)
 *
 * @name HTTP Method Overriding
 * @author Ramesh Choudhary
 * @memberof Middleware
 */

module.exports = function HttpMethodOverridingFilter(options) {
  /* TODO: Add more control checks to allow/disallow method overriding.
  */
  return function methodOverride(req, res, next) {
    var requestedMethod = req.headers['x-http-method-override'];

    if (typeof requestedMethod !== 'undefined') {
      req.originalMethod = req.method;
      req.method = requestedMethod;
    }
    next();
  };
};
