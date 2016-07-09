/**
 * Created by pierre on 09/07/16.
 */

const RequestsService  = require('./../services/RequestsService');

module.exports = class RequestsController {
    
    constructor (connection, uuidInstance) {
        this.connection = connection;
        this.uuidInstance = uuidInstance;
        this.requestsService = new RequestsService(this.connection, this.uuidInstance);
    }
    
    createRequest (req, res, callback) {
        this.requestsService.createRequest(req, res, callback);
    }
}; 

