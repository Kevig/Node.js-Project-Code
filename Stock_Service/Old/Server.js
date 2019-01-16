//module.exports = Server;

var express = require('express');
var http = require('http');
var https = require('https');
var forceSsl = require('express-force-ssl');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fileManager = require('fs');
var helmet = require('helmet');
var serviceRequest = require('request');
var expressApp = express();

initExpress(()=> {
    setConfigValues('Config.json', () => {
        setCertificates(() => {
            //start(()=> {});
            
            https.createServer(certificates, expressApp).listen(configValues.portHTTP, function(request, response) {
                console.log('Listening for http connections on port ' + configValues.portHTTP);
            }).on('error', function() { console.log('Selected HTTP port already in use.'); });

            http.createServer(certificates, expressApp).listen(configValues.portHTTP, function(request, response) {
                console.log('Listening for http connections on port ' + configValues.portHTTP);
            }).on('error', function() { console.log('Selected HTTP port already in use.'); });





        });
    });
});

//function getExpressApp() { console.log('Return E App'); return this.expressApp; }

function setConfigValues(fileName, callback) {
    try { configValues = JSON.parse(fileManager.readFileSync(fileName)); }
    catch(err) { console.error(err); }
    console.log('Set Config Values Complete - 2');
    callback();
}

function setCertificates(callback) {
    try {
            certificates = { key:  fileManager.readFileSync(configValues.encryptKey),
                             cert: fileManager.readFileSync(configValues.encryptCert),
                             ca:   fileManager.readFileSync(configValues.encryptCertAuth)};}
    catch(err) { console.error(err); }
    console.log('Set Certs Complete - 3');
    callback();
}

function initExpress(callback) {
    expressApp.use(bodyParser.urlencoded({ extended: false }));
    expressApp.use(bodyParser.json());
    expressApp.use(cookieParser);
    expressApp.use(helmet);
    console.log('Init Express Complete - 1');
    callback();
}

function start(callback) {
    openListener(https, configValues.portHTTPS, 'HTTPS', () => {
        openListener(http, configValues.portHTTP, 'HTTP', () => { 
            callback(); 
        });
    });
}

function openListener(protocol, port, protocolType, callback) {
    protocol.createServer(certificates, expressApp).listen(port, function(request, response) {
        console.log('Listening for ' + protocolType + ' connections on port ' + port); callback();
    }).on('error', function() { console.log('Selected ' + protocolType + ' port already in use.'); });
}

function printRoutes() {
    expressApp._router.stack.forEach( (item) => { 
        if(item.route && item.route.path) { console.log(item.route.path); }
    });
}
