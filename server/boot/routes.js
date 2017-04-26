/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var path = require('path');

/**
 * This script is responsible for creating routes for bower_Components check.
 * It also creates route for homepage, login and debug using plain express model.
 *
 * @memberof Boot Scripts
 * @author Praveen Gulati (kpraveen)
 * @name Creates routes for homepage, login and debug
 */

module.exports = function Routes(app) {
  var router = new app.loopback.Router();

  // var path = require('path');

  var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

  router.get('/', function routesGetDefaultCb(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../../client') });
  });

  router.get('/homepage', ensureLoggedIn('/login'), function routesGetHomepageCb(req, res) {
    var obj = {};
    obj.url = req.session.returnTo;
    if (!obj.url) {
      obj.url = '/home';
    }
    res.send(obj);
  });

  router.get('/login', function routesGetLoginCb(req, res) {
    res.sendFile('login.html', { root: path.join(__dirname, '../../client') });
  });

  router.get('/debug', function routesGetLoginCb(req, res) {
    var model = app.models.DataSourceDefinition;
    var ret = model.getDataSource().settings;
    res.send(JSON.stringify(ret));
  });

  app.use(router);
};
