/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var loopback = require('loopback');

module.exports = function designerRule(Model) {
  var postRule = function postRule(ctx, modelInstance, next) {
    var personalizatioRule = loopback.getModel('PersonalizationRule');
    var data = ctx.args.data;
    var newObj = {
      'modelName': data.modelName,
      'name': data.name,
      'personalizationRule': data.personalizationRule,
      'scope': data.customScope
    };

    personalizatioRule.create(newObj, ctx.req.callContext, function update(err, result) {
      if (err) {
        next(err);
      }
      data.config = data.config || {};
      data.config.id = result.id;
      data.config._version = result._version;
      next();
    });
  };

  var putRule = function putRule(ctx, modelInstance, next) {
    var personalizatioRule = loopback.getModel('PersonalizationRule');
    var data = ctx.args.data;
    var newObj = {
      'modelName': data.modelName,
      'name': data.name,
      'personalizationRule': data.personalizationRule,
      'scope': data.customScope,
      'id': data.config.id,
      '_version': data.config._version
    };

    personalizatioRule.upsert(newObj, ctx.req.callContext, function update(err, result) {
      if (err) {
        next(err);
      }
      data.config = data.config || {};
      data.config.id = result.id;
      data.config._version = result._version;
      next();
    });
  };

  var deleteRule = function deleteRule(ctx, modelInstance, next) {
    var personalizatioRule = loopback.getModel('PersonalizationRule');
    var data = ctx.args;
    var newObj = {
      'id': data.config.id,
      '_version': data.config._version
    };

    personalizatioRule.delete(newObj, ctx.req.callContext, function update(err, result) {
      if (err) {
        next(err);
      }
      next();
    });
  };

  Model.beforeRemote('create', postRule);
  Model.beforeRemote('upsert', putRule);
  Model.beforeRemote('delete', deleteRule);
};

