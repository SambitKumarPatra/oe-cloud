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
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));
var defaults = require('superagent-defaults');
var supertest = require('supertest');
var baseUrl = bootstrap.basePath;

function GenerateModelName(model) {
    return model + Math.floor(Math.random() * (999));
}

describe(chalk.blue('model-variant-of'), function() {

    var accessTokens = {};

    var tenantId = GenerateModelName('tenant');
    var productModelName = GenerateModelName('Product');

    var user1 = {
        'username': 'kpraveen',
        'password': 'Infy123++',
        'email': 'kpraveen@gmail.com',
        'tenantId': tenantId
    };

    it('login as admin', function(done) {
        var postData = {
            'username': 'admin',
            'password': 'admin'
        };
        var postUrl = baseUrl + '/BaseUsers/login';
        var api = defaults(supertest(bootstrap.app));
        api.set('Accept', 'application/json')
        .post(postUrl)
        .send(postData)
        .expect(200).end(function(err, response) {
            accessTokens.admin = response.body.id;
            done();
        });
    });

    it('Create Model', function(done) {
        var modelDefinitionData = {
                'name': productModelName,
                'plural': productModelName,
                'base': 'BaseEntity',
                'strict': false,
                'idInjection': true,
                'validateUpsert': true,
                'properties': {
                    'name': {
                        'type': 'string',
                        'unique': true
                    }
                },
                'validations': [],
                'relations': {},
                'acls': [],
                'methods': {}
            };

        var api = defaults(supertest(bootstrap.app));

        var postUrl = baseUrl + '/ModelDefinitions?access_token='  + accessTokens.admin;

        api.set('Accept', 'application/json')
        .post(postUrl)
        .send(modelDefinitionData)
        .end(function(err, response) {
            if (err) {
                done(err);
            } else {
                if (response.statusCode !== 200) {
                    console.log(response.body);
                }
                expect(response.statusCode).to.be.equal(200);
                done();
            }
        });
    });

    it('Create Tenant', function(done) {

        var tenantData = {};
        tenantData.tenantId = tenantId;
        tenantData.tenantName = tenantData.tenantId;

        var api = defaults(supertest(bootstrap.app));
        var postUrl = baseUrl + '/Tenants?access_token='  + accessTokens.admin;
        api.set('Accept', 'application/json')
        .post(postUrl)
        .send(tenantData)
        .expect(200)
        .end(function(err, response) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('switch tenant', function(done) {
        var data = {
            tenantId: tenantId
        };
        var api = defaults(supertest(bootstrap.app));
        var postUrl = baseUrl + '/BaseUsers/switch-tenant?access_token='  + accessTokens.admin;
        api.set('Accept', 'application/json')
        .post(postUrl)
        .send(data)
        .expect(200)
        .end(function(err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.body).not.to.be.undefined;
                expect(result.body.tenantId).to.be.equal(tenantId);
                done();
            }
        });
    });

    it('Create User in tenant1', function(done) {

        var api = defaults(supertest(bootstrap.app));
        var postUrl = baseUrl + '/BaseUsers?access_token='  + accessTokens.admin;
        api.set('Accept', 'application/json')
        .post(postUrl)
        .send(user1)
        .expect(200)
        .end(function(err, resp) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('login as user1 in tenant1', function(done) {
        var postData = {
            'username': user1.username,
            'password': user1.password
        };
        var postUrl = baseUrl + '/BaseUsers/login';
        var api = defaults(supertest(bootstrap.app));
        api.set('Accept', 'application/json')
        .post(postUrl)
        .set('tenant_id', tenantId)
        .send(postData)
        .expect(200).end(function(err, response) {
            expect(response.body).not.to.be.undefined;
            expect(response.body.id).not.to.be.undefined;
            accessTokens.user1 = response.body.id;
            done();
        });
    });


    it('Create Variant Model', function(done) {
            var variantModel = productModelName + 'variant';
            var modelDefinitionData = {
                'name': variantModel,
                'base': productModelName,
                'variantOf': productModelName,
                'strict': false,
                'idInjection': true,
                'validateUpsert': true,
                'properties': {
                    'namevar': {
                        'type': 'string'
                    }
                },
                'validations': [],
                'relations': {},
                'acls': [],
                'methods': {}
            };

            var api = defaults(supertest(bootstrap.app));

            var postUrl = baseUrl + '/ModelDefinitions?access_token='  + accessTokens.user1;

            api.set('Accept', 'application/json')
            .post(postUrl)
            .send(modelDefinitionData)
            .end(function(err, response) {
                if (err) {
                    done(err);
                } else {
                    if (response.statusCode !== 200) {
                        console.log(response.body);
                    }
                    expect(response.statusCode).to.be.equal(200);
                    done();
                }
            });
        });

     it('should return the generated gridmetadata', function (done) {
        var api = defaults(supertest(bootstrap.app));
        var url = bootstrap.basePath + '/GridMetaData/' + productModelName + '/render' + '?access_token='  + accessTokens.user1;
         
        api
            .get(url)
            .expect(200).end(function (err, res) {
                var response = res.body;
                //console.log('gridmeta', response);
                expect(response).to.exist;
                expect(response.columnData).to.exist;
                expect(response.dialogMetaData).to.exist;
                done();
            });

    });

      it('should return the generated uimodel ', function (done) {
        var api = defaults(supertest(bootstrap.app));
        var url = bootstrap.basePath + '/UIMetaData/' + productModelName + '/render' + '?access_token='  + accessTokens.user1;
         
        api
            .get(url)
            .expect(200).end(function (err, res) {
                //var response = res.body;
                //console.log('uimetadata ', response);
                done();
            });

    });
    
    it('Post Data', function(done) {
        var postData = {
                'name': 'data1'
            };

        var api = defaults(supertest(bootstrap.app));

        var postUrl = baseUrl + '/' + productModelName + '?access_token='  + accessTokens.user1;

        api.set('Accept', 'application/json')
        .post(postUrl)
        .send(postData)
        .end(function(err, response) {
            if (err) {
                done(err);
            } else {
                if (response.statusCode !== 200) {
                    console.log(response.body);
                }
                expect(response.statusCode).to.be.equal(200);
                var callContext = {ctx :{}};
                callContext.ctx.tenantId = tenantId;
                var model = bootstrap.models[productModelName];
                model.find({}, callContext, function(err, list) {
                    expect(list[0]._autoScope.tenantId).to.be.equal(tenantId);
                    done();
                });
            }
        });
    });

});