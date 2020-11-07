var express = require('express');
var router = express.Router();

const {Client} = require('cassandra-driver');
const appinfo = require('./properties.json');

const client = new Client({
  cloud: { secureConnectBundle: 'secure-connect-hackphs.zip' },
  credentials: { username: app.username, password: app.password }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${appinfo.clientId}`);
});

module.exports = router;
