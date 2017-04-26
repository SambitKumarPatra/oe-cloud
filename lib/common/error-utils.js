/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This class acts as an error wrapper which customises the loopback error by adding customised messages to it.
 * It prepares an customised error object which is finally attached to the response object.
 * @module ErrorUtils
 * @author Pragyan Das
 */

var logger = require('../logger');
var log = logger('error-utils');
var loopback = require('loopback');
var app = require('../../server/server.js').app;
var Mustache = require('mustache');

/**
 *
 * property level validation error codes and default messages
 *
 * @returns {Object} error object
 * @function ErrorUtils
 */
module.exports = (function ErrorUtils() {
  function getError(code, obj, cb) {
    // default error details
    var errDetails = app.errorDetails;
    var path = obj.path;
    var fieldName = obj.name;
    // obj.inputValue = obj.inst[obj.name];
    // fetch the error code
    var errorCode = obj.value ? obj.value.errorCode ? obj.value.errorCode : code : code;
    var Model = loopback.getModel('Error');
    var where = {
      'errCode': errorCode
    };
    var filter = {};
    filter.where = where;
    // Query the 'Error' model to get the customised error message
    // and any more information redarding the error
    // Prepare the customised error object
    Model.findOne(filter, obj.options, function errorUtilsModelFindCb(err, result) {
      if (err) {
        log.error(obj.options, 'Error in Picking up the customise error details');
      }
      var errorObj = {};
      var moreInfoUrl = {};
      errorObj.errCode = errorCode;
      if (result && result.errMessage) {
        // Sample Mustache query: 'The value entered is less than {{value}}'
        log.info(obj.options, 'Picking up the customise error details');
        errorObj.errMessage = Mustache.render(result.errMessage, obj);
      } else {
        // if no customised error message found then make errCode as errMessage
        log.info(obj.options, 'Picking up the default error details');
        errorObj.errMessage = getDefaultMessage(errDetails, errorCode);
      }
      // prepare the moreInformation URL, which will show details of the error
      // if no entry is present for the corresponding err code in Error model then moreInformation will have nothing
      if (obj.options && obj.options.origin && result && result.id) {
        log.info(obj.options, 'Preparing moreInformation URL');
        moreInfoUrl = obj.options.origin + '/api/' + Model.pluralModelName + '/' + result.id;
        errorObj.moreInformation = moreInfoUrl;
      }
      errorObj.fieldName = fieldName;
      errorObj.path = path;
      errorObj.retriable = false;
      cb(errorObj);
    });
  }
  return getError;
})();

/**
 *
 * Get the default error message from db.
 *
 * @param {Object} errDetails - default error messages and codes
 * @param {String} code - error code
 * @returns {String} error message
 */
function getDefaultMessage(errDetails, code) {
  var err = errDetails.filter(function errorUtilsErrorDetailsFilterCb(d) {
    return d.code === code;
  });
  return err[0] ? err[0].message : code;
}
