/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
* @classdesc This Model provides the functionality to upload any file.
* Additionally User can also Delete and View the uploaded files.
*
* @kind class
* @class Document
* @author Sambit Kumar Patra
*/

var config = require('../../../server/config.js');

module.exports = function DocumentFn(Document) {
  /**
* This 'before remote' hook is used to intercept data
* POSTed to Document model, validate the file extension
* and pass the maximum allowed file size in limits object
* @param {object} ctx - context object
* @param {object }modelInstance - data posted
* @param {function} next - next middleware function
* @function fileUploadBeforeRemoteFn
*/
  Document.beforeRemote('upload', function fileUploadBeforeRemoteFn(ctx, modelInstance, next) {
    var limits = { fileSize: config.maxFileSize ? config.maxFileSize * 1024 : null };
    ctx.req.limits = limits;
    ctx.req.supportedFileExtns = config.supportedFileExtns && config.supportedFileExtns.length > 0 ? config.supportedFileExtns : null;
    ctx.req.fileNamePattern = config.fileNamePattern ? config.fileNamePattern : null;
    next();
  });
};
