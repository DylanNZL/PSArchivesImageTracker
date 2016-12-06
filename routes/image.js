var express     = require('express');
var router      = express.Router();
var weapon      = require('../weapon.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    render(res);
});

// fills the array and then renders the page
function render(res) {
    var weap = weapon.getWeap();
    res.render('image', { title: 'PSArchives Images', weapon: weap });
}


module.exports = router;
