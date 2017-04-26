/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var bootstrap = require('../bootstrap');
var app = bootstrap.app;
var expect = bootstrap.chai.expect;
var loopback = require('loopback');
var models = bootstrap.models;
var chai = require('chai');
chai.use(require('chai-things'));

var modelName = 'Customer';

describe(chalk.blue('Basic Crud for Postgresql connector'), function () {
    
    before('setup test data', function (done) {
        
        var dataSourceConfig = {
            'connector': require('loopback-connector-evpostgresql'),
            'host': 'localhost',
            'port': 5432,
            'url': 'postgres://postgres:postgres@localhost:5432/evf',
            'database': 'evf',
            'password': 'postgres',
            'name': 'evf',
            'user': 'postgres',
            'connectionTimeout': 50000
        };
        
        loopback.createModel({
            'name': modelName,
            'base': 'PersistedModel',
            'strict': false,
            'idInjection': true,
            'options': {
                'validateUpsert': true
            },
            'properties': {
                'name': {
                    'type': 'string'
                },
                'age': {
                    'type': 'number'
                },
                'phone': {
                    'type': 'string'
                }
            }
        });
        var model = loopback.findModel(modelName);
        app.dataSource('evf', dataSourceConfig);
        model.attachTo(app.dataSources['evf']);
        
        done();
    });
    
    after('destroy test models', function (done) {
        var model = loopback.findModel(modelName);
        model.destroyAll({}, bootstrap.defaultContext, done);
    });
    
    
    it('Creation of data should be successful', function (done) {
        var model = loopback.findModel(modelName);
        var data = {
            'name': 'Mike',
            'age': 40,
            'phone': '12345'
        };
        model.create(data, bootstrap.defaultContext, function (err, results) {
            expect(err).to.be.null;
            done();
        });
    });
    
    it('Read data from postgres table successfully', function (done) {
        var model = loopback.findModel(modelName);
        model.find({}, bootstrap.defaultContext, function (err, results) {
            expect(err).to.be.undefined;
            model.findById(results[0].id, bootstrap.defaultContext, function (err, result) {
                expect(err).to.be.undefined;
                done();
            });
        });
    });
    
    it('Update data successfully', function (done) {
        var model = loopback.findModel(modelName);
        model.find({}, bootstrap.defaultContext, function (err, results) {
            expect(err).to.be.undefined;
            var data = results[0];
            data.name = 'Michael';
            model.upsert(data, bootstrap.defaultContext, function (err, results) {
                expect(err).to.be.null;
                done();
            });
        });
    });
    
    it('Delete data successfully', function (done) {
        var model = loopback.findModel(modelName);
        var data = {
            'name': 'George',
            'age': 45,
            'phone': '54321'
        };
        model.create(data, bootstrap.defaultContext, function (err, result) {
            expect(err).to.be.null;
            model.deleteById(result.id, bootstrap.defaultContext, function (err, results) {
                expect(err).to.be.null;
                done();
            });
        });
    });

});