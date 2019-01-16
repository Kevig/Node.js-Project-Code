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
                            ca: fileManager.readFileSync(configValues.encryptCertAuth) };}
    catch(err) { console.error(err); }
    return certWrapper;
}

// Initilialise HTTPS and HTTP Listeners
https.createServer(getCertificates(),expressApp).listen(configValues.portHTTPS, function(request, response){
    console.log('Listening for HTTPS connections on port ' + configValues.portHTTPS);
}).on('error', function() { console.log('Selected HTTPS port already in use.'); });

http.createServer(expressApp).listen(configValues.portHTTP, function(request, response){
    console.log('Listening for HTTP connections on port ' + configValues.portHTTP);
}).on('error', function() { console.log('Selected HTTP port already in use.'); });


// Export to database at some point
// Service ip's / ports
var registeredServices = [];

registerService();
function registerService()
{
    let options = { url: configValues.core.ip + '/registerPublisher',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    form: { 'ip': configValues.url, 'port': configValues.portHTTPS }
    };
    
    serviceRequest(options, function(err, response, body)
    {
        if(!err && response.statusCode === 200)
        {
            console.log("Service Registered");
        }
    });
}

function serviceGetMessage(address)
{
    https.get(address, function(res)
    {
        console.log("Service Message Sent");
    }).on('error', function(err)
    {
        console.log(err);
    }) ;
}

// Catch all endpoint
expressApp.get('*', function(request, response)
{
    console.log('Forwarded GET request receieved');
});

expressApp.post('*', function(request, response)
{
    if(request.originalUrl === '/registerPublisher') { 
        registrationPost(request, response); 
    } else {
        console.log('Forwarded POST request received');
    }
});

function registrationPost(request, response)
{
    console.log("Registration event");
    registeredServices.push({ 'ip': request.body.ip, 'port': request.body.port });
    let l = registeredServices.length -1;
    console.log(registeredServices.length + " | " + registeredServices[l].ip + " | " + registeredServices[l].port);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end();
}

// Use a GET message type for broadcast since no body will be associated with a broadcast
function broadcastEvent(eventName)
{
    registeredServices.forEach(function(obj)
    {
        https.get( obj.ip + ':' + obj.port + eventName, function(res) {
            res.on('end', function() 
            {
                if(res.statusCode === '200')
                {
                    console.log('Service says ok!');
                } else {
                    console.log('Service says no!');
                }
            });
        }).on('error', function(err) 
        {
            console.log(err);
            response.writeHead(502, {'Content-Type': 'text/html'});
            response.write("Unable to process request");
            response.end();
        });
    });
}

/** Class Tests 
const PublishEvent = require('./PublishEvent.js');
var test1 = new PublishEvent();
test1.setEvent('/A_URL');
test1.setEventType('POST');
console.log(test1.getEvent());
console.log(test1.getEventType());
*/