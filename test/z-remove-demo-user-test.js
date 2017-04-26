/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
// var app = bootstrap.app;
var chai = require('chai');
chai.use(require('chai-things'));
// var loopback = require('loopback');
var models = bootstrap.models;

// Test case to remove demo user which was used for testing and logging in using JWT.
describe(chalk.blue('Remove Demo User'), function () {
  after('Remove Demo user', function (done) {
    models.BaseUser.destroyById('30', bootstrap.defaultContext, function (err, res) {
      if (err) {
        done(err);
      }
      done();
    });
  });
});
