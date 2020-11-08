var express = require('express');
var router = express.Router();

const axios = require('axios');

const app = require('../app');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const client = req.app.locals.client;

  if (!req.session.username) {
    console.log("\n\n\n\nUsername not found\n\n\n\n");
    res.redirect('/login');
  }
  else {
    
    try {
      // result and resdata have github info
      var result = (await client.execute('SELECT * FROM users WHERE username=?', [req.session.username])).first();
      const opts = {headers: {authorization: `token ${result['githubtoken']}`}}
      var resdata = (await axios.get(`https://api.github.com/user/repos`, opts)).data;
    } catch (err) {
      console.log("\n\n**ERROR HERE**\n\n")
      console.log(err);
    }

    res.render('users');
  }
});

module.exports = router;
