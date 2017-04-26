/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This is a collection of tests that make sure that the health url (/health) works.
 *
 * @author Ori Press
 */
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var url = '/health';

var chai = require('chai');
chai.use(require('chai-things'));
var api = bootstrap.api;

var debug = require('debug')('logger-config-test');

describe(chalk.blue('health-url-test'), function () {
    it('get a response from the server', function (done) {
        api
            .set('Accept', 'application/json')
            .get(url)
            .end(function (err, res) {
                debug('response body : ' + JSON.stringify(res.body, null, 4));
                if (err || res.body.error) {
                    done(err || (new Error(res.body.error)));
                } else {
                    if (res.status === 500) {
                        console.log("Checked health an got a 500 error code.");
                    }
                    done();
                }
            });
    });
});
