var express = require('express');
var router = express.Router();

const axios = require('axios');

const app = require('../app');

router.get('/', async function(req, res, next) {
  const client = req.app.locals.client;

  if (!req.session.username) {
    console.log("\n\n\n\nUsername not found\n\n\n\n");
    res.redirect('/login');
  }
  else {
    res.render('users');
  }
});

router.all('/profile', async function(req, res, next) {
  const client = req.app.locals.client;

  if (!req.session.username) {
    console.log("\n\n\n\nUsername not found\n\n\n\n");
    res.redirect('/login');
  }
  else {
    
    // result and resdata have github info
    var result = (await client.execute('SELECT * FROM users WHERE username=?', [req.session.username])).first();
    const opts = {headers: {authorization: `token ${result['githubtoken']}`}}
    const form = req.body;
    var resdata = (await axios.get(
      `https://api.github.com/user/repos?${form.visibility}&affiliation=${Array.isArray(form.affiliation) ? form.affiliation.join(',') : form.affiliation}&${form.sort}`, opts
    )).data;

    req.app.locals.result = result;
  
    var repos = [];
    let i = 1;
    for (let repo of resdata) {
      if (i++ > 10) break;
      var r = {};
      var s = 0;

      r.name = repo.name;
      r.description = repo.description;
      r.url = repo.html_url;
      r.languages = (await axios.get(repo.languages_url, opts)).data;
      
      repos.push(r);
    }

    req.app.locals.repos = repos;

    res.render('profile', {user: result, repos: repos});
  }
});

module.exports = router;
