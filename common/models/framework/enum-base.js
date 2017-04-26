/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 *
 * @classdesc This Model acts as base model for the enum classes that an app may have.
 *   Enum classes are similar to any other loopback model, but with small difference that it is derived from EnumBase,
 *   and has a "enumList" property in the model definition which is an array. Sample given below.
 *   <pre>
 *   {
 *     name : "FrequencyEnum",
 *     base : "EnumBase",
 *     enumList : [
 *        {
 *           code : "M",
 *           description : "Monthly"
 *        },
 *        {
 *           code : "A",
 *           description : "Annual"
 *        }
 *     ]
 *   }
 *   </pre>
 *   Now, this enum can be used in any other loopback model as below, and framework provides the below advantages:
 *   <pre>
 *   1. The field value of the model will be validated against the enum's code value
 *   2. The field will be rendered as a "combo" field in UI.
 *   3. In UI, description of the enumvalue is displayed and binds to the code of enum to model's field.
 *   </pre>
 *   Sample usage from any other model: Please note the "enumtype" property added to the field "interestFrequency"
 *   <pre>
 *   {
 *      'name': 'LoanDetails',
 *      'base': 'BaseEntity',
 *      'properties': {
 *          'interestFrequency': {
 *              'type': 'string',
 *              'enumtype': 'FrequencyEnum'
 *          }
 *      }
 *   }
 *   </pre>
 *
 * @kind class
 * @class EnumBase
 * @author RSR
 */

var logger = require('../../../lib/logger');
var log = logger('enum-base');

module.exports = function EnumBaseFn(EnumBase) {
  /**
  * Converts a given enum code to description
  *
  * @memberof EnumBase
  * @name toDescription
  */

  EnumBase.toDescription = function enumBaseToDescriptionCb(enumCode) {
    var description;
    var enumList = this.settings.enumList;
    if (!enumList) {
      log.error(log.defaultContext(), this.modelName, ' does not have enumList property');
      return description;
    }
    for (var i = 0; i < enumList.length; ++i) {
      var obj = enumList[i];
      if (obj.code.toUpperCase() === enumCode.toUpperCase()) {
        description = obj.description;
        break;
      }
    }
    return description;
  };


  /**
  * Checks if a given enumcode is valid
  *
  * @memberof EnumBase
  * @name isValidEnum
  * @param {string} enumCode - enumcode
  * @returns {boolean} - true if valid enum
  */
  EnumBase.isValidEnum = function enumBaseIsValidEnumCb(enumCode) {
    var ret = false;
    var enumList = this.settings.enumList;
    if (!enumList) {
      log.error(log.defaultContext(), this.modelName, ' does not have enumList property');
      return ret;
    }
    for (var i = 0; i < enumList.length; ++i) {
      var obj = enumList[i];
      if (obj.code.toUpperCase() === enumCode.toUpperCase()) {
        ret = true;
        break;
      }
    }
    return ret;
  };
};
