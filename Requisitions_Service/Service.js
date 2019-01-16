/** @static @private @description Data structure for Requisition business logic */
const Requisition = require("./Requisition");

/** @static @private @description Data structure for Component business logic */
const Component = require("./Component");

/** @static @private @description Data structure for Item business logic. */
const Item = require("./Item");

/** @static @private @description ServiceResult - Data structure for holding service processing result information */
const ServiceResult = require("./ServiceResult");

/** @static @private @description An adapter allowing for CRUD operations from Service to Database */
const mongoAdapter = require('./MongoAdapter');

/**
 * @class
 * @classdesc Provides orchestration of the tasks required to deliver the services offered by the applications API
 */
class Service {

    /**
     * @public
     * @description Zero Attribute Constructor
     */
    constructor() { }

    // Core Functionality

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to create a new Requisition from an HTTP request.
     *
     * Pre-Conditions: Request's body object must contain an attribute requestee, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect addition of new Requisition if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:      Message:                                                    Tested:
     * On Success:  (1) Success result - Requisition Created.                   
     *              (2) Partial - Created with some item(s) failure             
     * On Failure:  (3) No Requestee provided in request body.                  
     *              (4) Server error - Database connection.                     
     * 
     * Cyclomatic Complexity: ???
     */
    newRequisition(request, callback) {
        if(!this.hasValue(request.body.requestee)) { callback(new ServiceResult(3)); } 
        else {
            this.createRequisition(request.body, (requisition) => {
                let failedItems = [];
                if(this.hasValue(request.body.items)) {
                    let anArray = [];
                    try { anArray = JSON.parse(request.body.items); } 
                    catch(err) { console.log(err); }  // Add callback list incorrectly formatted
                    anArray.forEach(anItem => {
                        this.validateItem(anItem, (success) => {
                            if(!success) { failedItems.push(anItem); }
                            else { this.createItem(anItem, (item) => {
                                    requisition.addItem(item, () => {}); }); }
                            }); }); }
                        mongoAdapter.addRecord('Requisitions', requisition.getRequisition(), result => {
                        if(result) {
                        if(failedItems.length === 0) { callback(new ServiceResult(1)); } 
                        else { 
                            let sResult = new ServiceResult(2);
                            sResult.setMessage({'failedItems': failedItems});
                            callback(sResult);
                        }}
                    else { callback(new ServiceResult(4)); } 
                }); 
            });
        }
    }


