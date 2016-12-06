/**
 * Created by dylancross on 6/12/16.
 */
var prequest    = require('prequest');
var Q           = require('q');

var template = JSON.stringify({
    id : 0,
    name : null,
    image_id : null,
    census : null,
    psarchives : null
});

var weap = [];

// Fetches the weapons for a specified character and stores them in the weap array - possible to add multiple characters
// Run from the bottom of bin/www
function getData() {
    var response = Q.defer();
    var url = "http://psarchives.com/v1/update/items";

    prequest(url).then(function (body) {
        // Debug only
        // console.log(body);
        body.forEach(function(wep) {
            var obj = JSON.parse(template);
            obj.id = wep.item_id;
            obj.name = wep.name;
            obj.image_id = wep.image_id;
            obj.census = "https://census.daybreakgames.com/files/ps2/images/static/" + Math.abs(wep.image_id);
            obj.psarchives = "https://storage.googleapis.com/planetside/static/" + Math.abs(wep.image_id) + ".png";
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

// return the weapon array
function getWeap() {
    return weap;
}

exports.getData = getData;
exports.getWeap = getWeap;