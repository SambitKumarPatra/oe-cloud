/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

/**
 * This function injects proxy call in case a remote methode is proxy enabled
 *
 * @memberof Boot Scripts
 * @author Dipayan Aich
 * @name InjectProxyCall
 */

function getActiveRemoteMethods(model) {
  const activeRemoteMethods =
    model.sharedClass
      .methods({
        includeDisabled: false
      })
      .filter(value => {
        return model.settings.proxyMethods && model.settings.proxyMethods.some(v => v.name === value.name);
      }).map(ret => {
        return {
          name: ret.name,
          isStatic: ret.isStatic
        };
      });

  return activeRemoteMethods;
}

module.exports = function fnInjectProxyCall(app, cb) {
  var fn = function fnInjectProxyCallFn(X, methodName) {
    return function fnInjectProxyCallCbFn(...args) {
      var model = typeof (this) === 'function' ? this : Object.getPrototypeOf(this).constructor;
      if (typeof (this) === 'function' && model.invokeProxyIfRemote(methodName, ...args)) {
        return cb.promise;
      } else if (model.invokeProxyIfRemote.call(this, methodName, ...args)) {
        return cb.promise;
      }
      X.call(this, ...args);
    };
  };

  Object.keys(app.models).forEach((modelName) => {
    const model = app.models[modelName];
    var proxyMethods = getActiveRemoteMethods(model);

    proxyMethods.forEach(method => {
      if (!method.isStatic) {
        model.prototype[method.name] = fn(model.prototype[method.name], 'prototype.' + method.name);
      } else {
        model[method.name] = fn(model[method.name], method.name);
      }
    });
  });

  cb();
};
