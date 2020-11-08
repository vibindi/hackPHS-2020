var express = require('express');
var router = express.Router();

const app = require('../app');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const client = req.app.locals.client;

  if (!req.session.username) res.redirect('/login');
  else {
    
    var result = (await client.execute('SELECT * FROM users WHERE username=?', [req.session.username])).first();
    var resdata = (await axios.get(`https://api.github.com/user/repos`)).data;

    // result and resdata contain github info

    res.render('users');
  }
});

module.exports = router;
