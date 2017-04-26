/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/* eslint-disable no-console */
module.exports = function Explorer(server) {
  var explorer;
  var explorerPathName = '/explorer';
  try {
    explorer = require('loopback-component-explorer');
  } catch (err) {
    // Print the message only when the app was started via `server.listen()`.
    // Do not print any message when the project is used as a component.
    server.once('started', function explorerServerStarted(baseUrl) {
      console.log(
        'Run `npm install loopback-component-explorer` to enable the LoopBack explorer'
      );
    });
    return;
  }

  var restApiRoot = server.get('restApiRoot');

  var explorerApp = explorer.routes(server, {
    basePath: restApiRoot
  });
  server.use(explorerPathName, explorerApp);
  server.once('started', function explorerServerStarted() {
    var baseUrl = server.get('url').replace(/\/$/, '');
    // express 4.x (loopback 2.x) uses `mountpath`
    // express 3.x (loopback 1.x) uses `route`
    console.log('Browse your REST API at %s%s', baseUrl, explorerPathName);
  });
};
