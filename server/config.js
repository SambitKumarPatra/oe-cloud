/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

/**
 *
 * NOTE - This is a temporary mechanism to choose between application and evf
 * config files. We will be merging both configurations with application
 * config taking precedence over evf config.
 *
 */
// app config file.
var appconfig = null;
// ev foundation config file.
var config = null;

try {
  appconfig = require('../../../server/config.json');
} catch (e) {
 /* ignored */
}
try {
  config = require('./config.json');
} catch (e) {
/* ignored */
}

if (appconfig) {
  Object.assign(config, appconfig);
}

module.exports = config;

module.exports.gcmServerApiKey = 'AIzaSyCiPcBrRhvBm-lleOAuzXoRM4gyXKAAh1o';
module.exports.appName = 'mBank';
