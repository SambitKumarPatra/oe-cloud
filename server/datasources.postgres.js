/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var postgresHost = process.env.POSTGRES_HOST || 'localhost';
// var mongoHost = process.env.MONGO_HOST || 'localhost';
module.exports = {
  'nullsrc': {
    'name': 'nullsrc',
    'connector': 'memory'
  },
  'transient': {
    'name': 'transient',
    'connector': 'transient'
  },
  'db': {
    'host': postgresHost,
    'port': 5432,
    'url': 'postgres://postgres:postgres@' + postgresHost + ':5432/db',
    'database': 'db',
    'password': 'postgres',
    'name': 'db',
    'connector': 'loopback-connector-evpostgresql',
    'user': 'postgres',
    'connectionTimeout': 50000
  },
  'emailDs': {
    'name': 'emailDs',
    'connector': 'mail',
    'transports': [{
      'type': 'smtp',
      'host': 'smtp.gmail.com',
      'port': 587,
      'auth': {
        'user': 'evfoundtest@gmail.com',
        'pass': 'sambit123'
      }
    }]
  },
  'gridfs_db': {
    'name': 'gridfs_db',
    'connector': 'loopback-component-storage',
    'provider': 'filesystem',
    'root': './'
  }
};
