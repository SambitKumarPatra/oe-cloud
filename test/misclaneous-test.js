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

describe(chalk.blue('misclaneous-test'), function() {
	this.timeout(10000);

    var accessToken = '';

    before('prepare test data', function(done) {
        var postData = {
            'username': 'admin',
            'password': 'admin'
        };

        var postUrl = baseUrl + '/BaseUsers/login';

        // without jwt token
        var api = defaults(supertest(bootstrap.app));
        api.set('Accept', 'application/json')
        .set('tenant_id', 'default')
        .post(postUrl)
        .send(postData)
        .expect(200).end(function(err, response) {
            
            accessToken = response.body.id;
            done();
        });
    });

    it('switch tenant', function(done) {
        var data = {
            tenantId: 'new-tenant'
        };
        var api = defaults(supertest(bootstrap.app));
        var postUrl = baseUrl + '/BaseUsers/switch-tenant?access_token='  + accessToken;
        api.set('Accept', 'application/json')
        .post(postUrl)
        .send(data)
        .expect(200)
        .end(function(err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.body).not.to.be.undefined;
                expect(result.body.tenantId).to.be.equal('new-tenant');
                done();
            }
        });
    });

	
    it('getinfo', function(done) {
        var api = defaults(supertest(bootstrap.app));
        var url = baseUrl + '/dev/getinfo?access_token='  + accessToken;
        api.get(url)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.body).not.to.be.undefined;
                expect(result.body.callContext).not.to.be.undefined;
                done();
            }
        });
    });
   
    it('checkACL', function(done) {
        var api = defaults(supertest(bootstrap.app));
        var url = baseUrl + '/dev/checkACL/Literal/create?access_token='  + accessToken;
        api.get(url)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.body).not.to.be.undefined;
                done();
            }
        });
    });
});
