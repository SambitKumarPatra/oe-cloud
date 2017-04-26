/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 *
 * @classdesc This Model processes all the business rules(grammar expressions), create their ASTs and attach it to BusinessRule model.
 * @kind class
 * @class BusinessRule
 * @author Sambit Kumar Patra
 */

var exprLang = require('../../../lib/expression-language/expression-language.js');
var logger = require('../../../lib/logger');
var log = logger('model-validations');

module.exports = function businessRule(BusinessRule) {
  /**
   * This 'after save' hook is used to intercept data sucessfully
   * POSTed to BusinessRule model, create ASTs of all the
   * expressions POSTed and attach it to "_ast" of BusinessRule Model
   * @param {object} ctx - context object
   * @param {function} next - next middleware function
   * @function businessRuleBeforeSaveCb
   */

  BusinessRule.observe('after save', function businessRuleBeforeSaveCb(ctx, next) {
    var data = ctx.instance || ctx.currentInstance || ctx.data;
    log.info(ctx.options, 'BusinessRule before save remote attaching expression to _ast');
    BusinessRule._ast[data.expression] = exprLang.createAST(data.expression);
    log.info(ctx.options, 'expression : ', data.expression, 'attached to _ast of BusinessRule model');
    next();
  });
};
