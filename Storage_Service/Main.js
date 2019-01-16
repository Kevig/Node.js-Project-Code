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


// Test Code - Complete and working as expected
/**
const Location = require('./Location');
const Storage = require ('./Storage');
const Item = require('./Item');

function createLocations() {
    location1 = new Location(); location1.setLocation("Location1","Location 1 Description");
    location2 = new Location(); location2.setLocation("Location2","Location 2 Description");
    location3 = new Location(); location3.setLocation("Location3","Location 3 Description");
}

function createStorage() {
    storage1 = new Storage(); storage1.setStorage("Storage1", "Storage 1 Description", 'pallet');
    storage2 = new Storage(); storage2.setStorage("Storage2", "Storage 2 Description", 'rack');
    storage3 = new Storage(); storage3.setStorage("Storage3", "Storage 3 Description", 'shelf');
    storage4 = new Storage(); storage4.setStorage("Storage4", "Storage 4 Description", 'bench');
    storage5 = new Storage(); storage5.setStorage("Storage5", "Storage 5 Description", 'other');
}

function createItems() {
    item1 = new Item(); item1.setItem('Item 1 Id', 'Product');
    item2 = new Item(); item2.setItem('Item 2 Id', 'Part');
    item3 = new Item(); item3.setItem('Item 3 Id', 'Part');
    item4 = new Item(); item4.setItem('Item 4 Id', 'Other');
    item5 = new Item(); item5.setItem('Item 5 Id', 'Product');
    item6 = new Item(); item6.setItem('Item 6 Id', 'Other');
    item7 = new Item(); item7.setItem('Item 7 Id', 'Part');
    item8 = new Item(); item8.setItem('Item 8 Id', 'Part');
    item9 = new Item(); item9.setItem('Item 9 Id', 'Product');
    item10 = new Item(); item10.setItem('Item 10 Id', 'Product');
    item11 = new Item(); item11.setItem('Item 11 Id', 'Other');
    item12 = new Item(); item12.setItem('Item 12 Id', 'Part');
    item13 = new Item(); item13.setItem('Item 13 Id', 'Part');
    item14 = new Item(); item14.setItem('Item 14 Id', 'Part');
    item15 = new Item(); item15.setItem('Item 15 Id', 'Other');
    item16 = new Item(); item16.setItem('Item 16 Id', 'Other');
    item17 = new Item(); item17.setItem('Item 17 Id', 'Part');
    item18 = new Item(); item18.setItem('Item 18 Id', 'Part');
    item19 = new Item(); item19.setItem('Item 19 Id', 'Product');
    item20 = new Item(); item20.setItem('Item 20 Id', 'Part');
}

function addItemsToStorage() {
    storage1.addItem(item1);
    storage1.addItem(item2);
    storage1.addItem(item3);
    storage1.addItem(item4);
    storage1.addItem(item5);

    storage2.addItem(item6);
    storage2.addItem(item7);
    storage2.addItem(item8);
    storage2.addItem(item9);

    storage3.addItem(item10);
    storage3.addItem(item11);
    storage3.addItem(item12);

    storage4.addItem(item13);
    storage4.addItem(item14);
    storage4.addItem(item15);
    storage4.addItem(item16);
    storage4.addItem(item17);
    storage4.addItem(item18);

    storage5.addItem(item19);
    storage5.addItem(item20);
}


function addStorageToLocation() {
    location1.addStorage(storage1);
    location1.addStorage(storage2);
    location2.addStorage(storage3);
    location3.addStorage(storage4);
    location3.addStorage(storage5);
}

createLocations();
createStorage();
createItems();

addItemsToStorage();
addStorageToLocation();

//location3.print();
//location3.printStorage();

//storage1.print();
//storage1.printItems();

location1.printFull()
 */