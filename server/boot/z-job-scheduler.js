/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This file loads file based Job to jobScheduler model, and also schedule job from database on Boot.
 *
 * @memberof Boot Scripts
 * @author Sivankar Jain
 * @name Z Job Scheduler
 */
var schedulerConfigs = require('../job-scheduler-config.json').configs;
var logger = require('../../lib/logger');
var log = logger('z-job-scheduler');
var util = require('../../lib/common/util');

module.exports = function DBModels(app, cb) {
  var jobScheduler = app.models.JobScheduler;

  jobScheduler.find({ where: { enable: true } }, util.bootContext(), function emitJobToSchedule(err, instances) {
    if (err) {
      log.error(util.bootContext(), 'Error :', err);
    } else {
      instances.forEach(function forEachRecordEmitScheduleJobEvent(instance) {
        jobScheduler.emit('scheduleJob', instance, util.bootContext());
      });
    }
  });

  schedulerConfigs.forEach(function forEachConfiguration(config) {
    jobScheduler.create(config, util.bootContext(), function createRecord(err, res) {
      if (err) {
        log.error(util.bootContext(), 'Error :', err);
      } else {
        log.info(util.bootContext(), 'job configuration created', res);
      }
    });
  });

  cb();
};
