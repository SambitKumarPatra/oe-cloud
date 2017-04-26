/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));
var api = bootstrap.api;
var models = bootstrap.models;
var loopback = require('loopback');
var async = require('async');
var app = bootstrap.app;

describe(chalk.blue('Update of record belonging to default tenant'), function () {
    this.timeout(40000);
    var modelName = 'DefaultTenantUpdateTestModel';
    var modelDetails = {
        name: modelName,
        base: 'BaseEntity',
        properties: {
            'name': {
                'type': 'string',
                'unique': true
            },
            'description': {
                'type': 'string'
            },
            'discount': {
                'type': 'number',
                'default': 10
            }
        },
        strict: false,
        idInjection: true,
        plural: modelName
    };

    var TestModel;

    var defaultTenantContext = {
        ctx: {
            tenantId: 'default',
            remoteUser: 'system'
        }
    };

    var allScopes = {
        ctx: {
            tenantId: 'test-tenant',
            remoteUser: 'test-user'
        },
        fetchAllScopes : true
    };

    var accessToken;

    before('Create model', function (done) {
        var query = {
            where: {
                name: modelName
            }
        };
        models.ModelDefinition.findOrCreate(query, modelDetails, defaultTenantContext, function (err, res, created) {
            TestModel = loopback.findModel(modelName);
            TestModel.purge({}, allScopes, function (err, info) {
                done();
            });
        });
    });

    before('Create Access Token', function (done) {
        // accessToken belongs to test-tenant
        // createAccessToken uses test-tenant
        var user = bootstrap.defaultContext.ctx.remoteUser.username;
        bootstrap.createAccessToken(user, function (err, token) {
            accessToken = token;
            done();
        });
    });

    it('Update default tenant record using PUT without ID ', function (done) {
        var data = {
            name: 'Test1',
            description: 'default tenant',
            discount: 20
        }
        TestModel.create(data, defaultTenantContext, function (err, rec) {
            expect(rec).to.be.ok;
            var url = bootstrap.basePath + '/' + modelName + '?access_token=' + accessToken;
            var data = rec.toObject();
            data.discount = 40;
            api
                .put(url)
                .send(data)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end(function (err, result) {
                    if (err) {
                        done(err);
                    } else {
                        // It should create a different record
                        // with a new ID
                        expect(result.status).to.be.equal(200);
                        expect(result.body).to.be.ok;
                        expect(result.body.id).not.to.be.equal(data.id);
                        done();
                    }
                });
        });
    });

    // This is bug in juggler this must be fixed
    it('Update default tenant record using PUT with ID ', function (done) {
        var data = {
            name: 'Test2',
            description: 'default tenant',
            discount: 20
        }

        TestModel.create(data, defaultTenantContext, function (err, rec) {
            expect(rec).to.be.ok;
            var url = bootstrap.basePath + '/' + modelName + '/' + rec.id + '?access_token=' + accessToken;
            var data = rec.toObject();
            data.discount = 40;
            api
                .put(url)
                .send(data)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end(function (err, result) {
                    if (err) {
                        done(err);
                    } else {
                        expect(result.status).to.be.equal(404);
                        done();
                    }
                });
        });
    });

});