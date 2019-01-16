
var mongoAdapter = require('./MongoAdapter');

module.exports.init = init;
module.exports.userExists = userExists;

/**
 * 
 */
function init()
{
    mongoAdapter.createTable('Users');
}

/**
 * 
 * @param {*} user 
 * @param {*} callback 
 */
function userExists(user, callback)
{
    validateUserValues(user, function(isValid)
    {
        if(isValid)
        {        
            mongoAdapter.findRecord('Users', user, function(exists)
            {
                callback(exists);
            });
        }
        else
        {
            callback(null);
        }
    });
}

/**
 * 
 * @param {*} user 
 * @param {*} callback 
 */
function validateUserValues(user, callback)
{
    validateUserName(user.userName, function(isValidName)
    {
        if(!isValidName)
        {
            callback(false);
        }

        validatePassword(user.password, function(isValidPass)
        {
            if(!isValidPass)
            {
                callback(false);
            }
            callback(true);
        });
    });
}

// Seperate function for if any expansion of what a valid user name is
// Curently only checks that value contains only numbers, letters and an underscore
/**
 * 
 * @param {*} name 
 * @param {*} callback 
 */
function validateUserName(name, callback)
{
    callback(/^\w+$/.test(name));
}

// Seperate function for if any expansion of what a valid password is
// Curently only checks that value contains only numbers, letters and an underscore
/**
 * 
 * @param {*} pWord 
 * @param {*} callback 
 */
function validatePassword(pWord, callback)
{
    callback(/^\w+$/.test(pWord));
}