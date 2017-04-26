/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

var loopback = require('loopback');
var log = require('../../lib/logger')('redirect-for-uiroutes');

/**
 * This boot script registers express handler for each UIRoute
 * to redirect to / with redirectTo = url
 * So that when user presses refresh in browser
 * client side router will take user to redirectTo
 * If application needs to change or remove this behaviour
 * set disableRedirectForUIRoutes to false, implement new
 * behaviour in its own boot script
 * For example groupName handling can be done in app
 *
 * @memberof Boot Scripts
 * @author Praveen Gulati
 * @name Redirect Handling for UI Routes
 */

module.exports = function redirectForUIRoutes(app) {
  var UIRoute = loopback.getModelByType('UIRoute');

  var disableRedirectForUIRoutes = UIRoute.app.get('disableRedirectForUIRoutes');
  if (!disableRedirectForUIRoutes) {
    UIRoute.observe('after save', function uiRouteAFterSave(ctx, next) {
      if (ctx.instance) {
        var route = ctx.instance;
        route.redirectHandler(app);
      }
      next();
    });

    var options = {
      ctx: {}
    };

    options.ignoreAutoScope = true;
    options.fetchAllScopes = true;
    UIRoute.find({
      where: {}
    }, options, function uiRouteFind(err, res) {
      if (err) {
        log.error(options, err);
      }
      res.forEach(function resForEachFn(route) {
        route.redirectHandler(app);
      });
    });
  }
};
