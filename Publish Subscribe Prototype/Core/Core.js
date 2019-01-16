// Load express framework and express middleware
const express = require('express');
const http = require('http');
const https = require('https');
const forceSsl = require('express-force-ssl');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileManager = require('fs');
const helmet = require('helmet');
const serviceRequest = require('request');

// Express Access Reference
const expressApp = express();

//Config Express to Utilise Middleware
expressApp.use(forceSsl);
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());
expressApp.use(helmet());

// Load config values
var configValues = setConfigValues();
function setConfigValues() 
{
    let configValues = null;
    try { configValues = JSON.parse(fileManager.readFileSync('Config.json')); }
    catch(err) { console.error(err); }
    return configValues
}

function getConfigValues() { return configValues; }

// Load Certificates
function getCertificates()
{
    let certWrapper = null;
    try { certWrapper = {   key: fileManager.readFileSync(configValues.encryptKey), 
                            cert: fileManager.readFileSync(configValues.encryptCert), 
                            ca: fileManager.readFileSync(configValues.encryptCertAuth) }; }
    catch(err) { console.error(err); }
    return certWrapper;
}

// Initilialise HTTPS Listener
https.createServer(getCertificates(),expressApp).listen(configValues.portHTTPS, function(request, response) {
    console.log('Listening for HTTPS connections on port ' + configValues.portHTTPS);
}).on('error', function() { console.log('Selected HTTPS port already in use.'); });

// Initilialise HTTP Listener
http.createServer(expressApp).listen(configValues.portHTTP, function(request, response) {
    console.log('Listening for HTTP connections on port ' + configValues.portHTTP);
}).on('error', function() { console.log('Selected HTTP port already in use.'); });


// Export to database at some point
// Publisher ip's / ports
var publishers = [];

// Catch all GET Messages endpoint
expressApp.get('*', function(request, response)
{
    console.log("GET Received");
    authentificate(function(aValue)
    {
        forwardGetRequest(request, response, function(data)
        {
            response.writeHead(200, {'Content-Type':request.headers['Content-Type']});
            response.write(data);
            response.end();
        });
    });
});

// Catch all POST Messages endpoint
expressApp.post('*', function(request, response)
{
    if(request.originalUrl === '/registerPublisher') { 
        registrationPost(request, response); 
    } else {
        console.log("POST Received");
        authentificate(function(aValue)
        {
            forwardPostRequest(request, response, function(data)
            {
                response.writeHead(200, {'Content-Type':request.headers['Content-Type']});
                response.write(data);
                response.end();
            });
        });
    }
});

function registrationPost(request, response)
{
    console.log("Registration event");
    publishers.push({ 'ip': request.body.ip, 'port': request.body.port });
    console.log(publishers.length + " | " + publishers[0].ip + " | " + publishers[0].port);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end();
}

function authentificate(callback)
{
    // Do some authetification stuff
    callback();
}

function forwardGetRequest(request, response, callback)
{
    publishers.forEach(function(obj)
    {
        https.get( obj.ip + ':' + obj.port + request.originalUrl, function(res) {
            res.on("data", function(data) { callback(data); });
        }).on('error', function(err) 
        {
            console.log(err);
            response.writeHead(502, {'Content-Type': 'text/html'});
            response.write("Unable to process request");
            response.end();
        });
    });
}

function forwardPostRequest(request, response, callback)
{
    publishers.forEach(function(obj)
    {
        let options = { 
            url: obj.ip + ":" + obj.port + request.originalUrl,
            method: 'POST',
            headers: { 'Content-Type': request.headers['Content-Type']},
            form: {body:request.body}
        };

        serviceRequest(options, function(err, response, body) // send request and await response
        {
            callback(body);
        });
        
    });
}