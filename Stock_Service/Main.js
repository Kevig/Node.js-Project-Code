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

/**
function printRoutes() {
    expressApp._router.stack.forEach( (item) => { 
        if(item.route && item.route.path) { console.log(item.route.path); }
    });
}
*/


/**
const assert = require('assert');
const Component = require("./Component.js");
const Product = require("./Product");
const Part = require("./Part");

var dbURL = 'mongodb://localhost:27017';

console.log("-----------------Component1-----------------");
// Test creation of new component with constructor attribute values
var component1 = new Component();
// component1.print();
// Result: Successful

// Test assigning values to each attribute
component1.setDbId('DataBaseId');
component1.setId('C1234567890');
component1.setName('Component One');
component1.setType('Type A');
component1.setDescription('Component One Description ');
component1.print();
// Result: Successful

console.log("-------------------Part1-------------------");
// Test creation of a new part that is a type of component1 Component
var part1 = new Part(component1);
part1.setSerial('123-456-789-0');
part1.setRohsCompliant(true);
part1.setValue(10.00);
part1.setValueCurrency('GBP');
part1.print();

console.log("-----------------Component2-----------------");
// Create Additional Components
var component2 = new Component();
component2.setComponent('11111111111C', 'Component Two', 'Type B', 'Component Two Description');
component2.print();

console.log("------------------Product1------------------");
var product1 = new Product(component2);
product1.setSerial('123-456-789-0');
product1.setRohsCompliant(true);
product1.setValue(10.00);
product1.setValueCurrency('GBP');
product1.print();

product1.addPart(part1);

console.log("---------------Product1 Parts---------------");
product1.printParts();


// Test Removing a Component
//product1.removeComponent(component1);
//product1.printComponents();
// Result: Successful
*/



