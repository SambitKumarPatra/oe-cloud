/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
* This test is for the xmodelvalidate cross-model reference check validation.
* The current test creates two models - Invitee and Guest.
* The premise is that without any relations between these models,
* one should be able to declare a reference from Guest to Invitee.
* This is done by declaring the Guest.guestName to be "xmodelvalidate"d 
* against Invitee.inviteeName. A few Invitees are added and a couple of 
* Guests are created, one is in the Invitee list and one is not.
* The xmodelvalidate is expected to catch the uninvited Guest :)
*
* @author Ajith Vasudevan
*
*/


var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var expect = bootstrap.chai.expect;
var loopback = require('loopback');
var models = bootstrap.models;
var chai = require('chai');
chai.use(require('chai-things'));


describe(chalk.blue('X-Model-Validation test'), function () {
    this.timeout(20000);

    before('setup test data', function (done) {
        models.ModelDefinition.events.once('model-' + 'Guest' + '-available', function () {
            var referredModel = loopback.getModel('Invitee');

            // Invitees
            var data = [{ 'inviteeName': 'Ajith' },
                        { 'inviteeName': 'Rama' },
                        { 'inviteeName': 'Anirudh' }];

            referredModel.create(data, bootstrap.defaultContext, function (err, results) {
                expect(err).to.be.null;
                done();
            });
        });

        // Create the Invitee Model
        models.ModelDefinition.create({
                    'name': 'Invitee',
                    'base': 'BaseEntity',
                    'properties': {
                        'inviteeName': 'string'
                    }
        }, bootstrap.defaultContext, function (err, model) {
            if (err) {
                console.log(err);
            } else {

                // Create the Guest model if Invitee creation is successful
                models.ModelDefinition.create({
                        'name': 'Guest',
                        'base': 'BaseEntity',
                        'properties': {
                            'guestName': {
                                'type': 'string',
                                'xmodelvalidate': { 'model': 'Invitee' , 'field': 'inviteeName' }
                            }
                        }
                    }, bootstrap.defaultContext, function (err, model) {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.not.ok;
                });
            }
            expect(err).to.be.not.ok;
        });
    });
 
    it('X-Model-Validation Test - Should succeed', function (done) {

        var mainModel = loopback.getModel('Guest');
        var data = [{ 'guestName': 'Ajith' }, { 'guestName': 'Mohan' }];
        mainModel.create(data, bootstrap.defaultContext, function (err, results) {
            expect(err[0]).to.be.undefined;
            expect(err[1]).not.to.be.undefined;
            done();
        });

    });


});
