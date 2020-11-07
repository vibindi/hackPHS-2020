var express = require('express');
var router = express.Router();

const {Client} = require('cassandra-driver');
const appinfo = require('../properties');

const client = new Client({
  cloud: { secureConnectBundle: 'secure-connect-hackphs.zip' },
  credentials: { username: appinfo.username, password: appinfo.password }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
