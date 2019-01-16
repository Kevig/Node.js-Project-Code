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
 * Custom Module Dependencies
 * @private
 */
var sessionHandler = require('./SessionHandler');
var logInHandler = require('./LogInHandler');
var mongoAdapter = require('./MongoAdapter');

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
    let configValues = null;
    try
    {
        configValues = JSON.parse(fileManager.readFileSync('Config.json'));
    }
    catch(err)
    {
        console.error(err);
    }
    return configValues
}

/**
 * Load Certificates
 * @returns {Object}
 * @private
 */
function getCertificates()
{
    let certWrapper = null;
    try
    {
        certWrapper = 
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
// When a http request / response is sent to another service, TLS throws an error
// due to certificate being self signed, setting this value to 0 (false)
// allows the cert invalidity to be ignored, data remains encrypted
// If a 'real' cert was used this option can be set to 1 in config.
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = configValues.selfSignedCert_rejection;

var pages = loadPages();

function loadPages()
{
    try
    {
        var pages = 
        {
            'LogIn':fileManager.readFileSync('./Pages/LogIn.html')//,
            //'Index':fileManager.readFileSync('./Pages/Index.html')
        }
    }
    catch(err)
    {
        console.log(err);
    }
    return pages;
}

// Initialise custom modules - Adapter must have finished init prior to sessionHandler and LogInHandler initialisation's
mongoAdapter.openConnection('Gateway', configValues.mongoDB_URL, function()
{
    sessionHandler.init();
    logInHandler.init();
});

/**
 * Create Http and Https listeners and initialise on config ports
 * Output to console success
 */

https.createServer(getCertificates(),expressApp).listen(configValues.portHTTPS, function(request, response)
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


// Event Listeners -> GET REQUESTS //

// Dead end favicon requests
expressApp.get('/favicon.ico', function(request, response)
{
    response.writeHead(200, {'Content-Type': 'image/x-icon'});
    response.end();
});


/**
 * '/LogIn' - GET - Endpoint
 * @callback requestCallback
 * @param {Object} request
 * @param {Object} response
 * @protected
 */
expressApp.get('*', function(request, response)
{
    console.log('request');
    console.log(Object.keys(request.cookies));
    sessionCheck(request.cookies, request.ip, response, function(session)
    {
        if(session === null)
        {
            returnLogIn(response);    
        } 
        else
        {
            serviceRequest(request, response, session.accessLevel);
        }
    });
});


// Event Listeners -> POST REQUESTS //

/**
 * '/LogIn' - POST - Endpoint
 * @param {Object} request
 * @param {Object} response
 */
expressApp.post('/LogIn', function(request, response)
{
    console.log("Log In Post");
    var user = { 'userName' : request.body.userName, 'password' : request.body.password };
    logInHandler.userExists(user, function(user)
    {
        if(user !== null)
        {
            serviceRequest(request, response, user.accessLevel);
        }
        else
        {
            returnLogIn(response);
        }
    });
});

// ANY other post - ie. not handled by this application
expressApp.post('*', function(request, response)
{
    console.log('another post type');
    sessionCheck(request.cookies, request.ip, response, function(session)
    {
        if(session === null)
        {
            returnLogIn(response);
        }
        else
        {
            servicePost(request, response, session.accessLevel);
        }
    });
});


/**
 * Check for session key cookie in request
 * @param {Object} reqCookies 
 * @param {Object} reqIp 
 * @param {Object} response
 * @param {Function} callback
 */
function sessionCheck(reqCookies, reqIp, response, callback)
{
    var cKeys = Object.keys(reqCookies);
    if(!cKeys.includes('SessionKey'))
    {
        callback(null);
    }
    else
    {
        var skValue = reqCookies['SessionKey'];      
        sessionHandler.sessionExists(skValue, reqIp, function(session)
        {
            callback(session);
        });    
    }
}

// Return log in HTML page
/**
 * Read Log In Page HTML file and send to client as Response
 * @param {Object} response 
 */
function returnLogIn(response)
{    
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(pages.LogIn);
    response.end();
}

/**
 * Request Forwarding to Service, determined by access level value
 * @param {*} request 
 * @param {*} response 
 * @param {*} accessLevel 
 */
function serviceRequest(request, response, accessLevel)
{   
    var oUrl = null;
    if(request.originalUrl === "" ||  request.originalUrl === "/LogIn")
    {
        console.log(accessLevel);
        oUrl = "/Index";
    }
    else 
    { 
        oUrl = request.originalUrl; 
    }
    
    https.get( 'https://' + configValues.service[accessLevel].ip + ':' +
                            configValues.service[accessLevel].port +
                            oUrl, function(res)
    {
        res.on("data", function(data)
        {
            newSession(response, request.ip, accessLevel, function(response)
            {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(data);
                response.end();
            });
        })
    }).on('error', function(err) 
    {
        console.log(err);
        response.writeHead(502, {'Content-Type': 'text/html'});
        response.write("Unable to process request");
        response.end();
    });
}


function servicePost(request, response, accessLevel)
{
    // Not yet implemented...
    // Placeholder for forwarding POST requests to other services
    // Different method from that of a simple GET request
}

/**
 * 
 * @param {*} response 
 * @param {*} ip
 * @param {*} key 
 * @param {*} callback 
 */
function newSession(response, ip, accessLevel, callback)
{
    var sDuration = (configValues.session_Duration_Minutes * 1000) * 60;
    sessionHandler.createSession(ip, configValues.session_Key_Size, sDuration, accessLevel, function(sKey)
    {
        if(sKey !== null)
        {
            response.cookie('SessionKey', sKey, {maxAge: sDuration, httpOnly: true, secure: true, sameSite: 'lax' });
            callback(response);
        }
        else
        {
            callback(null);   
        }
    });
}