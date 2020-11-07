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

client.execute('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, token TEXT NOT NULL);');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {});
});

router.get('/login', (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${appinfo.clientId}&scope=read:user%20repo`);
});

router.get('/oauth-callback', (req, res, next) => {
  const body = {
    client_id: appinfo.clientId,
    client_secret: appinfo.clientSecret,
    code: req.query.code
  };
  const opts1 = { headers: { accept: 'application/json' } };
  axios.post(`https://github.com/login/oauth/access_token`, body, opts1).
    then(async res1 => {
      var token = res1.data['access_token'];
      console.log('My token:', token);
      const opts2 = {headers: {authentication: `token ${token}`}};
      var res2 = await axios.get(`https://api.github.com/users/`, opts2)
      client.execute(
        'INSERT INTO users (username, token) VALUES (?, ?);',
        [res2.data['user']['name'], token]
      );
      res.json({ ok: 1 });
    }).
    catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;
