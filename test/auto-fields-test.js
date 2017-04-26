/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * UnitTest Cases for Auto Fields
 *
 * @author Ajith Vasudevan
 */

var bootstrap = require('./bootstrap');
var expect = bootstrap.chai.expect;
var loopback = require('loopback');
var models = bootstrap.models;
var chai = require('chai');
chai.use(require('chai-things'));


describe('Auto Fields Test', function () {

    this.timeout(30000);

    var model = null;
    var modelId = null;

    before('create models', function (done) {
        models.ModelDefinition.create({
            name: 'AutoFieldTestModel',
            base: 'BaseEntity',
            plural: 'AutoFieldTestModels',
            properties: {
                'user': {
                    'type': 'string',
                    'setval': "CALLCONTEXT.ctx.remoteUser"
                },
                'ctxObj': {
                    'type': 'object',
                    'setval': "CTX"
                }
            }
        }, bootstrap.defaultContext, function (err, afModel) {
            if (err) {
                done(err);
            } else {
                expect(err).to.be.null;
                modelId = afModel.id;
                done();
            }
        });
    });

    after('cleanup', function (done) {
        models.ModelDefinition.destroyAll({"id": modelId}, bootstrap.defaultContext, function(err, data) {
            done();
        });
    });


    it('should create a model instance with auto-populated values', function (done) {
        model = loopback.findModel('AutoFieldTestModel');
        expect(model).not.to.be.null;
        expect(model).not.to.be.undefined;
        model.create({}, bootstrap.defaultContext, function(err, data) {
            expect(err).to.be.null;
            expect(data).not.to.be.null;
            expect(data.user).not.to.be.null;
            expect(data.ctxObj).not.to.be.null;
            expect(data.user).to.equal('test-user');
            done();
        });
    });
});