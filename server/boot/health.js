/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var logger = require('../../lib/logger');
var log = logger('health');
var DataSource = require('loopback-datasource-juggler').DataSource;
var dataSources = require('./../datasources.json');
var finished;
var cacheDataSources = (function single() {
  var dataSourcesArray;

  function init() {
    var instancesArray = {};
    for (var key in dataSources) {
      if (dataSources.hasOwnProperty(key)) {
        instancesArray[key] = new DataSource(dataSources[key]);
      }
    }
    return instancesArray;
  }

  return {
    getInstance: function getInstanceFn() {
      if (!dataSourcesArray) {
        dataSourcesArray = init();
      }
      return dataSourcesArray;
    }
  };
})();

module.exports = function healthCheck(server) {
  server.get('/health', function serverGet(req, res) {
    var dataSource;
    finished = 0;
    var dataSourcesArray = cacheDataSources.getInstance();
    for (var key in dataSourcesArray) {
      if (dataSourcesArray.hasOwnProperty(key)) {
        dataSource = dataSourcesArray[key];
        if (dataSource && dataSource.connector && dataSource.ping) {
          var callback = getCallback(key, res);
          dataSource.ping(callback);
        } else {
          log.warn(log.defaultContext(), 'Health can\'t be checked for datasource because the connector doesn\'t have ping ', key);
        }
      }
    }
  });
};

function getCallback(currentKey, res) {
  return function getCallBackFn() {
    if (arguments[0]) {
      res.status(500);
      res.end('The db ' + currentKey + ' had an error: ' + arguments[0]);
    }
    finished++;
    if (finished === Object.keys(dataSources).length - 1) {
      res.end('All the datasources are up.');
    }
  };
}
