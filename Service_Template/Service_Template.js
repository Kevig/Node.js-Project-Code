/**
 * Module Dependencies
 * Load express framework and express middleware
 * @private
 */
var express = require('express'); // Installed
var http = require('http');
var https = require('https');
var forceSsl = require('express-force-ssl'); // Installed
var bodyParser = require('body-parser'); // Installed
var cookieParser = require('cookie-parser'); // Installed
var fileManager = require('fs');
var helmet = require('helmet'); // Installed

/**
 * Express Access Reference
 * @private
 */
var expressApp = express();

/**
 * Config Express to Utilise Middleware
 */
expressApp.use(forceSsl);
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());
expressApp.use(helmet());


/**
 * Invoke getConfigValues
 * @private
 */
var configValues = getConfigValues();

/**
 * Load Config Values from JSON file
 * @returns {Object}
 * @private
 */
function getConfigValues()
{
    try
    {
        var configValues = JSON.parse(fileManager.readFileSync('Config.json'));
    }
    catch(err)
    {
        console.error(err);
    }
    return configValues
}

/**
 * Invoke getCertificates
 * @private
 */
var certWrapper = getCertificates();

/**
 * Load Certificates
 * @returns {Object}
 * @private
 */
function getCertificates()
{
    try
    {
        var certWrapper = 
        { 
            key: fileManager.readFileSync(configValues.encryptKey), 
            cert: fileManager.readFileSync(configValues.encryptCert), 
            ca: fileManager.readFileSync(configValues.encryptCertAuth)
        };
    }
    catch(err)
    {
        console.error(err);
    }
    return certWrapper;
}

/**
 * Any Other Configuration Options
 */


var pages = loadPages();

function loadPages()
{
    try
    {
        var pages = 
        {
            'Index':fileManager.readFileSync('./Pages/Index.html')
        }
    }
    catch(err)
    {
        console.log(err);
    }
    return pages;
}

/**
 * Create Http and Https listeners and initialise on config ports
 * Output to console success
 */

https.createServer(certWrapper,expressApp).listen(configValues.portHTTPS, function(request, response)
{
    console.log('Listening for HTTPS connections on port ' + configValues.portHTTPS);
}).on('error', function()
{
    console.log('Selected HTTPS port already in use.');
});

http.createServer(expressApp).listen(configValues.portHTTP, function(request, response)
{
    console.log('Listening for HTTP connections on port ' + configValues.portHTTP);
}).on('error', function()
{
    console.log('Selected HTTP port already in use.');
});

/**
 * '/LogIn' - POST - Endpoint
 * @param {Object} request
 * @param {Object} response
 */
expressApp.get(['', '/Index'], function(request, response)
{
    console.log("Forwarded Request Received");
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(pages.Index);
    response.end();
});


