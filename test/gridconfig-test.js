/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var async = require('async');
var bootstrap = require('./bootstrap');
var chai = require('chai');

var models = bootstrap.models;
var expect = bootstrap.chai.expect;
var api = bootstrap.api;

chai.use(require('chai-things'));

function create(model, items, callback) {
    async.forEachOf(items,
        function (item, m, callback2) {
            model.create(item, bootstrap.defaultContext, function (a, b) {
                callback2();
            });
        },
        function (err) {
            if (err) {
                return callback(err);
            }
            callback();
        });
}

function deleteAndCreate(model, items, callback) {
    model.destroyAll({}, bootstrap.defaultContext, function () {
        async.forEachOf(items,
            function (item, m, callback2) {
                model.create(item, bootstrap.defaultContext, function (e, rec) {
                    if (e) {
                        console.error(e.message);
                    }
                    callback2();
                });
            },
            function (err) {
                if (err) {
                    return callback(err);
                }
                callback();
            });
    });
}


describe(chalk.blue('grid-config'), function () {

    this.timeout(10000);

    var modelA = "GridOrder";

    //definition of a model : Orders
    var order = {
        "name": "GridOrder",
        "plural": "GridOrders",
        "base": "BaseEntity",
        "idInjection": false,
        "properties": {
            "category": {
                "type": "string",
                "required": true
            },
            "price": {
                "type": "number",
                "required": true
            },
            "description": {
                "type": "string"
            },
            "date": {
                "type": "date"
            }
        }
    };

    var testGridConfig = {
        "code": "PersonTable",
        "label": "Users",
        "editorFormUrl": "/components/person-form.html",
        "columns": [
            {
                "key": "firstName",
                "label": "First Name",
                "type": "string"
            },
            {
                "key": "middleName",
                "label": "Middle Name",
                "type": "string"
            },
            {
                "key": "lastName",
                "label": "Last Name",
                "type": "string"
            },
            {
                "key": "email",
                "label": "E-Mail",
                "type": "string"
            }
        ]
    };

    before('Define model and load data', function (done) {
        create(models.ModelDefinition, [order], function (err) {
            if (err) {
                done(err);
            } else {
                deleteAndCreate(models.GridConfig, [testGridConfig], function (err1) {
                    done(err1);
                });
            }
        });
    });

    after('destroy model', function (done) {
        models['GridOrder'].destroyAll({}, bootstrap.defaultContext, function (err) {
            if (err) {
                console.error(err);
            }
            done();
        });
    });

    it('should throw an error if configCode is not provided', function (done) {
        api
            .get(bootstrap.basePath + '/GridConfigs/config/')
            .set('tenant_id', 'test-tenant')
            .expect(200).end(function (err, res) {
                var error = res.error;
                expect(error).to.exist;
                expect(error.status).to.be.equal(404);
                done();
            });
    });

    it('should return fetch/generate grid config if configCode is provided', function (done) {
        api
            .get(bootstrap.basePath + '/GridConfigs/config/' + modelA)
            .set('tenant_id', 'test-tenant')
            .expect(200).end(function (err, res) {
                var response = res.body;
                expect(response).to.exist;
                expect(response.label).to.exist;
                expect(response.columns).to.exist;
                expect(response.editorFormUrl).to.exist;
                expect(response.columns.length).to.be.equal(4);
                done();
            });
    });

    it('should return grid config if it is defined', function (done) {
        api
            .get(bootstrap.basePath + '/GridConfigs/config/' + "PersonTable")
            .set('tenant_id', 'test-tenant')
            .expect(200).end(function (err, res) {
                var response = res.body;
                expect(response).to.exist;
                expect(response.label).to.exist;
                expect(response.columns).to.exist;
                expect(response.editorFormUrl).to.exist;
                expect(response.columns.length).to.be.equal(4);
                done();
            });
    });

    it('should return error message if there is no GridConfig entry or a model defined for the provided configCode', function (done) {
        api
            .get(bootstrap.basePath + '/GridConfigs/config/' + 'unknownConfig')
            .set('tenant_id', 'test-tenant')
            .expect(200).end(function (err, res) {
                var error = res.error;
                expect(error).to.exist;
                expect(error.status).to.be.equal(500);
                done();
            });
    });

});