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
chai.use(require('chai-things'));
var loopback = require('loopback');
var async = require('async');
var defaults = require('superagent-defaults');
var supertest = require('supertest');
var baseUrl = bootstrap.basePath;
var expect = chai.expect;
var logger = require('../lib/logger');

var models = bootstrap.models;

describe(chalk.blue('data-acl-update-test'), function () {

    var modelName1 = 'ItemModelPQR';
    var modelName2 = 'ConfirmationPQR';

    var defaultContext = {
        ctx: {
            tenantId: 'test-tenant',
            remoteUser: 'system'
        }
    };

    //--------------------------------------------------------------
    // user with role A should be able to 
    //--------------------------------------------------------------
    // Category | Find    | Create    |  Update   | Create
    //          |         |           |           | Confirmation
    // ------------------------------------------------------------
    // Book     | Allowed | Allowed   | Allowed   | NotAllowed 
    //--------------------------------------------------------------
    // Music    | Allowed | NotAllowed|NotAllowed | Allowed
    //--------------------------------------------------------------
    // Update category of existing item from book to music should 
    // not be allowed
    //--------------------------------------------------------------
    var dataacls = [
        {
            model: modelName1,
            principalType: 'ROLE',
            principalId: 'ROLE232',
            accessType: 'READ',
            group: 'category',
            property: '*',
            filter: { 'or': [{ 'category': 'book' }, { 'category': 'music' }] },
            errorCode: 'data-acl-err-003'
        },
        {
            model: modelName1,
            principalType: 'ROLE',
            principalId: 'ROLE232',
            accessType: 'WRITE',
            property: 'updateById',
            group: 'category',
            filter: { 'category': 'book' },
            errorCode: 'data-acl-err-003'
        },
        {
            model: modelName1,
            principalType: 'ROLE',
            principalId: 'ROLE232',
            accessType: 'WRITE',
            property: 'updateAttributes',
            group: 'category',
            filter: { 'category': 'book' },
            errorCode: 'data-acl-err-003'
        },
        {
            model: modelName1,
            principalType: 'ROLE',
            principalId: 'ROLE232',
            accessType: 'WRITE',
            property: '__create__confirmations',
            group: 'category',
            filter: { 'category': 'music' },
            errorCode: 'data-acl-err-003'
        }

    ];

    var user1 = {
        'username': 'user8734',
        'password': 'user8734',
        'email': 'pkgulati23@evgmail.com'
    };

    var user2 = {
        'username': 'user8735',
        'password': 'user8735',
        'email': 'user8735@gmail.com'
    };

    var modeldefs = [
        {
            name: modelName1,
            base: 'BaseEntity',
            properties: {
                'name': {
                    'type': 'string',
                },
                'description': {
                    'type': 'string',
                },
                'category': {
                    'type': 'string'
                }
            },
            relations: {
                'confirmations': {
                    'type': 'hasMany',
                    'model': modelName2
                }
            }
        },
        {
            name: modelName2,
            base: 'BaseEntity',
            properties: {
                'remarks': {
                    'type': 'string',
                },
                'confirmed': {
                    'type': 'string',
                }
            },
            relations: {
                'parent-item': {
                    'type': 'belongsTo',
                    'model': modelName1,
                    'foreignKey': 'parentId'
                }
            }
        }
    ];

    var items = [
        {
            name: 'book1',
            category: 'book',
            description: "books can be searched by ROLE232"
        },
        {
            name: 'music1',
            category: 'music',
            description: "music can be searched by ROLE232"
        },
        {
            name: 'cloth1',
            category: 'clothes',
            description: "clothes can not be searched or updated by ROLE232"
        }
    ];


    var user1token;

    var ModelDefinition = bootstrap.models.ModelDefinition;

    this.timeout(10000000);

    var cleanup = function (done) {
        async.series([function (cb) {
            var model = bootstrap.models[modelName1];
            if (model) {
                model.remove({}, defaultContext, function (err, res) {
                    cb();
                });
            } else {
                cb();
            }
        }, function (cb) {
            models.DataACL.remove({}, defaultContext, function () {
                cb();
            });
        }, function (cb) {
            ModelDefinition.remove({
                'name': modelName1
            }, defaultContext, function (err, res) {
                cb();
            });
        }, function () {
            done();
        }]);
    };

    var dbrecords;

    before('setup model for dataacl', function (done) {
        var lc = logger('LOGGER-CONFIG');
        var dlog = logger('data-acl');
        lc.changeLogger(dlog, logger.DEBUG_LEVEL);
 
        async.series([function (cb) {
            cleanup(cb);
            cb();
        },
        function (cb) {
            var model = bootstrap.models[modelName1];
            if (model) {
                model.remove({}, defaultContext, function () {
                    cb();
                });
            } else {
                cb();
            }
        },
        function (cb) {
            ModelDefinition.remove({
                'name': modelName1
            }, defaultContext, function (err, res) {
                cb();
            });
        },
        function (cb) {
            ModelDefinition.create(modeldefs, defaultContext, function (err, res) {
                if (err) {
                    console.log('unable to create model ', JSON.stringify(err));
                    cb();
                } else {
                    var model = loopback.findModel(modelName1);
                    model.create(items, defaultContext, function (err, result) {
                        cb();
                    });
                }
            });
        },
        function (cb) {
            models.DataACL.create(dataacls, defaultContext, function (err, res) {
                cb();
            });
        },
        function (cb) {
            bootstrap.createTestUser(user1, 'ROLE232', cb);
        },
        function (cb) {
            bootstrap.createTestUser(user2, 'ROLE232', cb);
        },
        function (cb) {
            var model = loopback.findModel(modelName1);
            model.find({}, defaultContext, function (err, res) {
                dbrecords = res;
                cb();
            });
        },
        function () {
            done();
        }]);
    });

    it('login1', function (done) {
        var postData = {
            'username': user1.username,
            'password': user1.password,
            'tenantId' : 'test-tenant'
        };

        var postUrl = baseUrl + '/BaseUsers/login';

        // without jwt token
        var api = defaults(supertest(bootstrap.app));
        api.set('Accept', 'application/json')
            .set('tenant_id', 'test-tenant')
            .post(postUrl)
            .send(postData)
            .expect(200).end(function (err, response) {
                user1token = response.body.id;
                done();
            });
    });

    it('find', function (done) {
        var api = defaults(supertest(bootstrap.app));
        var url = bootstrap.basePath + '/' + modelName1 + 's?access_token=' + user1token;
        api.set('Accept', 'application/json')
            .get(url)
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(2);
                done();
            });
    });

    it('find and update book', function (done) {
        var api = defaults(supertest(bootstrap.app));
        var filter = { where: { category: 'book' } };
        var url = bootstrap.basePath + '/' + modelName1 + 's?filter=';
        url += encodeURIComponent(JSON.stringify(filter));
        url += '&access_token=' + user1token;
        api.set('Accept', 'application/json')
            .get(url)
            .end(function (err, res) {
                expect(res.body).to.have.length(1);
                var rec = res.body[0];
                var url = bootstrap.basePath + '/' + modelName1 + 's/' + rec.id + '?access_token=' + user1token;
                rec.description += 'updated';
                api.set('Accept', 'application/json')
                    .put(url)
                    .send(rec)
                    .end(function (err, res) {
                        expect(res.status).to.be.equal(200);
                        expect(res.body._version).not.to.be.equal(rec._version);
                        var url = bootstrap.basePath + '/' + modelName1 + 's/' + rec.id + '/' + 'confirmations' + '?access_token=' + user1token;
                        var confirmation = {
                            "remarks": "confirmation for book",
                            "confirmed": "yes, praveen"
                        };
                        api.set('Accept', 'application/json')
                            .post(url)
                            .send(confirmation)
                            .end(function (err, res) {
                                expect(res.error.code === 'DATA_ACCESS_DENIED');
                                done();
                            });
                    });
            });
    });

    it('find and update music', function (done) {
        var api = defaults(supertest(bootstrap.app));
        var filter = { where: { category: 'music' } };
        var url = bootstrap.basePath + '/' + modelName1 + 's?filter=';
        url += encodeURIComponent(JSON.stringify(filter));
        url += '&access_token=' + user1token;
        api.set('Accept', 'application/json')
            .get(url)
            .end(function (err, res) {
                var rec = res.body[0];
                var url = bootstrap.basePath + '/' + modelName1 + 's/' + rec.id + '?access_token=' + user1token;
                rec.description += ' and description has been updated by user..';
                api.set('Accept', 'application/json')
                    .put(url)
                    .send(rec)
                    .end(function (err, res) {
                        var response = res.body;
                        // earlier it was coming in main body as 403
                        // expect(res.status).to.be.equal(403);
                        expect(res.error.status).to.be.equal(403);
                        expect(response.error.errors[0].code === 'data-acl-err-003').to.be.true;
                        var url = bootstrap.basePath + '/' + modelName1 + 's/' + rec.id + '/' + 'confirmations' + '?access_token=' + user1token;
                        var confirmation = {
                            "remarks": "confirmation for music",
                            "confirmed": "yes, praveen"
                        };
                        api.set('Accept', 'application/json')
                            .post(url)
                            .send(confirmation)
                            .end(function (err, res) {
                                expect(res.status).to.be.equal(200);
                                done();
                            });
                    });
            });
    });

    it('update book to music', function (done) {
        var api = defaults(supertest(bootstrap.app));
        var filter = { where: { category: 'book' } };
        var url = bootstrap.basePath + '/' + modelName1 + 's?filter=';
        url += encodeURIComponent(JSON.stringify(filter));
        url += '&access_token=' + user1token;
        api.set('Accept', 'application/json')
            .get(url)
            .end(function (err, res) {
                expect(res.body).to.have.length(1);
                var rec = res.body[0];
                rec.category = 'music';
                rec.description = 'book category can not be music';
                var url = bootstrap.basePath + '/' + modelName1 + 's/' + rec.id + '?access_token=' + user1token;
                api.set('Accept', 'application/json')
                    .put(url)
                    .send(rec)
                    .end(function (err, res) {
                        var response = res.body;
                        expect(res.error.status).to.be.equal(403);
                        expect(response.error.errors[0].code === 'data-acl-err-003').to.be.true;
                        done();
                    });
            });
    });

    after('after clean up', function (done) {
        var lc = logger('LOGGER-CONFIG');
        var dlog = logger('data-acl');
        lc.changeLogger(dlog, logger.ERROR_LEVEL);
        done();
        //cleanup(done);
    });

});

