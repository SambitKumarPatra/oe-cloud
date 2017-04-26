/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * JWT Token Util
 *
 * @module JWT Token Util
 *
 */

const SECRET_KEY = 'secret_key';
var logger = require('../lib/logger');
var log = logger('jwt-token-util');
// var debug = require('debug')('jwt-token-util');
// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');

var evconfig = require('../server/ev-config.json');
var secretKey = evconfig[SECRET_KEY];

module.exports = {
  generate: generate,
  verify: verify
};

function generate(key, value) {
  log.debug(log.defaultContext(), 'call for generate token with [', key, '] and value [', value, '] ');
  log.info(log.defaultContext(), 'call for generate token with [', key, '] and value [', value, '] ');
  var claims = {};
  claims[key] = value;
  // sign with default (HMAC SHA256)
  var token = jwt.sign(claims, secretKey);
  return token;
}

function verify(token) {
  log.debug(log.defaultContext(), 'call for verification token [', token, ']');
  log.info(log.defaultContext(), 'call for verification token [', token, ']');
  // verify a token symmetric

  jwt.verify(token, secretKey, function JwtTokenUtilVerifyCb(err, decoded) {
    if (err) {
      return false;
    }
    return true;
  });
}
