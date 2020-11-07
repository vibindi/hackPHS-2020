const express = require('express');
const router = express.Router();

const axios = require('axios')

const {Client} = require('cassandra-driver');
const appinfo = require('../properties');
const app = require('../app');

const client = new Client({
  cloud: { secureConnectBundle: 'secure-connect-hackphs.zip' },
  credentials: { username: appinfo.username, password: appinfo.password }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/login', function(req, res, next) {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${appinfo.clientId}&scope=read:user%20repo`);
});

router.get('/oauth-callback', function(req, res, next) {
  const body = {
    client_id: appinfo.clientId,
    client_secret: appinfo.clientSecret,
    code: req.query.code
  }
});

module.exports = router;
