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
        
        // *
        expressApp.post('/NewComponent', (request, response) => {
            console.log('Create New Component Event');
            let service = new Service();
            service.newComponent(request, (result) => {
                this.sendResponse(response, result);
            });
        });
        
        // *
        expressApp.post('/NewPart', (request, response) => {
            console.log('Create New Part Event');
            let service = new Service();
            service.newPart(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // *
        expressApp.post('/NewProduct', (request, response) => {
            console.log('Create New Product Event');
            let service = new Service();
            service.newProduct(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // *
        expressApp.post('/GetComponentById', (request, response) => {
            console.log('Get Component By Id Event');
            let service = new Service();
            service.getComponentById(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // *
        expressApp.post('/GetComponentByName', (request, response) => {
            console.log('Get Component By Name Event');
            let service = new Service();
            service.getComponentByName(request, (result) => {
                this.sendResponse(response, result);
            });
        });
        
        // *
        expressApp.post('/GetComponentByType', (request, response) => {
            console.log('Get Component By Type Event');
            let service = new Service();
            service.getComponentByType(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // *
        expressApp.post('/GetComponentByDescription', (request, response) => {
            console.log('Get Component By Description Event');
            let service = new Service();
            service.getComponentByDescription(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // *
        expressApp.post('/GetPartBySerial', (request, response) => {
            console.log('Get Part By Serial Event');
            let service = new Service();
            service.getPartBySerial(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetPartByRohsCompliant', (request, response) => {
            console.log('Get Part By Rohs Compliance Event');
            let service = new Service();
            service.getPartByRohsCompliant(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetPartByValue', (request, response) => {
            console.log('Get Part By Value Event');
            let service = new Service();
            service.getPartByValue(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetPartByCurrency', (request, response) => {
            console.log('Get Part By Currency Event');
            let service = new Service();
            service.getPartByCurrency(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetProductBySerial', (request, response) => {
            console.log('Get Product By Serial Event');
            let service = new Service();
            service.getProductBySerial(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetProductByRohsCompliant', (request, response) => {
            console.log('Get Product By Rohs Compliance Event');
            let service = new Service();
            service.getProductByRohsCompliant(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetProductByValue', (request, response) => {
            console.log('Get Product By Value Event');
            let service = new Service();
            service.getProductByValue(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/GetProductByCurrency', (request, response) => {
            console.log('Get Product By Currency Event');
            let service = new Service();
            service.getProductByCurrency(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // *
        expressApp.post('/UpdateComponent', (request, response) => {
            console.log('Update Component Event');
            let service = new Service();
            service.updateComponent(request, (result) => {
                this.sendResponse(response, result);
            });
        });
        
        // *
        expressApp.post('/UpdatePart', (request, response) => {
            console.log('Update Part Event');
            let service = new Service();
            service.updatePart(request, (result) => {
                this.sendResponse(response, result);
            });
        });
        
        // *
        expressApp.post('/UpdateProduct', (request, response) => {
            console.log('Update Product Event');
            let service = new Service();
            service.updateProduct(request, (result) => {
                this.sendResponse(response, result);
            });
        });
        
        // *
        expressApp.post('/DeleteComponent', (request, response) => {
            console.log('Delete Component Event');
            let service = new Service();
            service.deleteComponent(request, (result) => {
                this.sendResponse(response, result);
            });
        });
        
        expressApp.post('/DeletePart', (request, response) => {
            console.log('Delete Component Event');
            let service = new Service();
            service.deletePart(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/DeleteProduct', (request, response) => {
            console.log('Delete Component Event');
            let service = new Service();
            service.deleteProduct(request, (result) => {
                this.sendResponse(response, result);
            });
        });
    
        expressApp.post('/AddPartToProduct', (request, response) => {
            console.log('Add Part To Product Event');
            let service = new Service();
            service.addPartToProduct(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('/RemovePartFromProduct', (request, response) => {
            console.log('Remove Part From Product Event');
            let service = new Service();
            service.removePartFromProduct(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        expressApp.post('*', (request, response) => {
            console.log('Post request receieved');
        });
    }
}
module.exports = API_Post;