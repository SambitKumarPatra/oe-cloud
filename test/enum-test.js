/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var loopback = require('loopback');
var expect = bootstrap.chai.expect;
var models = bootstrap.models;
//var app = bootstrap.app;
var chai = require('chai');
chai.use(require('chai-things'));
//var supertest = require('supertest');
//var api = supertest(app);
//var debug = require('debug')('enum-test');

describe(chalk.green('Enum Test'), function() {
    var enumName = 'MyTestEnum';
    var enumConfig = {
        'name': enumName,
        'base': 'EnumBase',
        'strict': true,
        'properties': {},
        'validations': [],
        'relations': {},
        'acls': [],
        'methods': {},
        'enumList': [
            {
                code: 'M',
                description: 'Monthly'
            },
            {
                code: 'S',
                description: 'Semi'
            },
            {
                code: 'A',
                description: 'Annual'
            },
            {
                code: 'Qu',
                description: 'Quarterly'
            }
        ]
    };
    var parentModelName = 'MyTestModel';
    var parentModelConfig = {
        'name': parentModelName,
        'base': 'BaseEntity',
        'strict': true,
        'properties': {
            'code': {
                'type': 'string',
                'enumtype': 'MyTestEnum',
                'required': true
            }
        },
        'validations': [],
        'relations': {},
        'acls': [],
        'methods': {}
    };


    before('create enum MyTestEnum', function(done) {
        loopback.createModel(enumConfig);
        models.ModelDefinition.create(parentModelConfig, bootstrap.defaultContext, function(err, model) {
            done();
        });
    });

    it('should be valid if code is exact match', function(done) {
        var myenum = loopback.findModel(enumName);
        expect(myenum.isValidEnum('S')).to.be.equal(true);
        done();
    });
    it('should be valid if code is different case', function(done) {
        var myenum = loopback.findModel(enumName);
        expect(myenum.isValidEnum('s')).to.be.equal(true);
        done();
    });
    it('should be invalid if code is not valid', function(done) {
        var myenum = loopback.findModel(enumName);
        expect(myenum.isValidEnum('Y')).to.be.equal(false);
        done();
    });
    it('should be invalid if code is partial match', function(done) {
        var myenum = loopback.findModel(enumName);
        expect(myenum.isValidEnum('Q')).to.be.equal(false);
        done();
    });
    it('should return correct description for given code', function(done) {
        var myenum = loopback.findModel(enumName);
        expect(myenum.toDescription('S')).to.be.equal('Semi');
        done();
    });
    it('should return correct description for code in different case', function(done) {
        var myenum = loopback.findModel(enumName);
        expect(myenum.toDescription('qu')).to.be.equal('Quarterly');
        done();
    });
    it('should return undefined for incorrect code', function(done) {
        var myenum = loopback.findModel(enumName);
        expect(myenum.toDescription('y')).to.be.undefined;
        done();
    });
    it('should should return invalid model for invalid enum', function(done) {
        var mymodel = loopback.findModel(parentModelName);
        var mymodeldata = {
            code: 'KKK'
        };
        var mymodelobj = new mymodel(mymodeldata);
        mymodelobj.isValid(function(ret) {
            expect(ret).to.be.equal(false);
            done();
        }, bootstrap.defaultContext);
    });
    it('should should return valid model for valid enum', function(done) {
        var mymodel = loopback.findModel(parentModelName);
        var mymodeldata = {
            code: 'Qu'
        };
        var mymodelobj = new mymodel(mymodeldata);
        mymodelobj.isValid(function(ret) {
            expect(ret).to.be.equal(true);
            done();
        }, bootstrap.defaultContext);
    });
});