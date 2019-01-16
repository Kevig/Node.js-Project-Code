// Load express framework and express middleware
var express = require('express');
var http = require('http');
var https = require('https');
var forceSsl = require('express-force-ssl');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fileManager = require('fs');
var helmet = require('helmet');

// Express Access Reference
var expressApp = express();

//Config Express to Utilise Middleware
expressApp.use(forceSsl);
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());
expressApp.use(helmet());


// Load config values
var configValues = getConfigValues();
function getConfigValues() 
{
    try { var configValues = JSON.parse(fileManager.readFileSync('Config.json')); }
    catch(err) { console.error(err); }
    return configValues
}

// Load Certificates
function getCertificates()
{
    try { var certWrapper = {   key: fileManager.readFileSync(configValues.encryptKey), 
                                cert: fileManager.readFileSync(configValues.encryptCert), 
                                ca: fileManager.readFileSync(configValues.encryptCertAuth) };}
    catch(err) { console.error(err); }
    return certWrapper;
}

// Load HTML pages into memory
var pages = loadPages();
function loadPages() 
{
    try { var pages = { Index: fileManager.readFileSync('./Pages/Index.html') }}
    catch(err) { console.log(err); }
    return pages;
}

// Initilialise HTTPS Listener
https.createServer(getCertificates(),expressApp).listen(configValues.portHTTPS, function(request, response)
{
    console.log('Listening for HTTPS connections on port ' + configValues.portHTTPS);
}).on('error', function() {
    console.log('Selected HTTPS port already in use.');
});

// Initilialise HTTP Listener
http.createServer(expressApp).listen(configValues.portHTTP, function(request, response)
{
    console.log('Listening for HTTP connections on port ' + configValues.portHTTP);
}).on('error', function() {
    console.log('Selected HTTP port already in use.');
});

// Catch all endpoint
expressApp.get('*', function(request, response)
{
    console.log("Forwarded Request Received");
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(pages.Index);
    response.end();
});