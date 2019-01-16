
var mongoAdapter = require('./MongoAdapter');

module.exports.init = init;
module.exports.sessionExists = sessionExists;
module.exports.createSession = createSession;

/**
 * 
 */
function init()
{
    mongoAdapter.createTable('Sessions');
}

/**
 * 
 * @param {*} session 
 * @param {*} ip 
 * @param {*} callback 
 */
function sessionExists(session, ip, callback)
{
    mongoAdapter.findRecord('Sessions', { 'key' : session, 'ip' : ip}, function(exists)
    {
        mongoAdapter.deleteRecord('Sessions', { 'key' : session, 'ip' : ip}, function(isRemoved)
        {
            callback(exists);
        });        
    });
}

/**
 * 
 * @param {*} ip 
 * @param {*} keySize 
 * @param {*} eTime 
 * @param {*} callback 
 */
function createSession(ip, keySize, eTime, accessLevel, callback)
{
    generateKey(keySize, function(aKey)
    {
        var expTime = new Date(new Date().getTime() + eTime + 30000);
        mongoAdapter.addRecord('Sessions', {'key': aKey, 'ip': ip, 'expiry': expTime, 'accessLevel': accessLevel}, function(result)
        {
            if(result)
            {
                console.log('New Key Created with access level: ' + accessLevel);
                callback(aKey);
            }
            else
            {
                callback(null);
            }
        });
    });
}

/**
 * 
 * @param {*} keySize 
 * @param {*} callback 
 */
function generateKey(keySize, callback)
{
    var kLength = keySize;
    var characterSet =  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + 
                        "abcdefghijklmnopqrstuvwxyz" +
                        "0123456789";
    var aKey = '';
    for(var i = 0; i < kLength + 1; i++)
    {
        var rng = Math.floor(Math.random() * (characterSet.length + 1));
        aKey += characterSet.charAt(rng);
    }
    callback(aKey);
}

