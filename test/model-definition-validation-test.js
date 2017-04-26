/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This Unit Test script tests the feature of the EVF framework that
 * checks the validity of a model before creating the model.
 * If the model is valid then only it is created.
 * Validity of model is checked by checking validity of all
 * the expressions(validateWhen, mustache expression, expression language expression, etc.).
 * Name of the properties of the model also can not be any of the following invalid values like['isValid']
 * 
 * Author: Sambit Kumar Patra
 */


var bootstrap = require('./bootstrap');
var chalk = require('chalk');
var chai = bootstrap.chai;
var expect = chai.expect;
var models = bootstrap.models;
var ModelDefinition = models.ModelDefinition;

describe(chalk.blue('Model Definition Validation Test'), function () {
    
    this.timeout(20000);
    
    it('Should fail to create a new model using ModelDefinition as evValidation rule has wrong validateWhen expression as well as wrong mustache query and prop1 has wrong validateWhen expression', function (done) {
        var TestModelDefinition = {
            'name': 'ModelA',
            'base': 'BaseEntity',
            'plural': 'ModelAs',
            'strict': false,
            'idInjection': true,
            'options': {
                'validateUpsert': true
            },
            'properties': {
                'prop1': {
                    'type': 'string',
                    'required': true,
                    'validateWhen': {
                        'required' : '@ = j'
                    }
                }
            },
            'validations': [],
            'evValidations': {
                'exprCheck': {
                    'validateWhen': '@p = @i.prop1',
                    'type': 'reference',
                    'errorCode': 'expr-err-001',
                    'refModel': 'ModelB',
                    'refWhere': '{\'a\' : \'b\'};{p = y}'
                }
            },
            'relations': {},
            'acls': [],
            'methods': {}
        };

        ModelDefinition.create(TestModelDefinition, bootstrap.defaultContext, function (err, model) {
            expect(err).not.to.be.undefined;
            expect(err).to.have.lengthOf(3);
            done();
        });
});

    it('Should fail to create a new model using ModelDefinition as evValidation rule has wrong expression clause as well as prop1 has wrong validateWhen expression', function (done) {
        var TestModelDefinition = {
            'name': 'ModelB',
            'base': 'BaseEntity',
            'plural': 'ModelBs',
            'strict': false,
            'idInjection': true,
            'options': {
                'validateUpsert': true
            },
            'properties': {
                'prop1': {
                    'type': 'string',
                    'required': true,
                    'validateWhen': {
                        'required' : 'm = j < '
                    }
                }
            },
            'validations': [],
            'evValidations': {
                'exprCheck': {
                    'validateWhen': '@i.prop1 !== undefined',
                    'type': 'custom',
                    'errorCode': 'expr-err-001',
                    'expression': '@mLocation.companyCode == @i.buyerCompanyCode'
                }
            },
            'relations': {},
            'acls': [],
            'methods': {}
        };
        
        ModelDefinition.create(TestModelDefinition, bootstrap.defaultContext, function (err, model) {
            expect(err).not.to.be.undefined;
            expect(err).to.have.lengthOf(2);
            done();
        });
    });

    it('Should fail to create a new model using ModelDefinition as property name is an invalid value', function (done) {
        var TestModelDefinition = {
            'name': 'ModelC',
            'base': 'BaseEntity',
            'plural': 'ModelCs',
            'strict': false,
            'idInjection': true,
            'options': {
                'validateUpsert': true
            },
            'properties': {
                'isValid': {
                    'type': 'string',
                    'required': true
                }
            },
            'validations': [],
            'relations': {},
            'acls': [],
            'methods': {}
        };
        
        ModelDefinition.create(TestModelDefinition, bootstrap.defaultContext, function (err, model) {
            expect(err).not.to.be.undefined;
            expect(err).to.have.lengthOf(1);
            done();
        });
    });
});
