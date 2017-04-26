/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This script is used to load data into the database.
 * It iterates through entries in a starting file (meta.json) and loads
 * the data corresponding to each entry synchronously.
 *
 * meta.json includes the context data as well that needs to be applied for each file entry.
 *
 * @memberof Boot Scripts
 * @author Sambit Kumar Patra
 * @name ErrorResponse
 */

var fs = require('fs');
var path = require('path');
// Base directory from where data needs to be loaded
// This folder needs to contain meta.json. See meta.json for format.
// The actual data (records in the form of JSON array) can be present
// either directly in this base directory, or in sub-dirs. The "files.file"
// property in meta.json needs to correspond to the relative path
// inside this base directory.
var dir = path.join(__dirname, '/../../seed/');

module.exports = function ErrorResponse(app, cb) {
  // Read the ErrorDetail.json file
  try {
    var datatext = fs.readFileSync(dir + '/ErrorDetail.json', 'utf-8');
    app.errorDetails = JSON.parse(datatext);
    cb();
  } catch (e) {
    cb();
    return;
  }
};
