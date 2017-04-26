/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chai = require('chai');
var expect = chai.expect;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var mongoHost = process.env.MONGO_HOST || 'localhost';

describe('ZZ Final Cleanup', function() {
	this.timeout(120000);

    before('Delete collections', function(done) {
		var db = new Db('db', new Server(mongoHost, 27017));
		db.open(function(err, db) {
			if (err) {
				console.log(err);
			}
			db.dropDatabase();
			var db1 = new Db('db1', new Server(mongoHost, 27017));
			db1.open(function(err, db1) {
				if (err) {
					console.log(err);
				}
				db1.dropDatabase();
				var db2 = new Db('db2', new Server(mongoHost, 27017));
				db2.open(function(err, db2) {
					if (err) {
						console.log(err);
					}
					db2.dropDatabase();
					done();
				});
			});
		});
    });

    it('Should delete collections', function(done) {
		expect(1).to.be.equal(1);
		done();
    });
});