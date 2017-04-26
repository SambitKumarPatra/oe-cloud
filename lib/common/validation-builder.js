/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This class provides utility methods to collect all the different types
 * of validations defined on a model.
 * Each of the method takes 'model' object as a parameter and
 * extracts the validation rules attached to the model from it.
 *
 * @module Validation Builder
 * @author Pragyan Das
 */

var logger = require('../logger');
var log = logger('validation-builder');
var validationUtils = require('./validation-utils');
var applicableValidations = validationUtils.applicableValidations;
var validationExpressionMapper = validationUtils.validationExpressionMapper;

module.exports = {
  buildValidations: buildValidations
};

/**
 *
 * Aggregate all the different types of validations
 * @param {Object} model - model constructor for which validation rules are to be aggregated
 * @returns {Object[]} Multi dimenssional array containing all the validation rules
 */
function buildValidations(model) {
  var validations = [];
  validations = validations.concat(validations,
    getPropValidations(model),
    getRelationValidations(model),
    getEvValidations(model));
  return validations;
}

/**
 *
 * Aggregation of validations attached to all the properties of the model
 * @param {Object} model - model constructor for which validation rules are to be aggregated
 * @returns {Object[]} Array containing all the property level validation rules
 */
function getPropValidations(model) {
  var propertyValidations = [];
  var properties = model.definition.properties;
  log.info(log.defaultContext(), 'building property level validation rules for : ', model.modelName);
  Object.keys(properties).forEach(function propertiesForEachCb(propertyName) {
    var propertyType = properties[propertyName].type;
    var type = 'default';
    var typeName = properties[propertyName].type.name && properties[propertyName].type.name.toLowerCase();
    if (propertyType instanceof Function && propertyType.sharedClass) {
      type = 'object';
    } else if (propertyType instanceof Array && propertyType[0] && propertyType[0].sharedClass) {
      type = 'array';
    } else if (Object.keys(validationUtils.applicableValidations).indexOf(typeName) > 0) {
      type = properties[propertyName].type.name.toLowerCase();
    }

    // Prevent script injection , for example, in a string field, unless allowScript
    // is given, one should not be able to inject a <script> tag.
    if (typeName === 'string' &&
      !properties[propertyName].allowScript) {
      propertyValidations.push({
        expression: validationExpressionMapper.script,
        args: {
          value: null,
          type: type,
          name: propertyName,
          validateWhenRule: null
        }
      });
    }

    Object.keys(properties[propertyName]).forEach(function propertyNameForEachCb(key) {
      if (applicableValidations[type].indexOf(key) >= 0) {
        // pick the respective validation function according to the type of rule e.g. 'min', 'max', 'unique', etc.
        var expression = validationExpressionMapper[key];
        if (typeof expression === 'object') {
          expression = expression[properties[propertyName][key].toString()];
        }
        if (expression) {
          var validateWhenRule = null;
          if (properties[propertyName].validateWhen && properties[propertyName].validateWhen[key]) {
            // pick the validateWhen condition if present for the rule
            validateWhenRule = properties[propertyName].validateWhen[key];
          }
          // push the property level validation rule into the validation array
          propertyValidations.push({
            expression: expression,
            args: {
              value: properties[propertyName][key],
              type: type,
              name: propertyName,
              validateWhen: validateWhenRule
            }
          });
        }
      }
    });
  });
  return propertyValidations;
}

/**
 *
 * Aggregation of all the validation rules attached to evValidations object of the model
 * @param {Object} model - model constructor for which validation rules are to be aggregated
 * @returns {Object[]} Array containing all the evValidation rules
 */
function getEvValidations(model) {
  var evValidations = [];
  var validations = model.definition.settings.evValidations || {};
  log.info(log.defaultContext(), 'building EvValidation validation rules for : ', model.modelName);
  Object.keys(validations).forEach(function validationsForEachCb(evValidationName) {
    var evValidation = validations[evValidationName];
    // pick the respective validation function according to the type of rule e.g. 'reference' or 'custom'
    var expression = validationExpressionMapper.evValidation(evValidation.type);
    if (expression) {
      var validateWhenRule = null;
      if (evValidation.validateWhen) {
        // validateWhen takes a string in case of ev validations if validateWhen is an object then nake the rule null
        if (typeof evValidation.validateWhen === 'object') {
          validateWhenRule = null;
        } else {
          // pick the validateWhen condition if present for the rule
          validateWhenRule = evValidation.validateWhen;
        }
      }
      // push the evValidation rule into the validation array
      evValidations.push({
        expression: expression,
        args: {
          value: evValidation,
          type: null,
          name: evValidationName,
          validateWhen: validateWhenRule
        }
      });
    }
  });

  return evValidations;
}

/**
 *
 * Aggregation of all the validation rules of relations' object of the model
 * @param {Object} model - model constructor for which validation rules are to be aggregated
 * @returns {Object[]} Array containing all the relational validation rules
 */
function getRelationValidations(model) {
  var relations = Object.keys(model.relations).length ? model.relations : model.settings.relations;
  if (!relations) {
    return [];
  }

  var relationValidations = [];
  log.info(log.defaultContext(), 'building relation validation rules for : ', model.modelName);
  Object.keys(relations).forEach(function relationsForEachCb(relationName) {
    var relation = relations[relationName];
    // pick the respective validation function according to the type of relation e.g. 'belongsTo', etc
    var expression = validationExpressionMapper.relation(relation.type);
    var modelFrom = model.modelName;
    var modelTo = relation.modelTo ? relation.modelTo.modelName : relation.model;
    if (modelFrom !== modelTo && expression) {
      // push the relation validation rule into the validation array
      relationValidations.push({
        expression: expression,
        args: {
          value: relation,
          type: null,
          name: relationName
        }
      });
    }
  });

  return relationValidations;
}
