/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/** This is a warpper for parsing expressions
 *  to get the abstract syntax tree(AST) and creating
 *  javascript code from the AST.
 *
 *  @module Expression Language
 *  @author Pragyan Das
 */
var parser = require('./expression-syntax-parser');
var q = require('q');
require('./expression-ast-parser')(parser.Parser.prototype);
var logger = require('../logger');
var log = logger('expression-language');

/**
 * Parses expression and resolves the promise
 * on successful execution of the generated
 * javascript code.
 * @param  {string} source - source
 * @return {Promise} -  deferred.promise
 */
function createAST(source) {
  return parser.parse(source);
}

function traverseAST(ast, instance, options) {
  var deferred = q.defer();
  ast.build('', ' ', instance, options).then(function traverseBuildAstSuccessCb(result) {
    deferred.resolve(result);
  }, function traverseBuildAstFailCb(reason) {
    deferred.reject(reason);
    log.error(options, 'Expression Language - expression parsing failed for reason:"', reason, '"');
  });
  return deferred.promise;
}


module.exports = {
  createAST: createAST,
  traverseAST: traverseAST
};
