/**
 * Created by pierre on 09/07/16.
 */


'use strict';

// Imports
const RouterExpress = require('express').Router();
const RequestsController = require("./../controllers/RequestsController");

module.exports = class Router {

    constructor (connection, uuidInstance) {
        this.router = RouterExpress;
        this.connection = connection;
        this.uuidInstance = uuidInstance;
        this.requestsController = new RequestsController(this.connection, this.uuidInstance);
        this.init();
        this.requestsRoutes();
    }

    getRouter () {
        return this.router;
    }

    init () {
        this.router.use(function timeLog(req, res, next) {
            next();
        });

        this.router.get('/', (req, res) => {
            res.send('Home page');
        });
    }

    requestsRoutes () {

        // Launch new request to other microservices
        this.router.post("/requests", (req, res) => {
            this.requestsController.createRequest(req, res, (err, request) => {
                if (err) res.status(501).json(err.message);
                res.status(200).json(request);
            });
        });

    }

};

