/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
// var loopback = require('loopback');
var log = require('../../lib/logger')('boot-datasources');
var util = require('../../lib/common/util');

/**
 * This script is responsible for adding
 *
 * @memberof Boot Scripts
 * @author Praveen Gulati (kpraveen)
 * @name Create Datasources
 */

module.exports = function DataSourcesBootFn(app, cb) {
  var dataSourceDefinitionModel = app.models.DataSourceDefinition;
  /**
 * Query DataSourceDefinition model for every record, creates actual Data Source in loopback by calling CreateDatasource() utility function
 * Ensures that ignorecontext is set to true though it is not being effective.
 * find all DataSource Definitions in the ds definition database and create them in the LB app
 * @param {Object} empty object where clause so that all records are returned
 * @returns {function} dataSourceDefinitionModelFindCb - callback that takes results and error if it is there.
 */
  var options = {};
  options.fetchAllScopes = true;
  options.ignoreAutoScope = true;
  options.bootContext = true;
  dataSourceDefinitionModel.find({}, options, function dataSourceDefinitionModelFindCb(err, results) {
    if (err) {
      log.debug(options, {
        'message': 'WARNING',
        'cause': err,
        'details': ''
      });
      return cb();
    }

    if (results && results.length) {
      results.forEach(function dataSourceDefinitionModelFindResultsFn(dsdefinition) {
        util.createDataSource(app, dsdefinition, options);
      });
      // Object.keys(app.datasources).forEach(function iter(id) { //logging fails because the Objects are circular - this needs to be fixed
      //    log.debug(id, app.datasources[id]);
      // });
      return cb();
    }
    // Object.keys(app.datasources).forEach(function iter(id) {
    //  log.debug(id, app.datasources[id]);
    // });
    cb();
  });
};
