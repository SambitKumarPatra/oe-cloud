/**
 * 
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 */
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));
var supertest = require('supertest');
var app = bootstrap.app;
var api = supertest(app);
var apiV2 = bootstrap.api;
var models = bootstrap.models;
var logger = require('../lib/logger');
var log = logger('data-personalization-test');
var loopback = require('loopback');
var async = require('async');

describe(chalk.blue('Data Hierarchy Test --Programatic'), function () {
  this.timeout(50000);
  var regionModel = 'Region';
  var regionModelDetails = {
    name: regionModel,
    base: 'BaseEntity',
    properties: {
      'regionName': {
        'type': 'string',
        'required': true
      }
    },
    strict: false,
    idInjection: true,
    plural: regionModel,
    mixins: {
      'HistoryMixin': true,
      'DataHierarchyMixin': true,
      'SoftDeleteMixin': false
    },
    autoscope: [
      'tenantId'
    ],
    'hierarchyScope': ['regionHierarchy']
  };

  var productModel = 'Product';
  var productModelDetails = {
    name: productModel,
    base: 'BaseEntity',
    properties: {
      'productName': {
        'type': 'string',
        'required': true
      }
    },
    strict: false,
    idInjection: true,
    plural: productModel,
    mixins: {
      'HistoryMixin': true,
      'DataHierarchyMixin': true,
      'SoftDeleteMixin': false
    },
    autoscope: [
      'tenantId'
    ],
    hierarchyScope: ['regionHierarchy']
  };

  var settingsModel = 'SystemSettings';
  var settingsModelDetails = {
    name: settingsModel,
    base: 'BaseEntity',
    properties: {
      'name': {
        'type': 'string',
        'unique': true
      },
      'value': 'object'
    },
    strict: false,
    idInjection: true,
    plural: settingsModel,
    mixins: {
      'HistoryMixin': true,
      'DataPersonalizationMixin': false,
      'DataHierarchyMixin': true,
      'SoftDeleteMixin': false

    },
    autoscope: [
      'tenantId'
    ],
    hierarchyScope: ['regionHierarchy'],
    upward: true
  };

  before('Create Test models', function (done) {
    models.ModelDefinition.create(regionModelDetails, bootstrap.defaultContext, function (err, res) {
      if (err) {
        log.debug(bootstrap.defaultContext, 'unable to create Region model');
        done(err);
      } else {
        models.ModelDefinition.create(productModelDetails, bootstrap.defaultContext, function (err, res) {
          if (err) {
            log.debug(bootstrap.defaultContext, 'unable to create Product model');
            done(err);
          } else {
            models.ModelDefinition.create(settingsModelDetails, bootstrap.defaultContext, function (err, res) {
              if (err) {
                log.debug(bootstrap.defaultContext, 'unable to create Settings model');
                done(err);
              } else {
                done();
              }
            });
          }
        });
      }
    });
  });

  after('Remove Data from Test Models', function (done) {
    var callContext = {};
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser'
    };
    models[regionModel].destroyAll({}, callContext, function (err, result) {
      if (err) {
        done(err);
      }
      models[productModel].destroyAll({}, callContext, function (err, result) {
        if (err) {
          done(err);
        }
        models[settingsModel].destroyAll({}, callContext, function (err, result) {
          if (err) {
            done(err);
          }
          done();
        });
      });
    });
  });

  it('Create region Hierarchy in region model', function (done) {
    var callContext = {};
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser'
    };
    var myModel = models[regionModel];


    async.series([
      function (callback) {
        var testData = {
          'regionName': 'Continents',
          'id': 'root'
        };
        myModel.create(testData, callContext, function (err, result) {
          if (err) {
            callback(err);
          } else {
            expect(result).not.to.be.null;
            expect(result).not.to.be.empty;
            expect(result).not.to.be.undefined;
            expect(result._hierarchyScope.regionHierarchy).to.be.equal(',root,');
            callback();
          }
        });
      },
      function (callback) {
        var testData = {
          'regionName': 'Asia',
          'id': 'asia'
        };
        myModel.create(testData, callContext, function (err, result) {
          if (err) {
            callback(err);
          } else {
            expect(result).not.to.be.null;
            expect(result).not.to.be.empty;
            expect(result).not.to.be.undefined;
            expect(result._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,');
            callback();
          }
        });
      },
      function (callback) {
        var testData = {
          'regionName': 'India',
          'id': 'india',
          'parentId': 'asia'
        };
        myModel.create(testData, callContext, function (err, result) {
          if (err) {
            callback(err);
          } else {
            expect(result).not.to.be.null;
            expect(result).not.to.be.empty;
            expect(result).not.to.be.undefined;
            expect(result._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,');
            callback();
          }
        });
      },
      function (callback) {
        var testData = {
          'regionName': 'Delhi',
          'id': 'delhi',
          'parentId': 'india'
        };
        myModel.create(testData, callContext, function (err, result) {
          if (err) {
            callback(err);
          } else {
            expect(result).not.to.be.null;
            expect(result).not.to.be.empty;
            expect(result).not.to.be.undefined;
            expect(result._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,delhi,');
            callback();
          }
        });
      },
      function (callback) {
        var testData = {
          'regionName': 'Bangalore',
          'id': 'bangalore',
          'parentId': 'india'
        };
        myModel.create(testData, callContext, function (err, result) {
          if (err) {
            callback(err);
          } else {
            expect(result).not.to.be.null;
            expect(result).not.to.be.empty;
            expect(result).not.to.be.undefined;
            expect(result._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,bangalore,');
            callback();
          }
        });
      },
      function (callback) {
        var testData = {
          'regionName': 'Japan',
          'id': 'japan',
          'parentId': 'asia'
        };
        myModel.create(testData, callContext, function (err, result) {
          if (err) {
            callback(err);
          } else {
            expect(result).not.to.be.null;
            expect(result).not.to.be.empty;
            expect(result).not.to.be.undefined;
            expect(result._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,japan,');
            callback();
          }
        });
      },
      function (callback) {
        var testData = {
          'regionName': 'Tokyo',
          'id': 'tokyo',
          'parentId': 'japan'
        };
        myModel.create(testData, callContext, function (err, result) {
          if (err) {
            callback(err);
          } else {
            expect(result).not.to.be.null;
            expect(result).not.to.be.empty;
            expect(result).not.to.be.undefined;
            expect(result._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,japan,tokyo,');
            callback();
          }
        });
      }
    ], function (err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('Create products hierarchy based on region', function (done) {
    var callContext = {};

    var product = models[productModel];

    async.series([
      function (callback) {
        callContext.ctx = {
          'tenantId': 'test-tenant',
          'username': 'testuser',
          'regionHierarchy': ',root,asia,'
        };
        var newProduct = {
          'productName': 'Coca-Cola'
        };
        product.create(newProduct, callContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            // console.log("-------------", res);
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            expect(res.productName).to.be.equal('Coca-Cola');
            expect(res._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,');
            callback();
          }
        });
      },
      function (callback) {
        callContext.ctx = {
          'tenantId': 'test-tenant',
          'username': 'testuser',
          'regionHierarchy': ',root,asia,india,'
        };
        var newProduct = {
          'productName': 'Diet coke'
        };
        product.create(newProduct, callContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            // console.log("-------------", res);
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            expect(res.productName).to.be.equal('Diet coke');
            expect(res._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,');
            callback();
          }
        });
      },
      function (callback) {
        callContext.ctx = {
          'tenantId': 'test-tenant',
          'username': 'testuser',
          'regionHierarchy': ',root,asia,india,delhi,'
        };
        var newProduct = {
          'productName': 'Coke Zero'
        };
        product.create(newProduct, callContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            // console.log("-------------", res);
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            expect(res.productName).to.be.equal('Coke Zero');
            expect(res._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,delhi,');
            callback();
          }
        });
      },
      function (callback) {
        callContext.ctx = {
          'tenantId': 'test-tenant',
          'username': 'testuser',
          'regionHierarchy': ',root,asia,india,'
        };
        var newProduct = {
          'productName': 'Pulpy Orange'
        };
        product.create(newProduct, callContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            // console.log("-------------", res);
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            expect(res.productName).to.be.equal('Pulpy Orange');
            expect(res._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,');
            callback();
          }
        });
      }
    ], function (err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('Get products based on regional context Asia/India', function (done) {
    var callContext = {};
    var product = models[productModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,'
    };

    product.find({}, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(2);
        done();
      }
    });
  });

  it('Get products based on regional context Asia/India/Delhi', function (done) {
    var callContext = {};
    var product = models[productModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,delhi,'
    };

    product.find({}, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0].productName).to.be.equal('Coke Zero');
        done();
      }
    });
  });

  it('Get products based on regional context Asia/India with depth *', function (done) {
    var callContext = {};
    var product = models[productModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,'
    };

    product.find({ 'depth': '*' }, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(3);
        done();
      }
    });
  });

  it('Get products based on regional context Asia/India with depth 1', function (done) {
    var callContext = {};
    var product = models[productModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,'
    };

    product.find({ 'depth': '1' }, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(3);
        done();
      }
    });
  });

  it('Get products based on regional context Asia/India with depth 3(Actual level of hierarchy ends at 1)', function (done) {
    var callContext = {};
    var product = models[productModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,'
    };

    product.find({ 'depth': '3' }, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(3);
        done();
      }
    });
  });

  it('Create SystemSetings based on regionHierarchy', function (done) {
    var callContext = {};

    var settings = models[settingsModel];

    async.series([
      function (callback) {
        callContext.ctx = {
          'tenantId': 'test-tenant',
          'username': 'testuser',
          'regionHierarchy': ',root,asia,india,'
        };
        var newSetting = {
          'name': 'passwordPolicy',
          'value': {
            'maxLength': 8
          }
        };
        settings.create(newSetting, callContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            // console.log("-------------", res);
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            expect(res.name).to.be.equal('passwordPolicy');
            expect(res._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,');
            callback();
          }
        });
      },
      function (callback) {
        callContext.ctx = {
          'tenantId': 'test-tenant',
          'username': 'testuser',
          'regionHierarchy': ',root,asia,india,bangalore,'
        };
        var newSetting = {
          'name': 'passwordPolicy',
          'value': {
            'maxLength': 12
          }
        };
        settings.create(newSetting, callContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            // console.log("-------------", res);
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            expect(res.name).to.be.equal('passwordPolicy');
            expect(res._hierarchyScope.regionHierarchy).to.be.equal(',root,asia,india,bangalore,');
            callback();
          }
        });
      }
    ], function (err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('Get settings based on regional context Asia/India with upward true on model', function (done) {
    var callContext = {};
    var settings = models[settingsModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,'
    };

    settings.find({}, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0].value.maxLength).to.be.equal(8);
        done();
      }
    });
  });

  it('Get settings based on regional context Asia/India/Bangalore with upward true on model without depth', function (done) {
    var callContext = {};
    var settings = models[settingsModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,bangalore,'
    };

    settings.find({}, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0].value.maxLength).to.be.equal(12);
        done();
      }
    });
  });

  it('Get settings based on regional context Asia/India/Bangalore with upward true on model with depth 1', function (done) {
    var callContext = {};
    var settings = models[settingsModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,bangalore,'
    };

    settings.find({ 'depth': '1' }, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0].value.maxLength).to.be.equal(12);
        done();
      }
    });
  });

  it('Get settings based on regional context Asia/India/Delhi with upward true on model(Test for fallback)', function (done) {
    var callContext = {};
    var settings = models[settingsModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,delhi,'
    };

    settings.find({}, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(0);
        done();
      }
    });
  });

  it('Get settings based on regional context Asia/India/Delhi with upward true on model with depth(Test for fallback)', function (done) {
    var callContext = {};
    var settings = models[settingsModel];
    callContext.ctx = {
      'tenantId': 'test-tenant',
      'username': 'testuser',
      'regionHierarchy': ',root,asia,india,delhi,'
    };

    settings.find({ 'depth': 1 }, callContext, function (err, res) {
      if (err) {
        done(err);
      } else {
        // console.log("==============", res);
        expect(res).not.to.be.null;
        expect(res).not.to.be.empty;
        expect(res).not.to.be.undefined;
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0].value.maxLength).to.be.equal(8);
        done();
      }
    });
  });
});
// END of Describe


