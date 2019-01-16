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

        expressApp.post('/NewRequisition', (request, response) => {
            console.log('Create New Requisition Event');
            let service = new Service();
            service.newRequisition(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionById
        expressApp.post('/GetRequisitionById', (request, response) => {
            console.log('Get Requisition By Id Event');
            let service = new Service();
            service.getRequisitionById(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByRequestee
        expressApp.post('/GetRequisitionByRequestee', (request, response) => {
            console.log('Get Requisition By Requestee Event');
            let service = new Service();
            service.getRequisitionByRequestee(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByStatus
        expressApp.post('/GetRequisitionByStatus', (request, response) => {
            console.log('Get Requisition By Status Event');
            let service = new Service();
            service.getRequisitionByStatus(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByDepartment
        expressApp.post('/GetRequisitionByDepartment', (request, response) => {
            console.log('Get Requisition By Department Event');
            let service = new Service();
            service.getRequisitionByDepartment(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByLastUpdated
        expressApp.post('/GetRequisitionByLastUpdated', (request, response) => {
            console.log('Get Requisition By Last Updated Event');
            let service = new Service();
            service.getRequisitionByLastUpdated(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByLastUpdatedBy
        expressApp.post('/GetRequisitionByLastUpdatedBy', (request, response) => {
            console.log('Get Requisition By Last Updated By Event');
            let service = new Service();
            service.getRequisitionByLastUpdatedBy(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByDateApproved
        expressApp.post('/GetRequisitionByDateApproved', (request, response) => {
            console.log('Get Requisition By Date Approved Event');
            let service = new Service();
            service.getRequisitionByDateApproved(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByOrderedBy
        expressApp.post('/GetRequisitionByOrderedBy', (request, response) => {
            console.log('Get Requisition By Ordered By Event');
            let service = new Service();
            service.getRequisitionByOrderedBy(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByReceivedBy
        expressApp.post('/GetRequisitionByReceivedBy', (request, response) => {
            console.log('Get Requisition By Received By Event');
            let service = new Service();
            service.getRequisitionByReceivedBy(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByCompleted
        expressApp.post('/GetRequisitionByCompleted', (request, response) => {
            console.log('Get Requisition By Completed Event');
            let service = new Service();
            service.getRequisitionByCompleted(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // getRequisitionByDateCompleted
        expressApp.post('/GetRequisitionByDateCompleted', (request, response) => {
            console.log('Get Requisition By Date Completed Event');
            let service = new Service();
            service.getRequisitionByDateCompleted(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // updateRequisition
        expressApp.post('/UpdateRequisition', (request, response) => {
            console.log('Update Requisition Event');
            let service = new Service();
            service.updateRequisition(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // deleteRequisition
        expressApp.post('/DeleteRequisition', (request, response) => {
            console.log('Delete Requisition Event');
            let service = new Service();
            service.deleteRequisition(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // submitRequisition
        expressApp.post('/SubmitRequisition', (request, response) => {
            console.log('Submit Requisition Event');
            let service = new Service();
            service.submitRequisition(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // approveRequisition
        expressApp.post('/ApproveRequisition', (request, response) => {
            console.log('Requisition Approval Event');
            let service = new Service();
            service.approveRequisition(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // requisitionOrdered
        expressApp.post('/RequisitionOrdered', (request, response) => {
            console.log('Requisition Ordered Event');
            let service = new Service();
            service.requisitionOrdered(request, (result) => {
                this.sendResponse(response, result);
            });
        });

        // requisitionComplete
        expressApp.post('/RequisitionComplete', (request, response) => {
            console.log('Requisition Complete Event');
            let service = new Service();
            service.requisitionComplete(request, (result) => {
                this.sendResponse(response, result);
            });
        });
    
        expressApp.post('*', (request, response) => {
            console.log('Post request receieved');
        });

        expressApp.get('*', (request, response) => {
            console.log('Get request receieved');
        });
    }
}
module.exports = API_Post;