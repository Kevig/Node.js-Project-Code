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
     * Post-Conditions: A Number of End Points are created for handling Service Communications.
     * 
     * Cyclomatic Complexity: 1
     */
    init(expressApp)
    {
        
        expressApp.post('/NewLocation', (request, response) => {
            console.log('Create New Location Event');
            let service = new Service();
            service.newLocation(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/NewStorage', (request, response) => {
            console.log('Create New Storage Event');
            let service = new Service();
            service.newStorage(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/NewItem', (request, response) => {
            console.log('Create New Item Event');
            let service = new Service();
            service.newItem(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetLocationById', (request, response) => {
            console.log('Get Location By Id Event');
            let service = new Service();
            service.getLocationById(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetLocationByDescription', (request, response) => {
            console.log('Get Location By Description Event');
            let service = new Service();
            service.getLocationByDescription(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetStorageById', (request, response) => {
            console.log('Get Storage By Id Event');
            let service = new Service();
            service.getStorageById(request, (result) => {
                this.sendResponse(response, result);
            });
        });        

        expressApp.post('/GetStorageByDescription', (request, response) => {
            console.log('Get Storage By Description Event');
            let service = new Service();
            service.getStorageByDescription(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetStorageByType', (request, response) => {
            console.log('Get Storage By Type Event');
            let service = new Service();
            service.getStorageByType(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetItemById', (request, response) => {
            console.log('Get Item By Id Event');
            let service = new Service();
            service.getItemById(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetItemByType', (request, response) => {
            console.log('Get Item By Type Event');
            let service = new Service();
            service.getItemByType(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/UpdateLocation', (request, response) => {
            console.log('Update Location Event');
            let service = new Service();
            service.updateLocation(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/UpdateStorage', (request, response) => {
            console.log('Update Storage Event');
            let service = new Service();
            service.updateStorage(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/UpdateItem', (request, response) => {
            console.log('Update Item Event');
            let service = new Service();
            service.updateItem(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/DeleteLocation', (request, response) => {
            console.log('Delete Location Event');
            let service = new Service();
            service.deleteLocation(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/DeleteStorage', (request, response) => {
            console.log('Delete Storage Event');
            let service = new Service();
            service.deleteStorage(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/DeleteItem', (request, response) => {
            console.log('Delete Item Event');
            let service = new Service();
            service.deleteItem(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/AddStorageToLocation', (request, response) => {
            console.log('Add Storage To Location Event');
            let service = new Service();
            service.addStorageToLocation(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/AddItemToStorage', (request, response) => {
            console.log('Add Item To Storage Event');
            let service = new Service();
            service.addItemToStorage(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/RemoveStorageFromLocation', (request, response) => {
            console.log('Remove Storage From Location Event');
            let service = new Service();
            service.removeStorageFromLocation(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/RemoveItemFromStorage', (request, response) => {
            console.log('Remove Item From Storage Event');
            let service = new Service();
            service.removeItemFromStorage(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/MoveStorage', (request, response) => {
            console.log('Move Storage Event');
            let service = new Service();
            service.moveStorage(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/MoveItem', (request, response) => {
            console.log('Move Item Event');
            let service = new Service();
            service.moveItem(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('*', (request, response) => {
            console.log('Post request receieved');
        });
    }
}
module.exports = API_Post;