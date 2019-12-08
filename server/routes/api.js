var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')({/* options */})
var secret = require('../secret');

var _db;

function _getDb(){
    if(!_db){
        var config = secret.postgres;
        var url = [
            'postgres://',
            config.username,
            ':',
            config.password,
            '@',
            config.host,
            ':',
            config.port,
            '/',
            config.database
        ].join('');
        _db = pgp(url);
    }
    return _db;
}

TABLE = {
    RECORDS : 'test'
}

function _getRecords(){
    var db = _getDb();
    var connection;
    return db.connect()
        .then(con =>{
            connection = con;
            return connection.any('SELECT * FROM ' + TABLE.RECORDS + ' LIMIT 20');
        })
        .then(data => {
            console.log('DATA:', data.value)
            return data;
        })
        .catch(err => {
            console.log('ERROR:', err)
            return err;
        });
}


/* GET users listing. */
router.get('/info', function(req, res, next) {
    _getRecords()
        .then(data => {
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            res.send(JSON.stringify(err));
        });
});

module.exports = router;
