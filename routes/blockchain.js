var express = require('express');
var router = express.Router();

/* GET home page. */
/* url : /blockchain */
router.get('/', function(req, res, next) {
  res.render('blockchain', { title: 'Express' });
});

module.exports = router;
