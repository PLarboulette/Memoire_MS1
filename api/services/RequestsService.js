/**
 * Created by pierre on 09/07/16.
 */

'use strict';

const request = require('request');
const uuid = require('uuid');

module.exports = class RequestsService {
    
    constructor (connection, uuidInstance) {
        this.connection = connection;
        this.uuidInstance = uuidInstance;
    }
    
    createRequest (req, res, callback) {

        // timestamp at the beginning of the task
        const requestOut = {
            uuid : uuid.v4(),
            step : 1,
            type : this.connection.escape('OUT'),
            instance : this.uuidInstance,
            timestamp : new Date().getTime()
        };

        // Insert the new request which will be send
        this.connection.query('INSERT INTO Requests SET ?', requestOut, function(err, result) {
            if (err) throw err;
        });

        // Send request to MS2
        request.post({url:'http://localhost:3001/api/requests', form :requestOut}, (err, httpResponse, body) => {
            if (err) throw err;
            else {
                const bodyJSON = JSON.parse(body);
                const requestIn = {
                    uuid : bodyJSON.uuid,
                    step : parseInt(bodyJSON.step) + 1,
                    type : this.connection.escape('IN'),
                    instance : this.uuidInstance,
                    timestamp : new Date().getTime()
                };

                // Insert the new request which has been received
                this.connection.query('INSERT INTO Requests SET ?', requestIn, function(err, result) {
                    if (err) throw err;
                });
            }
        });
        callback(null, "ok");
    }

    // Timestamp là


} ; 

