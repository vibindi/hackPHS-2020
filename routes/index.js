const express = require('express');
const router = express.Router();

const axios = require('axios');
const session = require('express-session');

const appinfo = require('../properties');
const app = require('../app');

// Home page
router.get('/', async (req, res, next) => {
  if (!req.session.username) res.render('index', {authorised: false});
  else res.render('index', {authorised: true, username: req.session.username});
});

// Login (authentication)
router.get('/login', (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${appinfo.clientId}&scope=read:user%20repo`);
});

// Authentication callback
router.get('/oauth-callback', (req, res, next) => {
  const client = req.app.locals.client;

  const body = {
    client_id: appinfo.clientId,
    client_secret: appinfo.clientSecret,
    code: req.query.code
  };
  const opts1 = { headers: { accept: 'application/json' } };

  axios.post(`https://github.com/login/oauth/access_token`, body, opts1).
    then(async res1 => {
      var token = res1.data.access_token;

      const opts2 = {headers: {authorization: `token ${token}`}};
      var resdata = (await axios.get(`https://api.github.com/user`, opts2)).data;

      await client.execute(
        'INSERT INTO users (username, name, email, githubtoken) VALUES (?, ?, ?, ?);',
        [resdata.login, resdata.name, resdata.email, token]
      ).
        then(res => {console.log("\n\nInserted items\n\n");}).
        catch(res => console.log(res));
      
      req.session.username = resdata.login;
      
      res.redirect('/users/');
    }).
    catch(err => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
