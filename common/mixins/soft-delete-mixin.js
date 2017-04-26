/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This mixin is to provide support for soft delete for a given model.<br>
 *
 * This mixin add a new property _isDeleted to the model and overrides
 * destroyedById and DestroyAll method to update records and set per filter and
 * set _isDelete to true. By default _isDeleted is set to false.<br>
 *
 * It also set an access observer hook to alter the query, it add filter
 * _isDelete = false so only records with _isDeleted : false are return.
 *
 * @mixin Soft Delete
 * @author Sivankar Jain
 */

var mergeQuery = require('loopback-datasource-juggler/lib/utils').mergeQuery;

module.exports = function SoftDeleteMixin(Model) {
  if (Model.modelName === 'BaseEntity') {
    return;
  }

  Model.settings._softDelete = true;

  Model.defineProperty('_isDeleted', {
    type: 'boolean',
    default: false
  });

  Model.evObserve('access', addSoftDeleteFilter);
};

/**
 * Adds an access observer hook to add query filter _isDelete: false, so only
 * records with _isDeleted : false are return.
 *
 * @param {object}
 *                ctx - ctx object, which is populated by DAO.
 * @param {function}
 *                next - move to the next function in the queue
 * @returns {function} next - move to the next function in the queue
 * @memberof Soft Delete
 */
function addSoftDeleteFilter(ctx, next) {
  if (!ctx.Model.settings._softDelete) {
    return next();
  }
  ctx.query = ctx.query || {};
  if (ctx.query.fetchDeleted) {
    mergeQuery(ctx.query, {
      where: {
        _isDeleted: true
      }
    });
  } else {
    mergeQuery(ctx.query, {
      where: {
        _isDeleted: false
      }
    });
  }
  next();
}
