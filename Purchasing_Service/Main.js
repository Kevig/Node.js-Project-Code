const express = require('express');
const http = require('http');
const https = require('https');
const forceSsl = require('express-force-ssl');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileManager = require('fs');
const helmet = require('helmet');
const serviceRequest = require('request');
const expressApp = express();

const mongoAdapter = require('./MongoAdapter');

const API = require('./API.js');

var configValues = getConfigValues();
var api = new API();

initExpress();
startListening();
mapEndPoints();
initDatabaseConnection();

function initExpress() {
    expressApp.use(forceSsl);
    expressApp.use(bodyParser.urlencoded({ extended: false }));
    expressApp.use(bodyParser.json());
    expressApp.use(cookieParser());
    expressApp.use(helmet());
}

function getConfigValues() {
    let configValues = null;
    try { configValues = JSON.parse(fileManager.readFileSync('Config.json')); }
    catch(err) { console.error(err); }
    return configValues
}

function getCertificates() {
    let certWrapper = null;
    try { certWrapper = {   key: fileManager.readFileSync(configValues.encryptKey), 
                            cert: fileManager.readFileSync(configValues.encryptCert), 
                            ca: fileManager.readFileSync(configValues.encryptCertAuth) };}
    catch(err) { console.error(err); }
    return certWrapper;
}

function startListening(callback) {
    openListener(https, configValues.portHTTPS, 'HTTPS', () => {
        openListener(http, configValues.portHTTP, 'HTTP', () => {});
    });
}

function openListener(protocol, port, protocolType, callback) {
    protocol.createServer(getCertificates(), expressApp).listen(port, (request, response) => {
        console.log('Listening for ' + protocolType + ' connections on port ' + port); callback();
    }).on('error', function() { console.log('Selected ' + protocolType + ' port already in use.'); });
}

function mapEndPoints() {
    api.init(expressApp);
}

function initDatabaseConnection() {
    mongoAdapter.openConnection(configValues.databaseName, configValues.mongoDB_URL, () => {
        mongoAdapter.createTable('Empty');
        mongoAdapter.findAllRecords('Empty', () => {});
    });
}