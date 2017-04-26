/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var expect = bootstrap.chai.expect;
var loopback = require('loopback');
var models = bootstrap.models;
var chai = require('chai');
chai.use(require('chai-things'));

var modelName = 'Organisation';

describe(chalk.blue('Composite Uniqueness Validation test'), function () {

    this.timeout(20000);

    before('setup test data', function (done) {
        models.ModelDefinition.events.once('model-' + modelName + '-available', function () {
            done();
        });

        models.ModelDefinition.create({
            "name": "Organisation",
            "base": "BaseEntity",
            "plural": "organisations",
            "strict": false,
            "idInjection": true,
            "options": {
                "validateUpsert": true
            },
            "properties": {
                "category": {
                    "type": "string",
                    "required": true
                },
                "name": {
                    "type": "string",
                    "required": true,
                    "unique": {
                        "scopedTo": ["location", "category"]
                    }
                },
                "location": {
                    "type": "string",
                    "required": true
                },
                "revenue": {
                    "type": "number",
                    "required": true
                }
            },
            "validations": [],
            "relations": {},
            "acls": [],
            "methods": {}
        }, bootstrap.defaultContext, function (err, model) {
            if (err) {
                console.log(err);
            }
            expect(err).to.be.not.ok;
        });
    });



    after('destroy test models', function (done) {
        models.ModelDefinition.destroyAll({
            name: modelName
        }, bootstrap.defaultContext, function (err, d) {
            if (err) {
                console.log('Error - not able to delete modelDefinition entry for mysettings');
                return done();
            }
            var model = loopback.getModel(modelName);
            model.destroyAll({}, bootstrap.defaultContext, function () {
                done();
            });
        });
    });

    it('Validation Test - Should fail to insert data', function (done) {

        var myModel = loopback.getModel(modelName);

        var data1 = {
            "category": "5",
            "location": "BLR",
            "name": "CROWN",
            "revenue": "1000000"
        };

        var data2 = {
            "category": "5",
            "location": "BLR",
            "name": "CROWN",
            "revenue": "7000000"
        };

        myModel.create(data1, bootstrap.defaultContext, function (err, results) {
            expect(err).to.be.null;
            myModel.create(data2, bootstrap.defaultContext, function (err, results) {
                expect(err).not.to.be.null;
                done();
            });
        });
    });

    it('Validation Test - Should insert data successfully', function (done) {

        var myModel = loopback.getModel(modelName);

        var data1 = {
            "category": "7",
            "location": "MUM",
            "name": "TAJ",
            "revenue": "1000000"
        };

        var data2 = {
            "category": "7",
            "location": "DL",
            "name": "TAJ",
            "revenue": "1000000"
        };

        myModel.create(data1, bootstrap.defaultContext, function (err, results) {
            expect(err).to.be.null;
            myModel.create(data2, bootstrap.defaultContext, function (err, results) {
                expect(err).to.be.null;
                done();
            });
        });
    });

});
