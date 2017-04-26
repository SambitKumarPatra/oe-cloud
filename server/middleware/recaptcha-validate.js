/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var request = require('request');
var process = require('process');

/**
 * This middleware validates Captcha
 *
 * @name Validate Recaptcha Middleware
 * @author - Rohit, Gourav
 * @memberof Middleware
 */

module.exports = function recaptchaValidate(options) {
  return function captchaValidate(req, res, next) {
    var recaptchaProperty = 'g-recaptcha-response';
    var app = req.app;

    var captchaResponse = req.headers ? req.headers[recaptchaProperty] : null;
    if (!captchaResponse && req.body) {
      captchaResponse = req.body[recaptchaProperty];

      if (captchaResponse) {
        delete req.body[recaptchaProperty];
      }
    }

    if (captchaResponse) {
      app.models.AppConfig.findOne({}, function AppConfigFindOneCb(err, data) {
        if (!err && data && data.server && data.server.recaptcha && data.server.recaptcha.secret) {
          var config = data.server.recaptcha || {};

          var postRequest = 'https://www.google.com/recaptcha/api/siteverify' +
                        '?secret=' + config.secret + '&response=' + captchaResponse;

          var proxiedRequest = request.defaults({
            'proxy': process.env.HTTP_PROXY || app.get('http_proxy')
          });

          proxiedRequest.get(postRequest, function captchaValidateComplete(err, response, body) {
            if (!err && body) {
              var data = JSON.parse(body);
              if (data.success) {
                next();
              } else {
                next(new Error(body));
              }
            } else {
              next(new Error(err));
            }
          });
        } else {
          next('recaptcha-config-missing');
        }
      });
    } else {
      next();
    }
  };
};
