/**@static @private @description Service, application business logic. */
const Service = require("./Service.js");

/**
 * @class
 * @classdesc Serves as an interface between Service functionlity and the applications Server.
 */
class API_Post
{
    /**
     * Zero attribute constructor.
     */
    constructor() {}

    /**
     * @private
     * @param {*} response A response object provided by Express
     * @param {*} result The ServiceResult instance provided as a result of Service processing.
     * @description Adds values to response attributes so that a Response can be sent to the requesting client in a JSON format.
     * 
     * Pre-Conditions: response must be an instance of Response, provided by Express.
     *                 result must be an instance of ServiceResult.
     * 
     * Post-Conditions: Client will have been sent a response message, via Express.
     * 
     * Cyclomatic Complexity: 1
     */
    sendResponse(response, result) {
        response.writeHead(result.code, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(result.message));
        response.end();
    }

    /**
     * @public
     * @param expressApp An instance of Express setup to receive and send HTTP / HTTPS messages.
     * @description Centralised location for event listeners.
     * 
     * Pre-Conditions: expressApp must reference an initialised instance of Express.
     * 
     * Post-Conditions: None
     * 
     * Cyclomatic Complexity: 1
     */
    init(expressApp)
    {
        
    }
}
module.exports = API_Post;