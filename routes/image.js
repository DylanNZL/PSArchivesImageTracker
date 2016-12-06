var express     = require('express');
var router      = express.Router();
var prequest    = require('prequest');
var Q           = require('q');

var template = JSON.stringify({
    id : 0,
    name : null,
    census : null,
    psarchives : null
});

var weap = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    render(res);
});

function render(res) {
    getData("mononz").then(function (result) {
        if (result) {
            res.render('image', { title: 'PSArchives Images', weapon: weap });
        } else {
            res.render('image', { title: "Error" });
        }
    });
}

function getData(char) {
    var response = Q.defer();
    var url = "http://psarchives.com/weapons_list?name=" + char;
    prequest(url).then(function (body) {
        console.log(body.weapons);
        body.weapons.forEach(function(wep) {
            var obj = JSON.parse(template);
                obj.id = wep.information.item_id;
                obj.name = wep.information.name_en;
                obj.census = "https://census.daybreakgames.com/files/ps2/images/static/" + wep.information.image_id;
                obj.psarchives = "https://storage.googleapis.com/planetside/static/" + wep.information.image_id + ".png";
            if (obj.id > 0) {
                if (!weap[obj.id]) {
                    weap[obj.id] = obj;
                } else {
                    console.log("duplicate " + obj.id + ' ' + obj.name);
                }
            }
            console.log(obj.id + ' ' + obj.name + ' ' + obj.census + ' ' + obj.psarchives);
        });
        response.resolve(true);
    }).catch(function (err) {
        console.error(err);
        response.resolve(false);
    });
    return response.promise;
}

module.exports = router;
