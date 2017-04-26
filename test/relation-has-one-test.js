/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/* jshint -W024 */
/* jshint expr:true */
//to avoid jshint errors for expect

var bootstrap = require('./bootstrap');
var chalk = require('chalk');
var async = require('async');
var log = require('../lib/logger')('switch-data-source-test');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));

describe(chalk.blue('relation-has-one'), function() {

    var parentModelName = 'HasOneParent';
    var childModelName = 'HasOneChild';

    var testChildModel = {
        name: childModelName,
        base: 'BaseEntity',
        properties: {
            'childName': {
                'type': 'string',
            }
        },
        relations: {
            'parent': {
                'type': 'belongsTo',
                'model': parentModelName
            }
        }
    };

    var testParentModel = {
        name: parentModelName,
        base: 'BaseEntity',
        properties: {
            'name': {
                'type': 'string',
            },
            'description': {
                'type': 'string',
            }
        },
        dataSourceName: 'db',
        relations: {
            'child': {
                'type': 'hasOne',
                'model': childModelName,
                'foreignKey': 'parentId'
            }
        }
    };

    var data = {
        'name': 'Name1',
        'description': 'OK'
    };

    var ModelDefinition = bootstrap.models.ModelDefinition;

    var iciciUser = {
        'username': 'iciciUser',
        'password': 'Infy123++',
        'email': 'iciciuser@gmail.com',
        'tenantId': 'icici'
    };

    before('create model', function(done) {
        async.series([
        function createChildModel(cb) {
                var model = bootstrap.models['HasOneChild'];
                if (model) {
                    cb();
                } else {
                    ModelDefinition.create(testChildModel, bootstrap.defaultContext, function(err, res) {
                        if (err) {
                            console.log('unable to create model ', err);
                            cb();
                        } else {
                            cb();
                        }
                    });
                }
            },
        function createParentModel(cb) {
                var model = bootstrap.models[parentModelName];
                if (model) {
                    cb();
                } else {
                    ModelDefinition.create(testParentModel, bootstrap.defaultContext, function(err, res) {
                        if (err) {
                            console.log('unable to create model ', err);
                            cb();
                        } else {
                            cb();
                        }
                    });
                }
            },
        function(cb) {
                // this line is just to test context lost problem
                bootstrap.createTestUser(iciciUser, 'ev-admin', cb);
            },
        function alldone() {
                done();
            }
    ]);
    });

    it('create and find data ', function(done) {

        var model = bootstrap.models[parentModelName];
        model.destroyAll({}, bootstrap.defaultContext, function(err, res) {
            model.create(data, bootstrap.defaultContext, function(err, res) {
                model.find({
                    'where': {
                        'name': 'Name1'
                    }
                }, bootstrap.defaultContext, function(err, res) {
                    log.debug(bootstrap.defaultContext, 'verify data ', err, res);

                    res[0].reload(bootstrap.defaultContext, function(err, parent) {
                        parent.child.create({
                            childName: 'Child1'
                        }, bootstrap.defaultContext, function(err, response) {
                            expect(response.parentId).to.be.equal(parent.id);
                            done();
                        });
                    });
                });
            });
        });
    });


    after('after clean up', function(done) {
        var model = bootstrap.models[parentModelName];
        model.destroyAll({}, bootstrap.defaultContext, function(err, info) {
            if (err) {
                done(err);
            } else {
                log.debug(bootstrap.defaultContext, 'number of record deleted -> ', info.count);
                ModelDefinition.destroyAll({
                    'name': parentModelName
                }, bootstrap.defaultContext, function() {
                    done();
                });
            }
        });
    });

});
