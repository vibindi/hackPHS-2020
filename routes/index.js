const express = require('express');
const router = express.Router();

const axios = require('axios')

const appinfo = require('../properties');
const connectdb = require('../database');
const app = require('../app');

const client = connectdb();

async function testdb() {
  var e = await client.execute("SELECT * FROM users;");
  console.log(e);
}

testdb();

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

      console.log("\n\n**********")
      console.log('My token:', token);
      console.log("**********\n\n")

      const opts2 = {headers: {authorization: `token ${token}`}};
      var res2 = await axios.get(`https://api.github.com/user`, opts2)

      console.log("\n\n**********")
      console.log('res2:', res2.data);
      console.log("**********\n\n")

      await client.execute(
        'INSERT INTO users (username, githubtoken) VALUES (?, ?);',
        [res2.data['login'], token]
      ).then(res => {console.log("\n\nInserted items\n\n");}).catch(res => console.log(res));
      
      res.json({ ok: 1 });
    }).
    catch(err => res.status(500).json({ message: err.message }));

});

module.exports = router;