describe(chalk.blue('Data Hierarchy Test --REST'), function () {
  var regionModel = 'Region';
  var productModel = 'Product';
  var settingsModel = 'SystemSettings';
  this.timeout(50000);
  var asiaUserAccessToken;
  var indiaUserAccessToken;
  var delhiUserAccessToken;
  var bangaloreUserAccessToken;

  before('Create Test models and users', function (done) {
    var atModel = loopback.getModelByType('AccessToken');
    var user = loopback.getModelByType('BaseUser');

    user.defineProperty('region', {
      type: 'string'
    });

    atModel.defineProperty('regionHierarchy', {
      type: 'string'
    });


    atModel.observe('before save', function (ctx, next) {
      var data = ctx.data || ctx.instance;
      var userid = data.userId;
      user.find({ 'where': { 'id': userid } }, bootstrap.defaultContext, function (err, instance) {
        if (err) {
          next(err);
        } else if (instance.length) {
          // console.log("========================= instance", instance);
          models[regionModel].findOne({ where: { regionName: instance[0].region } }, bootstrap.defaultContext, function (err, res) {
            if (err) {
              next(err);
            } else if (res) {
              // console.log("========================== res", res);
              data.__data.regionHierarchy = res._hierarchyScope.regionHierarchy;
              // console.log("*********************", ctx.instance);
              next();
            } else {
              next();
            }
          });
        } else {
          next();
        }
      });
    });


    async.series([
      function (callback) {
        // var aSession = loopback.getModelByType('AuthSession');
        // aSession.defineProperty('_hierarchyScope', {
        //     type: 'string'
        // });
        user.dataSource.autoupdate(['BaseUser', 'AuthSession'], function fnDSAutoUpdate(err) {
          if (err) callback(err);
          callback();
        });
      },
      function (callback) {
        var userDetails = {
          'username': 'AsiaUser',
          'password': 'AsiaUser@1',
          'email': 'AsiaUser@evf.com',
          'region': 'Asia'
        };
        user.create(userDetails, bootstrap.defaultContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            callback();
          }
        });
      }, function (callback) {
        var userDetails = {
          'username': 'Indiauser',
          'password': 'IndiaUser@1',
          'email': 'IndiaUser@evf.com',
          'region': 'India'
        };
        user.create(userDetails, bootstrap.defaultContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            callback();
          }
        });
      }, function (callback) {
        var userDetails = {
          'username': 'DelhiUser',
          'password': 'DelhiUser@1',
          'email': 'DelhiUser@evf.com',
          'region': 'Delhi'
        };
        user.create(userDetails, bootstrap.defaultContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            callback();
          }
        });
      }, function (callback) {
        var userDetails = {
          'username': 'BangaloreUser',
          'password': 'BangaloreUser@1',
          'email': 'BangaloreUser@evf.com',
          'region': 'Bangalore'
        };
        user.create(userDetails, bootstrap.defaultContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            callback();
          }
        });
      }, function (callback) {
        var userDetails = {
          'username': 'JapanUser',
          'password': 'JapanUser@1',
          'email': 'JapanUser@evf.com',
          'region': 'Japan'
        };
        user.create(userDetails, bootstrap.defaultContext, function (err, res) {
          if (err) {
            callback(err);
          } else {
            expect(res).not.to.be.null;
            expect(res).not.to.be.empty;
            expect(res).not.to.be.undefined;
            callback();
          }
        });
      }],
      function (err) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  after('Remove Data from Test Models', function (done) {
    var atModel = loopback.getModelByType('AccessToken');
    models[regionModel].destroyAll({}, bootstrap.defaultContext, function (err, result) {
      if (err) {
        done(err);
      }
      models[productModel].destroyAll({}, bootstrap.defaultContext, function (err, result) {
        atModel.removeObserver('before save');
        if (err) {
          done(err);
        }
        done();
      });
    });
  });

  it('Create region Hierarchy in region model', function (done) {
    this.timeout(60000);
    var url = bootstrap.basePath + '/' + regionModel;
    async.series([
      function (callback) {
        var testData = {
          'regionName': 'Continents',
          'id': 'root'
        };
        apiV2
          .post(url)
          .send(testData)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200).end(function (err, result) {
            if (err) {
              callback(err);
            } else {
              // console.log("------------", result.body);
              expect(result.body).not.to.be.null;
              expect(result.body).not.to.be.empty;
              expect(result.body).not.to.be.undefined;
              expect(result.body.id).to.be.equal('root');
              callback();
            }
          });
      },
      function (callback) {
        var testData = {
          'regionName': 'Asia',
          'id': 'asia'
        };
        apiV2.post(url)
          .send(testData)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200).end(function (err, result) {
            if (err) {
              callback(err);
            } else {
              expect(result.body).not.to.be.null;
              expect(result.body).not.to.be.empty;
              expect(result.body).not.to.be.undefined;
              expect(result.body.id).to.be.equal('asia');
              callback();
            }
          });
      },
      function (callback) {
        var testData = {
          'regionName': 'India',
          'id': 'india',
          'parentId': 'asia'
        };
        apiV2.post(url)
          .send(testData)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200).end(function (err, result) {
            if (err) {
              callback(err);
            } else {
              expect(result.body).not.to.be.null;
              expect(result.body).not.to.be.empty;
              expect(result.body).not.to.be.undefined;
              expect(result.body.id).to.be.equal('india');
              callback();
            }
          });
      },
      function (callback) {
        var testData = {
          'regionName': 'Delhi',
          'id': 'delhi',
          'parentId': 'india'
        };
        apiV2.post(url)
          .send(testData)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200).end(function (err, result) {
            if (err) {
              callback(err);
            } else {
              expect(result.body).not.to.be.null;
              expect(result.body).not.to.be.empty;
              expect(result.body).not.to.be.undefined;
              expect(result.body.id).to.be.equal('delhi');
              callback();
            }
          });
      },
      function (callback) {
        var testData = {
          'regionName': 'Bangalore',
          'id': 'bangalore',
          'parentId': 'india'
        };
        apiV2.post(url)
          .send(testData)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200).end(function (err, result) {
            if (err) {
              callback(err);
            } else {
              expect(result.body).not.to.be.null;
              expect(result.body).not.to.be.empty;
              expect(result.body).not.to.be.undefined;
              expect(result.body.id).to.be.equal('bangalore');
              callback();
            }
          });
      },
      function (callback) {
        var testData = {
          'regionName': 'Japan',
          'id': 'japan',
          'parentId': 'asia'
        };
        apiV2.post(url)
          .send(testData)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200).end(function (err, result) {
            if (err) {
              callback(err);
            } else {
              expect(result.body).not.to.be.null;
              expect(result.body).not.to.be.empty;
              expect(result.body).not.to.be.undefined;
              expect(result.body.id).to.be.equal('japan');
              callback();
            }
          });
      },
      function (callback) {
        var testData = {
          'regionName': 'Tokyo',
          'id': 'tokyo',
          'parentId': 'japan'
        };
        apiV2.post(url)
          .send(testData)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200).end(function (err, result) {
            if (err) {
              callback(err);
            } else {
              expect(result.body).not.to.be.null;
              expect(result.body).not.to.be.empty;
              expect(result.body).not.to.be.undefined;
              expect(result.body.id).to.be.equal('tokyo');
              callback();
            }
          });
      }
    ], function (err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('Create products hierarchy based on region', function (done) {
    this.timeout(6000000);
    var url = bootstrap.basePath + '/' + productModel;
    async.series([
      function (callback) {
        var userDetails = {
          'password': 'AsiaUser@1',
          'email': 'AsiaUser@evf.com'
        };
        var newProduct = {
          'productName': 'Coca-Cola'
        };
        bootstrap.login(userDetails, function (token) {
          asiaUserAccessToken = token;
          var newUrl = url + '?access_token=' + asiaUserAccessToken;
          api
            .post(newUrl)
            .send(newProduct)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function (err, res) {
              if (err) {
                callback(err);
              } else {
                // console.log("-------------", res.body);
                expect(res.body).not.to.be.null;
                expect(res.body).not.to.be.empty;
                expect(res.body).not.to.be.undefined;
                expect(res.body.productName).to.be.equal('Coca-Cola');
                callback();
              }
            });
        });
      },
      function (callback) {
        var userDetails = {
          'password': 'IndiaUser@1',
          'email': 'IndiaUser@evf.com'
        };
        var newProduct = {
          'productName': 'Diet coke'
        };
        bootstrap.login(userDetails, function (token) {
          indiaUserAccessToken = token;
          var newUrl = url + '?access_token=' + indiaUserAccessToken;

          api
            .post(newUrl)
            .send(newProduct)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function (err, res) {
              if (err) {
                callback(err);
              } else {
                // console.log("-------------", res.body);
                expect(res.body).not.to.be.null;
                expect(res.body).not.to.be.empty;
                expect(res.body).not.to.be.undefined;
                expect(res.body.productName).to.be.equal('Diet coke');
                callback();
              }
            });
        });
      },
      function (callback) {
        var userDetails = {
          'password': 'DelhiUser@1',
          'email': 'DelhiUser@evf.com'
        };
        var newProduct = {
          'productName': 'Coke Zero'
        };
        bootstrap.login(userDetails, function (token) {
          delhiUserAccessToken = token;
          var newUrl = url + '?access_token=' + delhiUserAccessToken;
          api
            .post(newUrl)
            .send(newProduct)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function (err, res) {
              if (err) {
                callback(err);
              } else {
                // console.log("-------------", res.body);
                expect(res.body).not.to.be.null;
                expect(res.body).not.to.be.empty;
                expect(res.body).not.to.be.undefined;
                expect(res.body.productName).to.be.equal('Coke Zero');
                callback();
              }
            });
        });
      },
      function (callback) {
        var newProduct = {
          'productName': 'Pulpy Orange'
        };
        var newUrl = url + '?access_token=' + indiaUserAccessToken;
        api
          .post(newUrl)
          .send(newProduct)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .end(function (err, res) {
            if (err) {
              callback(err);
            } else {
              // console.log("-------------", res.body);
              expect(res.body).not.to.be.null;
              expect(res.body).not.to.be.empty;
              expect(res.body).not.to.be.undefined;
              expect(res.body.productName).to.be.equal('Pulpy Orange');
              callback();
            }
          });
      }
    ], function (err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('Get products based on regional context Asia/India', function (done) {
    var url = bootstrap.basePath + '/' + productModel + '?access_token=' + indiaUserAccessToken;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(2);
          done();
        }
      });
  });

  it('Get products based on regional context Asia/India/Delhi', function (done) {
    var url = bootstrap.basePath + '/' + productModel + '?access_token=' + delhiUserAccessToken;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          expect(res.body[0].productName).to.be.equal('Coke Zero');
          done();
        }
      });
  });

  it('Get products based on regional context Asia/India with depth *', function (done) {
    var filter = 'filter={"depth":"*"}';
    var url = bootstrap.basePath + '/' + productModel + '?access_token=' + indiaUserAccessToken + '&' + filter;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(3);
          done();
        }
      });
  });

  it('Get products based on regional context Asia/India with depth 1', function (done) {
    var filter = 'filter={"depth":"1"}';
    var url = bootstrap.basePath + '/' + productModel + '?access_token=' + indiaUserAccessToken + '&' + filter;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(3);
          done();
        }
      });
  });

  it('Get products based on regional context Asia/India with depth 3(Actual level of hierarchy ends at 1)', function (done) {
    var filter = 'filter={"depth":"3"}';
    var url = bootstrap.basePath + '/' + productModel + '?access_token=' + indiaUserAccessToken + '&' + filter;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(3);
          done();
        }
      });
  });

  it('Create SystemSetings based on regionHierarchy', function (done) {
    this.timeout(6000);
    var url = bootstrap.basePath + '/' + settingsModel;

    async.series([
      function (callback) {
        var newSetting = {
          'name': 'passwordPolicy',
          'value': {
            'maxLength': 8
          }
        };
        var newUrl = url + '?access_token=' + indiaUserAccessToken;
        api
          .post(newUrl)
          .send(newSetting)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .end(function (err, res) {
            if (err) {
              callback(err);
            } else {
              // console.log("-------------", res.body);
              expect(res.body).not.to.be.null;
              expect(res.body).not.to.be.empty;
              expect(res.body).not.to.be.undefined;
              expect(res.body.name).to.be.equal('passwordPolicy');
              callback();
            }
          });
      },
      function (callback) {
        var newSetting = {
          'name': 'passwordPolicy',
          'value': {
            'maxLength': 12
          }
        };
        var userDetails = {
          'password': 'BangaloreUser@1',
          'email': 'BangaloreUser@evf.com'
        };
        bootstrap.login(userDetails, function (token) {
          bangaloreUserAccessToken = token;
          var newUrl = url + '?access_token=' + bangaloreUserAccessToken;
          api
            .post(newUrl)
            .send(newSetting)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function (err, res) {
              if (err) {
                callback(err);
              } else {
                // console.log("-------------", res.body);
                expect(res.body).not.to.be.null;
                expect(res.body).not.to.be.empty;
                expect(res.body).not.to.be.undefined;
                expect(res.body.name).to.be.equal('passwordPolicy');
                callback();
              }
            });
        });
      }
    ], function (err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('Get settings based on regional context Asia/India with upward true on model', function (done) {
    var url = bootstrap.basePath + '/' + settingsModel + '?access_token=' + indiaUserAccessToken;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          expect(res.body[0].value.maxLength).to.be.equal(8);
          done();
        }
      });
  });

  it('Get settings based on regional context Asia/India/Bangalore with upward true on model without depth', function (done) {
    var url = bootstrap.basePath + '/' + settingsModel + '?access_token=' + bangaloreUserAccessToken;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          expect(res.body[0].value.maxLength).to.be.equal(12);
          done();
        }
      });
  });

  it('Get settings based on regional context Asia/India/Bangalore with upward true on model with depth 1', function (done) {
    var filter = 'filter={"depth":1}';
    var url = bootstrap.basePath + '/' + settingsModel + '?access_token=' + bangaloreUserAccessToken + '&' + filter;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          expect(res.body[0].value.maxLength).to.be.equal(12);
          done();
        }
      });
  });

  it('Get settings based on regional context Asia/India/Delhi with upward true on model(Test for fallback)', function (done) {
    var url = bootstrap.basePath + '/' + settingsModel + '?access_token=' + delhiUserAccessToken;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(0);
          done();
        }
      });
  });

  it('Get settings based on regional context Asia/India/Delhi with upward true on model with depth(Test for fallback)', function (done) {
    var filter = 'filter={"depth":1}';
    var url = bootstrap.basePath + '/' + settingsModel + '?access_token=' + delhiUserAccessToken + '&' + filter;
    api
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          // console.log("==============", res.body);
          expect(res.body).not.to.be.null;
          expect(res.body).not.to.be.empty;
          expect(res.body).not.to.be.undefined;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          expect(res.body[0].value.maxLength).to.be.equal(8);
          done();
        }
      });
  });
});
// END of Describe
