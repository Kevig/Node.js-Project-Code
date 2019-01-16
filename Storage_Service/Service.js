/** @static @private @description Data structure for Storage business logic */
const Storage = require("./Storage");

/** @static @private @description Data structure for product business logicClass variables declarations. */
const Location = require("./Location");

/** @static @private @description Data structure for part business logic. */
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
     * @description Attempts to create a new Location from an HTTP request.
     *
     * Pre-Conditions: Request's body object must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect addition of new Location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:      Message:                                                    Tested:
     * On Success:  (1) Success result - Location Created.                      Yes
     * On Failure:  (2) No Id provided in request body.                         Yes
     *              (3) Specified Location with given Id already exists.        Yes
     *              (4) Server error - Database connection.                     No
     * 
     * Cyclomatic Complexity: ???
     */
    newLocation(request, callback) { 
        if(!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createLocation(request.body, (location) => {
                mongoAdapter.findRecord('Locations', { 'id': location.getId() }, (result) => {
                    if(result !== null) { callback(new ServiceResult(3)); }
                    else {
                        mongoAdapter.addRecord('Locations', location.getLocation(), (result) => {
                            if (result) { callback(new ServiceResult(1)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    }
                });
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to create a new Storage from an HTTP request.
     *
     * Pre-Conditions: Request's body object must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect addition of new Storage if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:      Message:                                                    Tested:
     * On Success:  (5) Success result - Storage Created.                       Yes
     * On Failure:  (2) No Id provided in request body.                         Yes
     *              (6) Specified Storage with given Id already exists.         Yes
     *              (4) Server error - Database connection.                     No
     * 
     * Cyclomatic Complexity: ???
     */
    newStorage(request, callback) { 
        if(!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createStorage(request.body, (storage) => {
                mongoAdapter.findRecord('Stores', { 'id': storage.getId() }, (result) => {
                    if(result !== null) { callback(new ServiceResult(6)); }
                    else {
                        mongoAdapter.addRecord('Stores', storage.getStorage(), (result) => {
                            if (result) { callback(new ServiceResult(5)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    }
                });
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to create a new Item from an HTTP request.
     *
     * Pre-Conditions: Request's body object must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect addition of new Item if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:      Message:                                                    Tested:
     * On Success:  (7) Success result - Item Created.                          Yes
     * On Failure:  (2) No Id provided in request body.                         Yes
     *              (8) Specified Item with given Id already exists.            Yes
     *              (4) Server error - Database connection.                     No
     * 
     * Cyclomatic Complexity: ???
     */
    newItem(request, callback) { 
        if(!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createItem(request.body, (item) => {
                mongoAdapter.findRecord('Items', { 'id': item.getId() }, (result) => {
                    if(result !== null) { callback(new ServiceResult(8)); }
                    else {
                        mongoAdapter.addRecord('Items', item.getItem(), (result) => {
                            if (result) { callback(new ServiceResult(7)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    }
                });
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find a location with an Id matching the Id provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a JSON formatted location if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (9) {Object}                                            Yes
     *                  (10) None                                               Yes
     * On Failure:      (2)  An Id not provided in request body.                Yes
     * 
     * Cyclomatic Complexity: ???
     */
    getLocationById(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createLocationFromDatabaseById(request.body.id, (location) => {
                if (location !== null) {
                    let serviceResult = new ServiceResult(9);
                    serviceResult.setMessage(location.getLocation());
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(10)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find locations with a description matching the description provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute description, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted locations if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (9) {Object}                                            Yes
     *                  (10) None                                               Yes
     * On Failure:      (11)  A Description not provided in request body.       Yes
     * 
     * Cyclomatic Complexity: ???
     */
    getLocationByDescription(request, callback) {
        if (!this.hasValue(request.body.description)) { callback(new ServiceResult(11)); }
        else {
            this.createLocationFromDatabaseByDescription(request.body.description, (locations) => {
                if (locations !== null) {
                    let serviceResult = new ServiceResult(9);
                    serviceResult.setMessage(locations);
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(10)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find a storage with an Id matching the Id provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a JSON formatted storage if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (9) {Object}                                            Yes
     *                  (10) None                                               Yes
     * On Failure:      (2)  An Id not provided in request body.                Yes
     * 
     * Cyclomatic Complexity: ???
     */
    getStorageById(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createStorageFromDatabaseById(request.body.id, (storage) => {
                if (storage !== null) {
                    let serviceResult = new ServiceResult(9);
                    serviceResult.setMessage(storage.getStorage());
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(10)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find storage with a Description matching the Description provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute description, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted storage if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (9) {Object}                                            Yes
     *                  (10) None                                               Yes
     * On Failure:      (11) A description not provided in request body.        Yes     
     * 
     * Cyclomatic Complexity: ???
     */
    getStorageByDescription(request, callback) { 
        if (!this.hasValue(request.body.description)) { callback(new ServiceResult(11)); }
        else {
            this.createStorageFromDatabaseByDescription(request.body.description, (stores) => {
                if (stores !== null) {
                    let serviceResult = new ServiceResult(9);
                    serviceResult.setMessage(stores);
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(10)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find storage with a Type matching the Type provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute type, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted storage if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (9) {Object}                                            Yes
     *                  (10) None                                               Yes
     * On Failure:      (12) A type not provided in request body.               Yes
     * 
     * Cyclomatic Complexity: ???
     */
    getStorageByType(request, callback) { 
        if (!this.hasValue(request.body.type)) { callback(new ServiceResult(12)); }
        else {
            this.createStorageFromDatabaseByType(request.body.type, (stores) => {
                if (stores !== null) {
                    let serviceResult = new ServiceResult(9);
                    serviceResult.setMessage(stores);
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(10)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find a item with an Id matching the Id provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a JSON formatted item if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (9) {Object}                                            Yes
     *                  (10) None                                               Yes
     * On Failure:      (2)  An Id not provided in request body.                Yes
     * 
     * Cyclomatic Complexity: ???
     */
    getItemById(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createItemFromDatabaseById(request.body.id, (item) => {
                if (item !== null) {
                    let serviceResult = new ServiceResult(9);
                    serviceResult.setMessage(item.getItem());
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(10)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find Items with a Type matching the Type provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute type, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted Items if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (9) {Object}                                            Yes
     *                  (10) None                                               Yes
     * On Failure:      (12) A type not provided in request body.               Yes
     * 
     * Cyclomatic Complexity: ???
     */
    getItemByType(request, callback) { 
        if (!this.hasValue(request.body.type)) { callback(new ServiceResult(12)); }
        else {
            this.createItemFromDatabaseByType(request.body.type, (items) => {
                if (items !== null) {
                    let serviceResult = new ServiceResult(9);
                    serviceResult.setMessage(items);
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(10)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to Update a Location matching a provided Id with values provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of Location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a String 'Succesfully Updated' if successful
     *                  The message of ServiceResult will contain a String with a reason if unsuccessful
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (14) Location Successfully Updated                      Yes
     * On Failure:      (2)  No Id Found in Request Body                        Yes
     *                  (13) Location with Provided Id does not exist           Yes
     *                  (4)  Server Error - Database Connection                 No
     * 
     * Cyclomatic Complexity: ???
     */
    updateLocation(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createLocationFromDatabaseById(request.body.id, (location) => { 
                if (location === null) { callback(new ServiceResult(13)); }
                else {
                    this.setObjectUpdateValues(location, request, (location) => {
                        mongoAdapter.updateRecord('Locations', { 'id': request.body.id }, location.getLocation(), (result) => {
                            if(result) { callback(new ServiceResult(14)); }
                            else { callback(new ServiceResult(4)); }
                        });                        
                    });
                }
            })
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to Update a Storage matching a provided Id with values provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of Location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a String 'Succesfully Updated' if successful
     *                  The message of ServiceResult will contain a String with a reason if unsuccessful
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (16) Storage Successfully Updated                       Yes
     * On Failure:      (2)  No Id Found in Request Body                        Yes
     *                  (15) Storage with Provided Id already exists            No
     *                  (6)  Storage with Provided Id does not exist            Yes
     *                  (4)  Server Error - Database Connection                 No
     * 
     * Cyclomatic Complexity: ???
     */
    updateStorage(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createStorageFromDatabaseById(request.body.id, (storage) => { 
                if (storage === null) { callback(new ServiceResult(15)); }
                else {
                    this.setObjectUpdateValues(storage, request, (storage) => {
                        let update = (storage.getId() === request.body.id);
                        let success = false;
                        if(update) {
                            // Same Id Update Storage Only
                            mongoAdapter.updateRecord('Stores', { 'id': request.body.id }, storage.getStorage(), 
                            (result) => { success = result; }); }
                        else {
                            mongoAdapter.findRecord('Stores', { 'id': storage.getId() }, (result) => {
                                if (result === null) {
                                    mongoAdapter.updateRecord('Stores', { 'id': request.body.id }, storage.getStorage(),
                                    (result) => { success = result; }); }
                                else { callback(new ServiceResult(6)); }
                            });
                        }
                        // Cascade to locations
                        mongoAdapter.findRecords('Locations', { 'items': request.body.id }, (locations) => {
                            if(locations.length === 0) { callback(new ServiceResult(16)); }
                            else {
                                locations.forEach(location => {
                                    let items = location.items;
                                    let newStores = [];
                                    let i = 0;
                                    items.forEach(id => {
                                        i++;
                                        if(id === request.body.id) { 
                                            if(request.body.newId !== "") { id = request.body.newId; }
                                        }
                                        newStores.push(id);
                                        if(i >= items.length) {
                                            mongoAdapter.updateRecord('Locations', { '_id': location._id }, { 'items': newStores },
                                            (result) => {
                                                if (success) { callback(new ServiceResult(16)); }
                                                else { callback(new ServiceResult(4)); }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                }                                               
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to Update an Item matching a provided Id with values provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of Location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a String 'Succesfully Updated' if successful
     *                  The message of ServiceResult will contain a String with a reason if unsuccessful
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (18) Item Successfully Updated                          Yes
     * On Failure:      (2)  No Id Found in Request Body                        Yes
     *                  (8)  Item with Provided Id already exists               No
     *                  (17) Item with Provided Id does not exist               Yes
     *                  (4)  Server Error - Database Connection                 No
     * 
     * Cyclomatic Complexity: ???
     */
    updateItem(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createItemFromDatabaseById(request.body.id, (item) => { 
                if (item === null) { callback(new ServiceResult(17)); }
                else {
                    this.setObjectUpdateValues(item, request, (item) => {
                        let update = (item.getId() === request.body.id);
                        let success = false;
                        if(update) {
                            // Same Id Update Item Only
                            mongoAdapter.updateRecord('Items', { 'id': request.body.id }, item.getItem(), 
                            (result) => { success = result; });
                        }
                        else {
                            mongoAdapter.findRecord('Items', { 'id': item.getId() }, (result) => {
                                if (result === null) {
                                    mongoAdapter.updateRecord('Items', { 'id': request.body.id }, item.getItem(),
                                    (result) => { success = result; });
                                }
                                else { callback(new ServiceResult(8)); }
                            });
                        }
                        // Cascade to Stores
                        mongoAdapter.findRecords('Stores', { 'items': request.body.id }, (stores) => {
                            if(stores.length === 0) { callback(new ServiceResult(18)); }
                            else {
                                stores.forEach(store => {
                                    let items = store.items;
                                    let newStores = [];
                                    let i = 0;
                                    items.forEach(id => {
                                        i++;
                                        if(id === request.body.id) { 
                                            if(request.body.newId !== "") { id = request.body.newId; }
                                        }
                                        newStores.push(id);
                                        if(i >= items.length) {
                                            mongoAdapter.updateRecord('Stores', { '_id': store._id }, { 'items': newStores },
                                            (result) => {
                                                if (success) { callback(new ServiceResult(18)); }
                                                else { callback(new ServiceResult(4)); }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                }                                               
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object
     * @description Attempts to delete a Location with an Id value provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute Id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of Location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (20) Location successfully deleted.                     Yes
     * On Failure:      (2)  No id provided in request body.                    Yes
     *                  (13) Location with Provided Id does not exist           Yes
     *                  (19) Storage is linked to Location, cannot delete.      Yes
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: ???
     */
    deleteLocation(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            mongoAdapter.findRecord('Locations', { 'id': request.body.id }, (result) => {
                if (!result) { callback(new ServiceResult(13)); }
                else {
                    if(result.items.length !== 0) { callback(new ServiceResult(19)); }
                    else {
                        mongoAdapter.deleteRecord('Locations', { 'id': request.body.id }, (result) => {
                            if (result) { callback(new ServiceResult(20)); }
                            else { callback(new ServiceResult(4)); }
                        });
                    }
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object
     * @description Attempts to delete a Storage with an Id value provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute Id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of Storage if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (22) Storage successfully deleted.                      Yes
     * On Failure:      (2)  No id provided in request body.                    Yes
     *                  (15) Storage with Provided Id does not exist            Yes
     *                  (21) Item(s) are linked to Storage, cannot delete.      Yes
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: ???
     */
    deleteStorage(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            mongoAdapter.findRecord('Stores', { 'id': request.body.id }, (result) => {
                if (!result) { callback(new ServiceResult(15)); }
                else {
                    if(result.items.length !== 0) { callback(new ServiceResult(21)); }
                    else {
                        mongoAdapter.deleteRecord('Stores', { 'id': request.body.id }, (result) => {
                            if(!result) { callback(new ServiceResult(4)); }
                            else { 
                                // Cascade to Locations -> Utilise Remove Storage from location...
                                mongoAdapter.findRecords('Locations', { 'items': request.body.id }, (locations) => {
                                    if(locations.length === 0) { callback(new ServiceResult(22)); }
                                    else {
                                        locations.forEach(location => {
                                            let items = location.items;
                                            let i = 0;
                                            items.forEach(id => {
                                                if(id === request.body.id) { items.splice(i,1); }
                                                i++;
                                                if(i >= items.length) {
                                                    mongoAdapter.updateRecord('Locations', { '_id': location._id }, { 'items': items },
                                                    (result) => {
                                                        if (result) { callback(new ServiceResult(22)); }
                                                        else { callback(new ServiceResult(4)); }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object
     * @description Attempts to delete an Item with an Id value provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute Id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of Item if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (23) Item successfully deleted.                         Yes
     * On Failure:      (2)  No id provided in request body.                    Yes
     *                  (17) Item with Provided Id does not exist               Yes
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: ???
     */
    deleteItem(request, callback) { 
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            mongoAdapter.findRecord('Items', { 'id': request.body.id }, (result) => {
                if (!result) { callback(new ServiceResult(17)); }
                else {
                    mongoAdapter.deleteRecord('Items', { 'id': request.body.id }, (result) => {
                        if (!result) { callback(new ServiceResult(4)); }
                        else {
                            // Cascade to Stores -> Utilise Remove Item from storage...
                            mongoAdapter.findRecords('Stores', { 'items': request.body.id }, (stores) => {
                                if(stores.length === 0) { callback(new ServiceResult(23)); }
                                else {
                                    stores.forEach(store => {
                                        let items = store.items;
                                        let i = 0;
                                        items.forEach(id => {
                                            if(id === request.body.id) { items.splice(i,1); }
                                            i++;
                                            if(i >= items.length) {
                                                mongoAdapter.updateRecord('Stores', { '_id': store._id }, { 'items': items },
                                                (result) => {
                                                    if (result) { callback(new ServiceResult(23)); }
                                                    else { callback(new ServiceResult(4)); }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object
     * @description Attempts to add a Storage to a Location by Storage and Location ids provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain attributes id and storageId, which must have values.
     * 
     * Post-Conditions: Database updated to reflect addition of storage to location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (26) Storage Successfull added to location              Yes
     * On Failure:      (24) No location or storage id provided in request.     Yes
     *                  (13) Location with provided id does not exist.          Yes
     *                  (15) Storage with provided id does not exist.           Yes
     *                  (25) Storage already exists in Location.                Yes
     *                  (4)  Server error - Database connection.                No.                
     * 
     * Cyclomatic Complexity: ???
     */
    addStorageToLocation(request, callback) { 
        if (!this.hasValue(request.body.id) || !this.hasValue(request.body.storageId)) { callback(new ServiceResult(24)); }
        else {
            this.createLocationFromDatabaseById(request.body.id, (result) => {
                if (!result) { callback(new ServiceResult(13)); }
                else {
                    this.createStorageFromDatabaseById(request.body.storageId, (result) => {
                        if (!result) { callback(new ServiceResult(15)); }
                        else {
                            mongoAdapter.findRecord('Locations', { 'items': request.body.storageId }, (result) => {
                                if(result !== null) { result = result.items.includes(request.body.storageId); }
                                if(result) { callback(new ServiceResult(25)); }
                                else {
                                    mongoAdapter.addToCollectionArray('Locations', { 'id': request.body.id },
                                    { 'items': request.body.storageId },
                                    (result) => {
                                        if (result) { callback(new ServiceResult(26)); }
                                        else { callback(new ServiceResult(4)); }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object
     * @description Attempts to add an item to a storage by item and storage ids provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain attributes id and itemId, which must have values.
     * 
     * Post-Conditions: Database updated to reflect addition of item to storage if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (29) Item added to Storage.                             Yes
     * On Failure:      (25) No Item or Storage id provided in request.         Yes
     *                  (17) Item with provided id does not exist.              Yes
     *                  (15) Storage with provided id does not exist.           Yes
     *                  (28) Item already exists in Storage.                    Yes
     *                  (4)  Server error - Database connection.                No.                
     * 
     * Cyclomatic Complexity: ???
     */
    addItemToStorage(request, callback) { 
        if (!this.hasValue(request.body.id) || !this.hasValue(request.body.itemId)) { callback(new ServiceResult(27)); }
        else {
            this.createStorageFromDatabaseById(request.body.id, (result) => {
                if (!result) { callback(new ServiceResult(15)); }
                else {
                    this.createItemFromDatabaseById(request.body.itemId, (result) => {
                        if (!result) { callback(new ServiceResult(17)); }
                        else {
                            mongoAdapter.findRecord('Stores', { 'items': request.body.itemId }, (result) => {
                                if(result !== null) { result = result.items.includes(request.body.itemId); }
                                if(result) { callback(new ServiceResult(28)); }
                                else {
                                    mongoAdapter.addToCollectionArray('Stores', { 'id': request.body.id },
                                    { 'items': request.body.itemId },
                                    (result) => {
                                        if (result) { callback(new ServiceResult(29)); }
                                        else { callback(new ServiceResult(4)); }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to remove a Storage from a Location by Location and Storage ids provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain attributes id and storageId, which must have values.
     * 
     * Post-Conditions: Database updated to reflect removal of Storage from Location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (30) Storage removed from Location.                     Yes
     * On Failure:      (24) No Location or Storage id provided in request.     Yes
     *                  (13) Location with provided id does not exist.          Yes
     *                  (4)  Server error - Database connection.                No.                
     * 
     * Cyclomatic Complexity: ???
     */
    removeStorageFromLocation(request, callback) { 
        if (!this.hasValue(request.body.id) || !this.hasValue(request.body.storageId)) { callback(new ServiceResult(24)); }
        else {
            this.createLocationFromDatabaseById(request.body.id, (result) => {
                if (!result) { callback(new ServiceResult(13)); }
                else {
                    // TODO - Currently does not check if item being removed exists, though not nessecery for function
                    // Is required for User feedback purposes...
                    mongoAdapter.removeFromCollectionArray('Locations', { 'id': request.body.id }, { 'items': request.body.storageId },
                    (result) => {
                        if (result) { callback(new ServiceResult(30)); }
                        else { callback(new ServiceResult(4)); }
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to remove a Storage from a Location by Location and Storage ids provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain attributes id and storageId, which must have values.
     * 
     * Post-Conditions: Database updated to reflect removal of Storage from Location if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (31) Item removed from storage.                         Yes
     * On Failure:      (27) No Item or Storage id provided in request.         Yes
     *                  (15) Storage with provided id does not exist.           Yes
     *                  (4)  Server error - Database connection.                No.                
     * 
     * Cyclomatic Complexity: ???
     */
    removeItemFromStorage(request, callback) { 
        if (!this.hasValue(request.body.id) || !this.hasValue(request.body.itemId)) { callback(new ServiceResult(27)); }
        else {
            this.createStorageFromDatabaseById(request.body.id, (result) => {
                if (!result) { callback(new ServiceResult(15)); }
                else {
                    // TODO - Currently does not check if item being removed exists, though not nessecery for function
                    // Is required for User feedback purposes...
                    mongoAdapter.removeFromCollectionArray('Stores', { 'id': request.body.id }, { 'items': request.body.itemId },
                    (result) => {
                        if (result) { callback(new ServiceResult(31)); }
                        else { callback(new ServiceResult(4)); }
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to move a Storage from a Location to another Location by ids provided in request's body.
     *              Utilises 'removeStorageFromLocation' and 'addStorageToLocation' and there respective response's
     * 
     * Pre-Conditions:  Request's body must contain attributes id and oldLocationId and newLocationId, which must have values.
     * 
     * Post-Conditions: Database updated to reflect moving of Storage if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (32) Storage Moved                                      Yes
     * On Failure:      Refer to : 'removeStorageFromLocation'
     *                             'addStorageToLocation'
     * 
     * Cyclomatic Complexity: ???
     */
    moveStorage(request, callback) { 
        let removeRequest = { body: { id: request.body.oldLocationId, storageId: request.body.id } };
        let addRequest = { body: { id: request.body.newLocationId, storageId: request.body.id } };
        
        this.removeStorageFromLocation(removeRequest, (result) => {
            if(result.code !== 200) { callback(result); }
            else {
                this.addStorageToLocation(addRequest, (result) => {
                    if(result.code === 200) { callback(new ServiceResult(32)); }
                    else {
                        // Revert to original state
                        this.addStorageToLocation(removeRequest, (result) => {});
                    } 
                });
            }
        });
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to move an Item from a Storage to another Storage by ids provided in request's body.
     *              Utilises 'removeItemFromStorage' and 'addItemToStorage' and there respective response's
     * 
     * Pre-Conditions:  Request's body must contain attributes id and oldStorageId and newStorageId, which must have values.
     * 
     * Post-Conditions: Database updated to reflect moving of Item if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (33) Item Moved                         
     * On Failure:      Refer to : 'removeItemFromStorage'
     *                             'addItemToStorage'
     * 
     * Cyclomatic Complexity: ???
     */
    moveItem(request, callback) { 
        let removeRequest = { body: { id: request.body.oldStorageId, itemId: request.body.id } };
        let addRequest = { body: { id: request.body.newStorageId, itemId: request.body.id } };
        
        this.removeItemFromStorage(removeRequest, (result) => {
            if(result.code !== 200) { callback(result); }
            else {
                this.addItemToStorage(addRequest, (result) => {
                    if(result.code === 200) { callback(new ServiceResult(33)); }
                    else {
                        // Revert to original state
                        this.addItemToStorage(removeRequest, (result) => {});
                    } 
                });
            }
        });
    }

    // Helper Methods

    /**
     * @private
     * @param {Object} container An object referencing the subclasses Location or Storage, of superclass Container
     * @param {Object} item An object referencing a Request objects body object
     * @param {Function} callback A function accepting an object.
     * @description Sets the values of a new instance of a container subclass to the values in item.
     * 
     * Pre-Conditions: callback must be a function accepting an object
     *                 item is a reference to a Request objects body object.
     *                 container must be an object of type Location, Storage or Item
     * 
     * Post-Conditions: An updated object is returned with the shared attributes of Location and Storage values set
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createContainer(container, item, callback) {
        container.setId(item.id);
        container.setDescription(item.description);
        container.setItems(item.items);
        callback(container);
    }

    /**
     * @private
     * @param {Object} item An object referencing a Request objects body object
     * @param {Function} callback A function accepting an object.
     * @description Creates a new instance of a Location and sets its values to the values in item.
     * 
     * Pre-Conditions: callback must be a function accepting an object
     *                 item is a reference to a Request objects body object.
     * 
     * Post-Conditions: A new Location is created with values set to those referenced in item.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createLocation(item, callback) {
        let location = new Location();
        this.createContainer(location, item, (location) => {
            callback(location);
        });
    }

    /**
     * @private
     * @param {Object} item An object referencing a Request objects body object
     * @param {Function} callback A function accepting an object.
     * @description Creates a new instance of a Storage and sets its values to the values in item.
     * 
     * Pre-Conditions: callback must be a function accepting an object
     *                 item is a reference to a Request objects body object.
     * 
     * Post-Conditions: A new Storage is created with values set to those referenced in item.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createStorage(item, callback) {
        let storage = new Storage();
        storage.setType(item.type);
        this.createContainer(storage, item, (storage) => {
            callback(storage);
        });
    }
    
    /**
     * @private
     * @param {Object} anItem An object referencing a Request objects body object
     * @param {Function} callback A function accepting an object.
     * @description Creates a new instance of an Item and sets its values to the values in anItem.
     * 
     * Pre-Conditions: callback must be a function accepting an object
     *                 anItem is a reference to a Request objects body object.
     * 
     * Post-Conditions: A new Item is created with values set to those referenced in anItem.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createItem(anItem, callback) { 
        let item = new Item();
        item.setId(anItem.id);
        item.setType(anItem.type);
        callback(item);
    }

    /**
     * @private
     * @param {String} table A string representing the name of a database collection
     * @param {String} anId A string representing an id of a Location, Storage or Item
     * @param {Function} nullCallback A function accepting a null Object
     * @param {Function} callback A function accepting an Object
     * @description Attempts to create an Object from data stored on the database referenced by anId.
     * 
     * Pre-Conditions: callback must be a function accepting an object
     *                 anId is of type String with a value referencing the id of a Location, Storage or Item
     *                 table is a String representing the name of a database collection or table
     *                 nullCallback must be a function accepting null
     * 
     * Post-Conditions: a new Object is created with values set to those stored in the database referenced by anId
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createFromDatabaseById(table, anId, nullCallback, callback) {
        mongoAdapter.findRecord(table, { 'id': anId }, (result) => {
            if(result === null) { nullCallback(null); }
            else { callback(result); }
        });
    }

    /**
     * @private
     * @param {String} table A string representing the name of a database collection
     * @param {String} aDescription A string representing a description of a Location, Storage or Item
     * @param {Function} nullCallback A function accepting a null Object
     * @param {Function} callback A function accepting an Object
     * @description Attempts to create an Object from data stored on the database referenced by aDescription.
     * 
     * Pre-Conditions: callback must be a function accepting an object
     *                 aDescription is of type String with a value referencing the description of a Location, Storage or Item
     *                 table is a String representing the name of a database collection or table
     *                 nullCallback must be a function accepting null
     * 
     * Post-Conditions: a new Object is created with values set to those stored in the database referenced by aDescription
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createFromDatabaseByDescription(table, aDescription, nullCallback, callback) {
        mongoAdapter.findRecord(table, { 'description': aDescription }, (result) => {
            if(result === null) { nullCallback(null); }
            else { callback(result); }
        });
    }

    /**
     * @private
     * @param {String} table A string representing the name of a database collection
     * @param {String} aType A string representing a type of either Storage or Item
     * @param {Function} nullCallback A function accepting a null Object
     * @param {Function} callback A function accepting an Object
     * @description Attempts to create an Object from data stored on the database referenced by type.
     * 
     * Pre-Conditions: callback must be a function accepting an object
     *                 aType is of type String with a value referencing the type of a Storage or Item
     *                 table is a String representing the name of a database collection or table
     *                 nullCallback must be a function accepting null
     * 
     * Post-Conditions: a new Object is created with values set to those stored in the database referenced by aType
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createFromDatabaseByType(table, aType, nullCallback, callback) {
        mongoAdapter.findRecord(table, { 'type': aType }, (result) => {
            if(result === null) { nullCallback(null); }
            else { callback(result); }
        });
    }

    /**
     * @private
     * @param {String} anId A string representing the id of a Location
     * @param {Function} callback A function accepting a Location object.
     * @description Attempts to create a Location from data stored on the database referenced by Id.
     * 
     * Pre-Conditions: callback must be a function accepting an object of id Location.
     *                 anId is of type String with a value referencing the id of Location.
     * 
     * Post-Conditions: new Location(s) are created with values set to those stored in the database referenced by an id
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createLocationFromDatabaseById(anId, callback) { 
        this.createFromDatabaseById('Locations', anId, callback, (result) => {
            this.createLocation(result, (location) => {
                callback(location);
            });
        });
    }

    /**
     * @private
     * @param {String} aDescription A string representing the description of a Location
     * @param {Function} callback A function accepting a Location object.
     * @description Attempts to create a Location from data stored on the database referenced by description.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Location.
     *                 aDescription is of type String with a value referencing the description of Location.
     * 
     * Post-Conditions: new Location(s) are created with values set to those stored in the database referenced by a description
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createLocationFromDatabaseByDescription(aDescription, callback) { 
        this.createFromDatabaseByDescription('Locations', aDescription, callback, (result) => {
            this.createLocations(result, (locations) => {
                callback(locations);
            });
        });
    }

    /**
     * @private
     * @param {String} anId A string representing the id of a Storage
     * @param {Function} callback A function accepting an Storage object.
     * @description Attempts to create a Storage from data stored on the database referenced by Id.
     * 
     * Pre-Conditions: callback must be a function accepting an object of id Storage.
     *                 anId is of type String with a value referencing the id of Storage.
     * 
     * Post-Conditions: new Storage(s) are created with values set to those stored in the database referenced by an id
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createStorageFromDatabaseById(anId, callback) {
        this.createFromDatabaseById('Stores', anId, callback, (result) => {
            this.createStorage(result, (storage) => {
                callback(storage);
            });
        });
    }

    /**
     * @private
     * @param {String} aDescription A string representing the description of a Storage
     * @param {Function} callback A function accepting a Storage object.
     * @description Attempts to create a Storage from data stored on the database referenced by description.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Storage.
     *                 aDescription is of type String with a value referencing the description of Storage.
     * 
     * Post-Conditions: new Store(s) are created with values set to those stored in the database referenced by a description
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createStorageFromDatabaseByDescription(aDescription, callback) { 
        this.createFromDatabaseByDescription('Stores', aDescription, callback, (result) => {
            this.createStores(result, (stores) => {
                callback(stores);
            });
        });
    }

    /**
     * @private
     * @param {String} aType A string representing the type of a Storage
     * @param {Function} callback A function accepting a Storage object.
     * @description Attempts to create a Storage from data stored on the database referenced by type.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Storage.
     *                 aType is of type String with a value referencing the type of a Storage.
     * 
     * Post-Conditions: new Store(s) are created with values set to those stored in the database referenced by a type
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createStorageFromDatabaseByType(aType, callback) { 
        this.createFromDatabaseByType('Stores', aType, callback, (result) => {
            this.createStores(result, (stores) => {
                callback(stores);
            });
        });
    }

    /**
     * @private
     * @param {String} anId A string representing the id of a Item
     * @param {Function} callback A function accepting an Item object.
     * @description Attempts to create an Item from data stored on the database referenced by Id.
     * 
     * Pre-Conditions: callback must be a function accepting an object of id Item.
     *                 anId is of type String with a value referencing the id of an Item.
     * 
     * Post-Conditions: new Item(s) are created with values set to those stored in the database referenced by an id
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createItemFromDatabaseById(anId, callback) { 
        this.createFromDatabaseById('Items', anId, callback, (result) => {
            this.createItem(result, (item) => {
                callback(item);
            });
        });
    }

    /**
     * @private
     * @param {String} aType A string representing the a type of a Item
     * @param {Function} callback A function accepting an Item object.
     * @description Attempts to create Items from data stored on the database referenced by aType.
     * 
     * Pre-Conditions: callback must be a function accepting object(s) of type Item.
     *                 aType is of type String with a value referencing the type of an Item.
     * 
     * Post-Conditions: new Item(s) are created with values set to those stored in the database referenced by a type
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createItemFromDatabaseByType(aType, callback) { 
        this.createFromDatabaseByType('Items', aType, callback, (result) => {
            this.createItems(result, (items) => {
                callback(items);
            });
        });
    }

    /**
     * @private
     * @param {Array} anArray An array of items that can be converted into Location objects
     * @param {Function} callback A function accepting an Array or singular Location object(s).
     * @description Attempts to create an Location Object(s) from values referenced by objects in anArray.
     * 
     * Pre-Conditions: callback must be a function accepting an object or array of, of type Location.
     * 
     * Post-Conditions: An Array or singular Location object(s) is created with values set to those stored in the database
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createLocations(anArray, callback) {
        if(!Array.isArray(anArray)) { 
            if(anArray !== null) { this.createLocation(anArray, (result) => { callback(result); }); } 
            else { callback(null); } }
        else {
            let locations = [];
            let i = 0;
            anArray.forEach(location => {
                i++;
                this.createLocation(location, (result) => {
                    locations.push(result.getLocation());
                    if(i >= anArray.length) { callback(locations); } // Retest Method
                });
            });
        }
    }

    /**
     * @private
     * @param {Array} anArray An array of items that can be converted into Storage objects
     * @param {Function} callback A function accepting an Array or singular Storage object(s).
     * @description Attempts to create an Storage Object(s) from values referenced by objects in anArray.
     * 
     * Pre-Conditions: callback must be a function accepting an object or array of, of type Storage.
     * 
     * Post-Conditions: An Array or singular Storage object(s) is created with values set to those stored in the database
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createStores(anArray, callback) {
        if(!Array.isArray(anArray)) { 
            if(anArray !== null) { this.createStorage(anArray, (result) => { callback(result); }); } 
            else { callback(null); } }
        else {
            let stores = [];
            let i = 0;
            anArray.forEach(storage => {
                i++;
                this.createStorage(storage, (result) => {
                    stores.push(result.getStorage());
                    if(i >= anArray.length) { callback(anArray); }
                });
            });
        }
    }

    /**
     * @private
     * @param {Array} anArray An array of items that can be converted into Item objects
     * @param {Function} callback A function accepting an Array or singular Item object(s).
     * @description Attempts to create an Item Object(s) from values referenced by objects in anArray.
     * 
     * Pre-Conditions: callback must be a function accepting an object or array of, of type Item.
     * 
     * Post-Conditions: An Array or singular Item object(s) is created with values set to those stored in the database
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    createItems(anArray, callback) {
        if(!Array.isArray(anArray)) {
            if(anArray !== null) { this.createItem(anArray, (result) => { callback(result); }); } 
            else { callback(null); } }
        else {
            let items = [];
            let i = 0;
            anArray.forEach(item => {
                i++;
                this.createItem(item, (result) => {
                    items.push(result.getItem());
                    if(i >= anArray.length) { callback(anArray); }
                });
            });
        }
    }

    /**
     * @private
     * @param {String} value A String
     * @param {Function} callback A function accepting a Boolean
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

    /**
     * @private
     * @param {Object} obj An Object
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A function accepting an Object.
     * @description Determines the type of Object obj represents and sets the attributes of those values using the 
     *              values defined in Request's body object and returns the updated Object obj.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Object.
     *                 obj is a type of Object
     *                 request is a Request object with values corresponding to an object of type Location, Storage or Item.
     * 
     * Post-Conditions: The object type passed in, will be returned with attribute values updated to value of Request's body.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: ???
     */
    setObjectUpdateValues(obj, request, callback) {
        if(this.hasValue(request.body.newId)) { obj.setId(request.body.newId); } 
        else { obj.setId(request.body.id); }
        if(obj instanceof Item || obj instanceof Storage) { obj.setType(this.isDefined(request.body.type)); }
        if(obj instanceof Location || obj instanceof Storage) { obj.setDescription(this.isDefined(request.body.description)); }
        callback(obj);
    }
}

module.exports = Service;