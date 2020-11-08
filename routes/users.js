var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  if (!req.session.username) res.redirect('/login');
  else {
    res.render('users');
  }

});

module.exports = router;
