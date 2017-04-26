/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var util = require('../../../lib/common/util');
var loopbackDatasource = require('loopback-datasource-juggler').DataSource;
var logger = require('../../../lib/logger');
var log = logger('data-source-definition');

/**
 * @classdesc This model is to hold DataSourceDefinition, actual data sources created of application
 * This is used to create / delete data source dynamically
 * Only admin guys should have access to this model
 * @kind class
 * @author Praveen/Atul
 * @class DataSourceDefinition
 */

module.exports = function dataSourceDefinitionModelFn(dataSourceDefinitionModel) {
  dataSourceDefinitionModel.observe('before save', function dataSourceDefinitionBeforeSave(ctx, next) {
    if (ctx.instance && ctx.instance.connector) {
      var name = ctx.instance.connector;
      var obj = loopbackDatasource._resolveConnector(name);
      if (!obj.connector && obj.error !== null) {
        log.error(ctx.options, obj.error);
        return next(new Error(obj.error));
      }
      next();
    } else {
      var error = new Error();
      error.statusCode = 422;
      error.message = 'connector is undefined';
      log.error(ctx.options, error);
      next(error);
    }
  });
  /*
   * 'after save' - hook is used to create actual data source in loopback
   * User posts the data to DataSourceDefinition model and then this hoook is executed
   * when data is saved. After that this hook uses utility function to create data source
   *
   * @param {object} ctx - saved data context which contains actual data saved
   * @param {function} next - next: a callback function for continuation
   */
  dataSourceDefinitionModel.observe('after save', function dataSourceDefinitionAfterSave(ctx, next) {
    var dataSourceDefn = ctx.instance;
    util.createDataSource(ctx.Model.app, dataSourceDefn, ctx.options);
    return next();
  });
  /**
   * 'before delete' - hook is used to delete data source from loopback.
   * User deletes a records from DataSourceDefinition model this is executed.
   * @param {object} ctx - data context which contains actual data
   * @param {function} next - next: a callback function for continuation
   */
  dataSourceDefinitionModel.observe('before delete', function dataSourceDefinitionBeforeDelete(ctx, next) {
    var where = ctx.where;
    dataSourceDefinitionModel.find({
      where: where
    }, ctx.options, function dataSourceDefinitionModelBeforeDeleteFindCb(err, results) {
      if (err) {
        ctx.Model.app.handleError({
          'message': 'Database error while trying to fetch DataSourceDefinitions from DS Definition DB',
          'cause': err,
          'details': ''
        });
        return next();
      }
      results.forEach(function dataSourceDeleteFn(r) {
        util.deleteDatasource(ctx.Model.app, r);
      });
    });
    next();
  });
};
