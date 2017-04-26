/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * @classdesc This is the companion js file of the DataSourceMapping Model, which gets executed
 * once during the lifetime of the application (at the time of DataSourceMapping  model creation)
 * This model maitains mapping between datasource and model for a context. This is derived from baseEntity
 * @kind class
 * @author Praveen/Atul
 * @class DataSourceMapping
 */

module.exports = function dataSourceMappingModelFn(dataSourceMappingModel) {
  /**
   * update datasource mapping in memory used for datasource switch mixin
   * This will keep data base and in memory collection in sync
   *
   * @param {object} ctx - save context which contains data
   * @param {function} next - next continuation callback
   */

  //
  dataSourceMappingModel.observe('after save', function dataSourceMappingAfterSave(ctx, next) {
    var mapping = ctx.instance;
    if (!mapping) {
      return next();
    }

    var app = dataSourceMappingModel.app;
    app.locals.dataSourceMappings = app.locals.dataSourceMappings || {};
    app.locals.dataSourceMappings[mapping.modelName] = app.locals.dataSourceMappings[mapping.modelName] || [];
    var idx = app.locals.dataSourceMappings[mapping.modelName].findIndex(function findById(element, index, array) {
      // converting id (bson object) into string and comparing the ids.
      if (element.id.toString() === mapping.id.toString()) {
        return true;
      }
      return false;
    });

    if (idx >= 0) {
      app.locals.dataSourceMappings[mapping.modelName][idx] = mapping;
    } else {
      app.locals.dataSourceMappings[mapping.modelName].push(mapping);
    }
    return next();
  });

  // after delete
  dataSourceMappingModel.observe('after delete', function dataSourceMappingBeforeDelete(ctx, next) {
    next();
  });
};
