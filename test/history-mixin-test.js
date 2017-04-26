/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This file test the functionality of history management, it checks if history
 * is maintained for different Write operation such as update and delete.
 * 
 * and it also checks if /history rest api works fine with and without filter.
 * 
 * @author Sivankar Jain
 */
/* jshint -W024 */
/* jshint expr:true */
// to avoid jshint errors for expect
var bootstrap = require('./bootstrap');
var chai = bootstrap.chai;
var expect = chai.expect;
var models = bootstrap.models;
var loopback = require('loopback');
var debug = require('debug')('history-mixin-test');
var uuid = require('node-uuid');
var api = bootstrap.api;

describe('history-mixin tests	Programmatically', function() {

    this.timeout(50000);

    var modelName = 'MixinTest';
    var modelDetails = {
        name: modelName,
        base: 'BaseEntity',
        properties: {
            'name': {
                'type': 'string',
                'required': true,
                'unique': true
            }
        },
        strict: false,
        plural: modelName,
        mixins: {
            VersionMixin: true
        }
    };

    before('create test model', function(done) {
        models.ModelDefinition.create(modelDetails, bootstrap.defaultContext, function(err, res) {
            if (err) {
                debug('unable to create historyMixinTest model');
                done(err);
            } else {
                done();
            }
        });
    });

    it('should create a history model for Test model', function(done) {

        var model = loopback.getModel(modelName + 'History');
        expect(model).not.to.be.null;
        expect(model).not.to.be.undefined;
        done();
    });


    it('should insert data to TestModel, check if version is set and history model is empty ---programmatically',
        function(done) {
            this.timeout(5000);
            var postData = {
                'name': 'TestCaseOne'
            };
            models[modelName].create(postData, bootstrap.defaultContext, function(err, res) {
                if (err) {
                    done(err);
                } else {
                    models[modelName].history({}, bootstrap.defaultContext, function(err, historyRes) {
                        if (err) {
                            done(err);
                        } else {
                            expect(historyRes).to.be.empty;
                            done();
                        }
                    });
                }
            });
        });

    it('should insert data to TestModel model, update the same record multiple times and retrive its history.' +
        ' --programmatically',
        function(done) {
            
            this.timeout(15000);
            var postData = {
                'name': 'TestCaseTwo'
            };
            var dataId;
            models[modelName].create(postData, bootstrap.defaultContext, function(err, res) {
                if (err) {
                    done(err);
                } else {
                    postData.id = res.id;
                    postData.name = 'update1';
                    postData._version = res._version;
                    models[modelName].upsert(postData, bootstrap.defaultContext, function(err, upsertRes) {
                        if (err) {
                            done(err);
                        } else {
                            postData.name = 'update2';
                            postData.id = upsertRes.id;
                            postData._version = upsertRes._version;
                            models[modelName].upsert(postData, bootstrap.defaultContext, function(err, upsertRes) {
                                if (err) {
                                    done(err);
                                } else {
                                    models[modelName].history({
                                            where: {
                                                _modelId: dataId
                                            }
                                        },
                                        bootstrap.defaultContext, function(err, historyRes) {
                                            if (err) {
                                                done(err);
                                            } else {
                                                expect(historyRes).not.to.be.empty;
                                                expect(historyRes).to.have.length(2);
                                                done();
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
            });
        });

    it('should insert data to TestModel model, destroy the same record retrive its history ', function(done) {
        this.timeout(10000);

        var postData = {
            'name': 'TestCaseFour'
        };
        var dataId;
        models[modelName].create(postData, bootstrap.defaultContext, function(err, res) {
            if (err) {
                done(err);
            } else {
                dataId = res.id;
                models[modelName].deleteById(dataId, bootstrap.defaultContext, function(err, upsertRes) {
                    if (err) {
                        done(err);
                    } else {
                        models[modelName].history({
                            where: {
                                _modelId: dataId
                            }
                        }, bootstrap.defaultContext, function(err, historyRes) {
                            if (err) {
                                done(err);
                            } else {
                                expect(historyRes).to.have.length(1);
                                done();
                            }
                        });
                    }
                });
            }
        });
    });

    it('should insert new record, using upsert if id is not defined.', function(done) {

        var postData = {
            'name': 'TestCaseFive',
            '_version': uuid.v4()
        };
        models[modelName].upsert(postData, bootstrap.defaultContext, function(err, res) {
            if (err) {
                done(err);
            } else {
                expect(res.name).to.be.equal('TestCaseFive');
                expect(res.id).not.to.be.null;
                expect(res.id).not.to.be.undefined;
                done();
            }
        });
    });

    it('should insert data to TestModel model,update the same record multiple times and retrive its history--REST api',
        function(done) {
            this.timeout(10000);

            var postData = {
                'name': 'TestCaseThree'
            };
            var url = bootstrap.basePath + '/' + modelName + '/history';
            var dataId;
            var version;
            models[modelName].create(postData, bootstrap.defaultContext, function(err, res) {
                if (err) {
                    done(err);
                } else {
                    postData.id = res.id;
                    postData._version = res._version;
                    postData.name = 'newName';
                    models[modelName].upsert(postData, bootstrap.defaultContext, function(err, upsertRes) {
                        if (err) {
                            done(err);
                        } else {
                            api
                                .get(url)
                                .send()
                                .expect(200).end(function(err, historyRes) {
                                    debug('response body : ' + JSON.stringify(historyRes.body, null, 4));
                                    if (err) {
                                        done(err);
                                    } else {
                                        expect(historyRes.body).not.to.be.empty;
                                        expect(historyRes.body).to.have.length(4);
                                        done();
                                    }
                                });
                        }
                    });
                }
            });
        });

});
