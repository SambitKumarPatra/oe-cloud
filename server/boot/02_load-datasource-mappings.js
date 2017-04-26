/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This script is responsible for adding
 *
* @memberof Boot Scripts
* @author Praveen Gulati
* @name Load DataSource Mapping
 */

var log = require('../../lib/logger')('boot-datasources');

module.exports = function LoadDataSourceMappings(app, cb) {
  var model = app.models.DataSourceMapping;

  app.locals.dataSourceMappings = app.locals.dataSourceMappings || {};

  // store default data Source for file based models
  app.locals.defaultDataSources = {};
  for (var key in app.models) {
    if (app.models.hasOwnProperty(key)) {
      app.locals.defaultDataSources[key] = app.models[key].dataSource;
    }
  }

  var options = {};
  options.fetchAllScopes = true;
  // find all DataSource Mappings and cache them for getDataSource
  model.find({}, options, function fetchMappings(err, results) {
    if (err) {
      log.debug(options, {
        'message': 'WARNING',
        'cause': err,
        'details': ''
      });
      return cb();
    }
    results.forEach(function setdsmap(mapping) {
      app.locals.dataSourceMappings[mapping.modelName] = app.locals.dataSourceMappings[mapping.modelName] || [];
      app.locals.dataSourceMappings[mapping.modelName].push(mapping);
    });
    cb();
  });
};
