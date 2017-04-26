/*
©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 *
 *
 * @module EV Property expression utils
 */

var logger = require('../logger');
var log = logger('property-expression-utils');
module.exports = {
  propertyExpressions: propertyExpressions
};


function propertyExpressions(model) {
  var propertyExpressionsArr = [];
  var properties = model.definition.properties;
  log.debug(log.defaultContext(), 'in property experssion util:', model.definition.name);
  Object.keys(properties).forEach(function propertiesForEachCb(propertyName) {
    Object.keys(properties[propertyName]).forEach(function propertyNameForEachCb(key) {
      // check if model property has key propExpression and add to array for mixin evaluation
      if (key === 'propExpression') {
        propertyExpressionsArr.push({
          propExpression: properties[propertyName].propExpression,
          name: propertyName
        });
      }
    });
  });
  return propertyExpressionsArr;
}
