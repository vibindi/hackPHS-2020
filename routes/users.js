var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {

  if (!req.session.username) res.redirect('/login');
  else {
    const client = req.session.client;
    
    var result = (await client.execute('SELECT * FROM users WHERE username=?', [req.session.username])).first();
    var resdata = (await axios.get(`https://api.github.com/user/repos`)).data;

    // result and resdata contain github info

    res.render('users');
  }

});

module.exports = router;