    // 5 - No Id provided in request body
    getRequisitionById(request, callback) {
        if(!this.hasValue(request.body.id)) { callback(new ServiceResult(5)); }
        else {
            this.createRequisitonFromDatabaseById(request.body.id, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 3 - No Requestee
    getRequisitionByRequestee(request, callback) {
        if(!this.hasValue(request.body.requestee)) { callback(new ServiceResult(3)); }
        else {
            this.createRequisitonFromDatabaseByRequestee(request.body.requestee, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 8 - No Status
    getRequisitionByStatus(request, callback) {
        if(!this.hasValue(request.body.status)) { callback(new ServiceResult(8)); }
        else {
            this.createRequisitonFromDatabaseByStatus(request.body.status, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 9 - No Department
    getRequisitionByDepartment(request, callback) {
        if(!this.hasValue(request.body.department)) { callback(new ServiceResult(9)); }
        else {
            this.createRequisitonFromDatabaseByDepartment(request.body.department, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 10 - No lastUpdated
    getRequisitionByLastUpdated(request, callback) {
        if(!this.hasValue(request.body.lastUpdated)) { callback(new ServiceResult(10)); }
        else {
            this.createRequisitonFromDatabaseByLastUpdated(request.body.lastUpdated, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 11 - No lastUpdatedBy
    getRequisitionByLastUpdatedBy(request, callback) {
        if(!this.hasValue(request.body.lastUpdatedBy)) { callback(new ServiceResult(11)); }
        else {
            this.createRequisitonFromDatabaseByLastUpdatedBy(request.body.lastUpdatedBy, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 12 - No dateApproved
    getRequisitionByDateApproved(request, callback) {
        if(!this.hasValue(request.body.dateApproved)) { callback(new ServiceResult(12)); }
        else {
            this.createRequisitionFromDatabaseByDateApproved(request.body.dateApproved, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 13 - No orderedBy
    getRequisitionByOrderedBy(request, callback) {
        if(!this.hasValue(request.body.orderedBy)) { callback(new ServiceResult(13)); }
        else {
            this.createRequisitionFromDatabaseByOrderedBy(request.body.orderedBy, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 14 - No receivedBy
    getRequisitionByReceivedBy(request, callback) {
        if(!this.hasValue(request.body.receivedBy)) { callback(new ServiceResult(14)); }
        else {
            this.createRequisitionFromDatabaseByReceivedBy(request.body.receivedBy, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 15 - No completed
    getRequisitionByCompleted(request, callback) {
        if(!this.hasValue(request.body.completed)) { callback(new ServiceResult(15)); }
        else {
            this.createRequisitionFromDatabaseByCompleted(request.body.completed, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // 16 - No date completed
    getRequisitionByDateCompleted(request, callback) {
        if(!this.hasValue(request.body.dateCompleted)) { callback(new ServiceResult(16)); }
        else {
            this.createRequisitionFromDatabaseByDateCompleted(request.body.dateCompleted, (requisition) => {
                this.getRequisitionResponse(requisition, callback);
            });
        }
    }

    // Not Implemented
    getRequisitionByAwaitingItem(request, callback) {}

    // Not Implemented
    getRequisitionByReceivedItem(request, callback) {}

    // 5 - No Id
    // 17 - Provided Id does not exist
    // 18 - Successful update
    // 2 - Success with some failed items
    // 20 - All items failure
    // 4 - Database Error
    updateRequisition(request, callback) {
        if(!this.hasValue(request.body.id)) { callback(new ServiceResult(5)) }
        else {
            this.createRequisitonFromDatabaseById(request.body.id, (requisition) => {
                if(requisition === null) { callback(new ServiceResult(17)) }
                else {
                    successfulItems = [];
                    failedItems = [];
                    let i = 0;
                    request.body.items.forEach(anItem => {
                        this.validateItem(anItem, (success) => {
                            if(!success) { failedItems.push(anItem); }
                            else { this.createItem(anItem, (item) => {
                                successfulItems.push(item);
                            }); } });
                        i++;
                        if(i >= request.body.items.length) {
                            requisition.setItems(successfulItems);
                            mongoAdapter.updateRecord('Requisitions', { '_id': request.body.id }, 
                                requisition.getRequisition(), (result) => {
                                    if(result && failedItems.length === 0) { callback(new ServiceResult(18)); }
                                    else if(result && failedItems.length >= 1) { callback(new ServiceResult(2)); }
                                    else if(failedItems.length === request.body.items.length) { callback(new ServiceResult(20)); }
                                    else { callback(new ServiceResult(4)); 
                                }
                            });  
                        }
                    });
                }
            });
        }
    }

    // 5 - No Id
    // 17 - Provided Id does not exist
    // 21 - Deletion Success
    // 4 - Database error
    deleteRequisition(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(5)); }
        else {
            mongoAdapter.findRecord('Requisitions', { '_id': request.body.id }, (result) => {
                if (!result) { callback(new ServiceResult(17)); }
                else {
                    mongoAdapter.deleteRecord('Requisitions', { '_id': request.body.id }, (result) => {
                        if (result) { callback(new ServiceResult(21)); }
                        else { callback(new ServiceResult(4)); }
                    });
                }
            });
        }
    }

    // 5 - No Id
    // 17 - Provided Id does not exist
    // 22 - Submission Success
    // 4 - Database error
    submitRequisition(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(5)); }
        else { 
            mongoAdapter.findRecord('Requisitions', { '_id': request.body.id }, (requisition) => {
                if (!requisition) { callback(new ServiceResult(17)); }
                else {
                    requisition.submit(request.body.user, () => {
                        mongoAdapter.updateRecord('Requisitions', { '_id': request.body.id }, requisition.getRequisition(), 
                        (result) => {
                            if (result) { callback(new ServiceResult(22)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    });
                }
            });
        }
    }

    // 5 - No Id
    // 17 - Provided Id does not exist
    // 23 - Approval Success
    // 4 - Database error
    approveRequisition(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(5)); }
        else { 
            mongoAdapter.findRecord('Requisitions', { '_id': request.body.id }, (requisition) => {
                if (!requisition) { callback(new ServiceResult(17)); }
                else {
                    requisition.approve(request.body.user, () => {
                        mongoAdapter.updateRecord('Requisitions', { '_id': request.body.id }, requisition.getRequisition(), 
                        (result) => {
                            if (result) { callback(new ServiceResult(23)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    });
                }
            });
        }
    }

    // 5 - No Id
    // 17 - Provided Id does not exist
    // 24 - Ordered Success
    // 4 - Database error
    requisitionOrdered(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(5)); }
        else { 
            mongoAdapter.findRecord('Requisitions', { '_id': request.body.id }, (requisition) => {
                if (!requisition) { callback(new ServiceResult(17)); }
                else {
                    requisition.ordered(request.body.user, () => {
                        mongoAdapter.updateRecord('Requisitions', { '_id': request.body.id }, requisition.getRequisition(), 
                        (result) => {
                            if (result) { callback(new ServiceResult(24)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    });
                }
            });
        }
    }

    // 5 - No Id
    // 17 - Provided Id does not exist
    // 25 - Completed Success
    // 4 - Database error
    requisitionComplete(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(5)); }
        else { 
            mongoAdapter.findRecord('Requisitions', { '_id': request.body.id }, (requisition) => {
                if (!requisition) { callback(new ServiceResult(17)); }
                else {
                    requisition.complete(request.body.user, () => {
                        mongoAdapter.updateRecord('Requisitions', { '_id': request.body.id }, requisition.getRequisition(), 
                        (result) => {
                            if (result) { callback(new ServiceResult(25)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    });
                }
            });
        }
    }

    // Helper Methods

    // 2 - {Object}
    // 7 - None
    getRequisitionResponse(requisition, callback) {
        if(requisition !== null) {
            let sResult = new ServiceResult(2);
            sResult.setMessage(requisition.getRequisition());
            callback(sResult);
        }
        else { callback(new ServiceResult(7)); }
    }

    createRequisition(item, callback) {
        let req = new Requisition();
        if(this.isDefined(item._id)) { item.id = item._id; }
        req.setId(this.isDefined(item.id));
        req.setRequestee(item.requestee);
        req.setLastUpdatedBy(this.isDefined(item.lastUpdatedBy));
        callback(req);
    }
    
    createRequisitions(anArray, callback) {
        if(!Array.isArray(anArray)) {
            if(anArray !== null) { this.createRequisition(anArray, (result) => { callback(result); }); }
            else { callback(null); } }
        else {
            let requisitions = [];
            let i = 0;
            anArray.forEach(req => {
                i++;
                this.createRequisition(req, (result) => {
                    requisitions.push(result.getRequisition());
                    if(i >= anArray.length) { callback(requisitions); }
                });
            });
        }
    }
    
    validateItem(anItem, callback) {
        let success = false;
        if(  this.hasValue(anItem.id) ) { success = true; }
        else if ( this.hasValue(anItem.name) &&  
                  this.hasValue(anItem.description)) { success = true; } 
        else { success = false; }
        callback(success);
    }

    createItem(item, callback) {
        let i = new Item();
        i.setId(item.id);
        i.setName(item.name);
        i.setType(this.isDefined(item.type));
        i.setDescription(item.description);
        if(i.quantity > 1) { i.setQuantity(item.quantity); }
        callback(i);
    }
    
    // Not Implementing
    createItems() {}

    createRequisitionFromDatabase(result, callback) {
        if(result === null) { callback(null); }
        else {
            this.createRequisition(result, (requistion) => {
                callback(requisition);
            });
        }
    }

    createRequisitonFromDatabaseById(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { '_id': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitonFromDatabaseByRequestee(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'requestee': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitonFromDatabaseByStatus(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'status': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitonFromDatabaseByDepartment(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'department': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitonFromDatabaseByLastUpdated(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'lastUpdated': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitonFromDatabaseByLastUpdatedBy(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'lastUpdatedBy': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitionFromDatabaseByDateApproved(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'dateApproved': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitionFromDatabaseByOrderedBy(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'orderedBy': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitionFromDatabaseByReceivedBy(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'receivedBy': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitionFromDatabaseByCompleted(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'completed': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    createRequisitionFromDatabaseByDateCompleted(aValue, callback) {
        mongoAdapter.findRecord('Requisitions', { 'dateCompleted': aValue }, (result) => {
            this.createRequisitionFromDatabase(result, callback);
        });
    }

    // Not Implementing
    createRequisitionFromDatabaseByAwaitingItem() {}

    // Not Implementing
    createRequisitionFromDatabaseByReceivedItem() {}

    /**
     * @private
     * @param {String} value A String
     * @returns {Boolean}
     * @description Determines if a String is defined and has a value assigned to it.
     * 
     * Pre-Conditions: None
     * 
     * Post-Conditions: A Boolean true is returned if value is defined and is not empty, else false.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    hasValue(aValue) { 
        return (typeof aValue !== 'undefined' && aValue);
    }
    
    /**
     * @private
     * @param {String} aValue A string
     * @returns {String} an unmodified or empty String
     * @description Determines if a String is undefined and sets it to an empty String if true.
     * 
     * Pre-Conditions: None
     * 
     * Post-Conditions: An unchanged String value or empty String is returned.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    isDefined(aValue) { 
        if (typeof aValue === 'undefined') { aValue = ''; }
        return aValue;
    }

    // Not Implementing
    setObjectUpdateValues(obj, request, callback) {}

}

module.exports = Service;