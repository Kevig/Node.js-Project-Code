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
const Requisition = require('./Requisition');
const Component = require('./Component');
const Item = require('./Item');

let item1 = new Item();
item1.setId('I1');
item1.setName('Item1');
item1.setType('AType');
item1.setDescription('ADescription');

//item1.print();

let req1 = new Requisition();
req1.setId('R1');
req1.submit('APerson');

//console.log(req1);

req1.addItem(item1, (result) => {
    //console.log(req1);
});

req1.getItemById('I1', (result) => {
    result.quantityIncrement();
    //console.log(req1);        
});

req1.approve('BPerson');
//console.log(req1);

let rItem1 = new Item();
rItem1.setId('I1');
rItem1.setName('Item1');
rItem1.setType('AType');
rItem1.setDescription('ADescription');
rItem1.setQuantity(1);

req1.itemReceived(rItem1, () => {
    //console.log(req1);
});

req1.complete('APerson', () => {
    console.log(req1.toString());
});
*/