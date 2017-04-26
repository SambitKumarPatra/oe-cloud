/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
//This File contains tests related to Base Users
var chai = require('chai');
var expect = chai.expect;
var chalk = require('chalk');
var app_url = process.env.APP_URL || 'http://localhost:3000/';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var request = require('supertest')(app_url);
//var mongoHost = process.env.MONGO_HOST || 'localhost';
var accessToken;
var invalidUser = {
    'username': 'test',
    'password': 'test',
};
var adminUser = {
    'username': 'adminUser',
    'password': 'adminUser',
    'email': 'testadmin@ev.com',
};

describe(chalk.blue('integration-test-User'), function() {
    this.timeout(60000);

    it('Check invalid User Creation', function(done) {
        var sendData = invalidUser;
        request
            .post('api/BaseUsers')
            .send(sendData)
            .expect(422).end(function(err, resp) {
                done();
            });
    });
    it('Check User Creation', function(done) {
        var sendData = adminUser;
        createdUser = adminUser;
        request
            .post('api/BaseUsers')
            .send(sendData)
            .expect(200).end(function(err, resp) {
                if (err) {
                    done(err);
                } else {
                    userid = resp.body.id;
                    // createdUser = resp.body;
                    done();
                }
            });
    });

    it('Check invalid login', function(done) {
        var postData = {
            'username': invalidUser.username,
            'password': invalidUser.password
        };
        request
            .post('api/BaseUsers/login')
            .send(postData)
            .expect(401).end(function(err, response) {
                accessToken = response.body.id;
                done();
            });
    });
    it('Check login', function(done) {
        var postData = {
            'username': adminUser.username,
            'password': adminUser.password
        };
        request
            .post('api/BaseUsers/login')
            .send(postData)
            .expect(200).end(function(err, response) {
                accessToken = response.body.id;
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
    xit('Check User Updation', function(done) {
        createdUser.email = 'newemail@test.com'
        request
            .put('api/BaseUsers')
            .send(createdUser)
            .end(function(err, resp) {
                if (err) {
                    done(err);
                } else {
                    var updatedUser = resp.body;
                    expect(updatedUser.email).to.equal('newemail@test.com');
                    done();
                }
            });
    });

    it('Check User Deletion', function(done) {
        request
            .delete('api/BaseUsers')
            .send(userid)
            .end(function(err, resp) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
    it('Check invalid User Deletion', function(done) {
        request
            .delete('api/BaseUsers')
            .send(userid)
            .end(function(err, resp) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });
    it('Check invalid logout', function(done) {
        request
            .post('api/BaseUsers/logout')
            .send()
            .expect(500).end(function(err, response) {
                done();
            });
    });
    it('Check logout', function(done) {

        request
            .post('api/BaseUsers/logout?access_token=' + accessToken)
            .send()
            .expect(204).end(function(err, response) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });

    xit('Check password complexity', function(done) {
        request
            .post('api/BaseUsers')
            .send(invalidPwdUser)
            .expect(200).end(function(err, resp) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
    });

});