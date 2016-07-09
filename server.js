/**
 * Created by pierre on 09/07/16.
 */


'use strict';

// Imports components
const express = require('express');
const appExpress = express();
const http = require('http').Server(appExpress);

const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const configServer = require('./utils/config/server.json');

const Router = require('./api/router/Router');
// const configDatabase = require('./utils/config/database.json');

const nameApp = 'MS1';
const uuidInstance = uuid.v4(); 

class server {

    constructor () {
        this.init();
        this.launch();
        this.initConnections();
    }

    init () {
        appExpress.set('port', process.env.PORT || configServer.port);
        appExpress.use(session({ resave: true, saveUninitialized: true, secret: 'unicorn' }));
        appExpress.use(bodyParser.json());
        appExpress.use(bodyParser.urlencoded({ extended: true }));
        appExpress.use(express.static(__dirname + '/../public'));
    }

    launch () {
        http.listen(appExpress.get('port'), () => {
            console.log("INFO = [Listening on port "+appExpress.get('port')+"]");
        });
    }

    initConnections () {
        var mysql      = require('mysql');
        
        const connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'microservices'
        });
        
        appExpress.use('/api', new Router(connection, uuidInstance).getRouter());
        this.createSchema(connection);
        this.register(connection);
    }


    createSchema (connection) {
        // Creation of database for instances of microservices

        // Table for applications
        const queryCreateApps = 'CREATE TABLE IF NOT EXISTS Applications (name varchar(255) PRIMARY KEY);';
        connection.query( queryCreateApps, function(err, rows){
            if(err) throw err;
        });

        // Table for instances
        const queryCreateInstance = 'CREATE TABLE IF NOT EXISTS Instances (uuid varchar(255) PRIMARY KEY, timestamp double, app varchar(255));';
        connection.query( queryCreateInstance, (err, rows) =>{
            if(err)	throw err;
        });

        // Table for requests IN
        const queryCreateRequestsIn = 'CREATE TABLE IF NOT EXISTS Requests (uuid varchar(255), step int, type varchar(55), timestamp double, instance varchar(255));';
        connection.query( queryCreateRequestsIn, (err, rows) =>{
            if(err)	throw err;
        });

    }

    register (connection) {

        const insertQueryApp = 'INSERT INTO Applications VALUES  ('+connection.escape(nameApp)+');';
        connection.query( insertQueryApp, function(err, rows) {});

        var instance  = {
            uuid: uuidInstance,
            timestamp: new Date().getTime(),
            app : connection.escape(nameApp)
        };

        connection.query('INSERT INTO Instances SET ?', instance, function(err, result) {
            if (err) throw err;
        });
    }
}

new server();