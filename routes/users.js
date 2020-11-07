var express = require('express');
var router = express.Router();

const {Client} = require('cassandra-driver');
const databaseinfo = require('./properties.json');

const client = new Client({
  cloud: { secureConnectBundle: 'secure-connect-hackphs.zip' },
  credentials: { username: databaseinfo.username, password: databaseinfo.password }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
