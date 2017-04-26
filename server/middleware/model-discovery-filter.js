/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
// var loopback = require('loopback');
// var debug = require('debug')('model-discovery-filter');
// var lwspace = require('loopback-workspace');
// var _ = require('lodash');
// var modelPersonalizer = require('../../lib/model-personalizer');
var util = require('../../lib/common/util');
var log = require('../../lib/logger')('model-discovery-filter');

/**
 * Model Discovery Filter
 *
 * @name Model Discovery Filter
 * @memberof Middleware
 */

module.exports = function ModelDiscoveryFilter(options) {
  return function modelDiscoveryFilterReturnCb(req, resp, next) {
    var app = req.app;
    var url = req.url;

    log.debug(req.callContext, 'url = ', req.url);

    var restApiRoot = app.get('restApiRoot');
    if (req.url.indexOf(restApiRoot) !== 0) {
      log.debug(req.callContext, 'url = ', req.url, ' ---- skipping model discovery');
      return next();
    }

    var invokedPlural = url.split('/')[2].split('?')[0];
    var savedName = invokedPlural;

    // var ModelDefinition = lwspace.models['ModelDefinition'];
    var ModelDefinition = app.models.ModelDefinition;

    var baseModel = util.checkModelWithPlural(req.app, invokedPlural);
    ModelDefinition.findOne({
      where: {
        variantOf: baseModel
      }
    }, req.callContext, function modelDiscoveryFilterModelDefinitionFindOneCb(err, instance) {
      if (err || !instance) {
        return next();
      }
      req.url = req.url.replace(savedName, instance.plural);

      return next();
    });
  };
};
