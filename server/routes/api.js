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
            console.log('DATA:', data.value);
            connection.done();
            return data;
        })
        .catch(err => {
            console.log('ERROR:', err);
            connection.done();
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

function _isTableExists(tableName){
    var db = _getDb();
    var connection;
    return db.connect()
        .then(con =>{
            connection = con;
            var query = [
                "SELECT EXISTS (",
                   "SELECT 1",
                   "FROM   information_schema.tables",
                   "WHERE  table_schema = 'public'",
                   "AND    table_name = '" + tableName + "'",
               ");"
           ].join(' ');
            return connection.one(query);
        })
        .then(data => {
            console.log('DATA:', data.value);
            connection.done();
            return data.exists;
        })
        .catch(err => {
            console.log('ERROR:', err);
            connection.done();
        });
}

router.get('/check/table/:tableName', function(req, res, next) {

    _isTableExists(req.params.tableName)
        .then(data => {
            console.log('check ok');
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            console.log('check failed');
            res.send(JSON.stringify(err));
        });
});

function _createTable(tableName){
    var db = _getDb();
    var connection;
    return db.connect()
        .then(con =>{
            connection = con;
            var schema = [
                "CREATE TABLE " + tableName + "(",
                    "id serial PRIMARY KEY,",
                    "value VARCHAR (100) UNIQUE NOT NULL",
                ");"
            ].join(' ');
            return connection.none(schema);
        })
        .then(() => {
            connection.done();
        })
        .catch(err => {
            console.log('ERROR:', err);
            connection.done();
        });
}

router.get('/create/table/:tableName', function(req, res, next) {

    _createTable(req.params.tableName)
        .then(() => {
            console.log('table created');
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            console.log('fail to create table');
            res.send(JSON.stringify(err));
        });
});

function _dropTable(tableName){
    var db = _getDb();
    var connection;
    return db.connect()
        .then(con =>{
            connection = con;
            return connection.none("DROP TABLE IF EXISTS " + tableName + " ;");
        })
        .then(() => {
            connection.done();
        })
        .catch(err => {
            console.log('ERROR:', err);
            connection.done();
        });
}

router.get('/drop/table/:tableName', function(req, res, next) {

    _dropTable(req.params.tableName)
        .then(() => {
            console.log('table dropped');
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            console.log('fail to drop table');
            res.send(JSON.stringify(err));
        });
});

module.exports = router;
