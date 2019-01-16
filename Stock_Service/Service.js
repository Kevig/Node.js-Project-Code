/** @static @private @description Data structure for component business logic */
const Component = require("./Component.js");

/** @static @private @description Data structure for product business logicClass variables declarations. */
const Product = require("./Product");

/** @static @private @description Data structure for part business logic. */
const Part = require("./Part");

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

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to create a new component from an HTTP request.
     *
     * Pre-Conditions: Request's body object must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect addition of new component if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:      Message:                                                    Tested:
     * On Success:  (1) Success result - Component Created.                     Yes.
     * On Failure:  (2) No Id provided in request body.                         Yes.
     *              (3) Specified component with given Id already exists.       Yes.
     *              (4) Server error - Database connection.                     No.
     * 
     * Cyclomatic Complexity: 4
     */
    newComponent(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createComponent(request.body, (component) => {
                mongoAdapter.findRecord('Components', { 'id': component.getId() }, (result) => {
                    if (result !== null) { callback(new ServiceResult(3)); }
                    else {
                        mongoAdapter.addRecord('Components', component.getComponent(), (result) => {
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
     * @description Attempts to create a new component from an HTTP request.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     *                  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect addition of new part if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:      Message:                                                    Tested:
     * On Success:  (5) Success result - Part Created.                          Yes.
     * On Failure:  (24) An Id or serial not provided in request body.          Yes.
     *              (7) Component with provided Id does not exist.              Yes.
     *              (8) Part with provided serial already exists.               Yes.
     *              (4) Server error - Database connection.                     No.
     * 
     * Cyclomatic Complexity: 6
     */
    newPart(request, callback) {
        if (!this.hasValue(request.body.id) || !this.hasValue(request.body.serial)) { callback(new ServiceResult(24)); }
        else {
            this.createComponentFromDatabaseById(request.body.id, (component) => {
                if (component === null) { callback(new ServiceResult(7)); }
                else {
                    this.createPart(request.body, component, (part) => {
                        mongoAdapter.findRecord('Parts', { 'serial': part.getSerial() }, (result) => {
                            if (result !== null) { callback(new ServiceResult(8)); }
                            else {
                                mongoAdapter.addRecord('Parts', part.getPart(), (result) => {
                                    if (result) { callback(new ServiceResult(5)); }
                                    else { callback(new ServiceResult(4)); }
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
     * @description Attempts to create a new product from an HTTP request.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     *                  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect addition of new product if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:      Message:                                                    Tested.
     * On Success:  (9)  Success result - Product Created.                      Yes.
     * On Failure:  (24) An Id or serial not provided in request body.          Yes.
     *              (7)  Component with provided Id does not exist.             Yes.
     *              (10) Product with provided serial already exists.           Yes.
     *              (11) Parts list incorrectly formatted in Request.           No.
     *              (4)  Server error - Database connection.                    No.
     * 
     * Cyclomatic Complexity: 7
     */
    newProduct(request, callback) {
        if (!this.hasValue(request.body.id) || !this.hasValue(request.body.serial)) { callback(new ServiceResult(24)); }
        else {
            this.createComponentFromDatabaseById(request.body.id, (component) => {
                if (component === null) { callback(new ServiceResult(7)); }
                else {
                    this.createProduct(request.body, component, (product) => {
                        let aList = [];
                        try { aList = JSON.parse(request.body.partsList); }
                        catch (err) { callback(new ServiceResult(11)); }
                        this.addPartsToProduct(aList, product, (product) => {
                            mongoAdapter.findRecord('Products', { 'serial': product.getSerial() }, (result) => {
                                if (result !== null) { callback(new ServiceResult(10)); }
                                else {
                                    mongoAdapter.addRecord('Products', product.getProduct(), (result) => {
                                        if (result) { callback(new ServiceResult(9)); }
                                        else { callback(new ServiceResult(4)); }
                                    });
                                }
                            });
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
     * @description Attempts to find a component with an Id matching the Id provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute id, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a JSON formatted component if successful and found
     *                  The message of ServiceResult will contain a String with value none if successful and not found
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) {Object}                                           Yes.
     *                  (13) None                                               Yes.
     * On Failure:      (2)  An Id not provided in request body.                Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getComponentById(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createComponentFromDatabaseById(request.body.id, (component) => {
                if (component !== null) {
                    let serviceResult = new ServiceResult(12);
                    serviceResult.setMessage(component.getComponent());
                    callback(serviceResult);
                }
                else { callback(new ServiceResult(13)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find components with a name matching the name provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute name, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted components if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...]                            Yes.
     *                  (13) None                                               Yes.
     * On Failure:      (14) A name was not provided in request body            Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getComponentByName(request, callback) {
        if (!this.hasValue(request.body.name)) { callback(new ServiceResult(14)); }
        else {
            mongoAdapter.findRecords('Components', { 'name': request.body.name }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createComponents(result, (components) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'components': components });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find components with a type matching the type provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute type, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted components if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (15) A type was not provided in request body.           Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getComponentByType(request, callback) {
        if (!this.hasValue(request.body.type)) { callback(new ServiceResult(15)); }
        else {
            mongoAdapter.findRecords('Components', { 'type': request.body.type }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createComponents(result, (components) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'components': components });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find components with a description matching the description provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute description, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted components if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (16) A description was not provided in request body.    Yes.  
     * 
     * Cyclomatic Complexity: 3
     */
    getComponentByDescription(request, callback) {
        if (!this.hasValue(request.body.description)) { callback(new ServiceResult(16)); }
        else {
            mongoAdapter.findRecords('Components', { 'description': request.body.description }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createComponents(result, (components) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'components': components });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find a part with a serial matching the serial provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a JSON formatted part if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) {Object}.                                          Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (6)  A serial was not provided in request body.         Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getPartBySerial(request, callback) {
        if (!this.hasValue(request.body.serial)) { callback(new ServiceResult(6)); }
        else {
            this.createPartFromDatabaseBySerial(request.body.serial, (part) => {
                if (part === null) { callback(new ServiceResult(13)); }
                else {
                    let serviceResult = new ServiceResult(12);
                    serviceResult.setMessage(part.getPart());
                    callback(serviceResult);
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find parts with a rohsCompliant value matching the rohsCompliant value provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute rohsCompliant, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted parts if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (17) rohsCompliant value not provided in request body.  Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getPartByRohsCompliant(request, callback) {
        if (!this.hasValue(request.body.rohsCompliant)) { callback(new ServiceResult(17)); }
        else {
            mongoAdapter.findRecords('Parts', { 'rohsCompliant': request.body.rohsCompliant }, (result) => {
                console.log(result);
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createParts(result, (parts) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'parts': parts });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find parts with a value matching the value provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute value, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted parts if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (18) A value not provided in request body.              Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getPartByValue(request, callback) {
        if (!this.hasValue(request.body.value)) { callback(new ServiceResult(18)); }
        else {
            mongoAdapter.findRecords('Parts', { 'value': request.body.value }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createParts(result, (parts) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'parts': parts });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find parts with a currency matching the currency provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute currency, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted parts if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (19) A currency not provided in request body.           Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getPartByCurrency(request, callback) {
        if (!this.hasValue(request.body.currency)) { callback(new ServiceResult(19)); }
        else {
            mongoAdapter.findRecords('Parts', { 'currency': request.body.currency }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createParts(result, (parts) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'parts': parts });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find a product with a serial matching the serial provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain a JSON formatted product if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) {Object}.                                          Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (6)  A serial was not provided in request body.         Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getProductBySerial(request, callback) {
        if (!this.hasValue(request.body.serial)) { callback(new ServiceResult(6)); }
        else {
            this.createProductFromDatabaseBySerial(request.body.serial, (product) => {
                if (product === null) { callback(new ServiceResult(13)); }
                else {
                    let serviceResult = new ServiceResult(12);
                    serviceResult.setMessage(product.getProduct());
                    callback(serviceResult);
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find products with a rohsCompliant value matching the rohsCompliant value provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute rohsCompliant, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted products if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes
     *                  (13) None.                                              Yes
     * On Failure:      (17) rohsCompliant value not provided in request body.  Yes
     * 
     * Cyclomatic Complexity: 3
     */
    getProductByRohsCompliant(request, callback) {
        if (!this.hasValue(request.body.rohsCompliant)) { callback(new ServiceResult(17)); }
        else {
            mongoAdapter.findRecords('Products', { 'rohsCompliant': request.body.rohsCompliant }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createProducts(result, (products) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'products': products });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find products with a value matching the value provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute value, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted products if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (18) A value not provided in request body.              Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getProductByValue(request, callback) {
        if (!this.hasValue(request.body.value)) { callback(new ServiceResult(18)); }
        else {
            mongoAdapter.findRecords('Products', { 'value': request.body.value }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createProducts(result, (products) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'products': products });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to find products with a currency matching the currency provided in a request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute currency, which must have a value.
     * 
     * Post-Conditions: A ServiceResult object is created containing result information.
     *                  The message of ServiceResult will contain an array of JSON formatted products if successful and found.
     *                  The message of ServiceResult will contain a String with value none if successful and none found.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (12) [{Object}, {Object}...].                           Yes.
     *                  (13) None.                                              Yes.
     * On Failure:      (19) A currency not provided in request body.           Yes.
     * 
     * Cyclomatic Complexity: 3
     */
    getProductByCurrency(request, callback) {
        if (!this.hasValue(request.body.currency)) { callback(new ServiceResult(19)); }
        else {
            mongoAdapter.findRecords('Products', { 'currency': request.body.currency }, (result) => {
                if (result.length === 0) { callback(new ServiceResult(13)); }
                else {
                    this.createProducts(result, (products) => {
                        let serviceResult = new ServiceResult(12);
                        serviceResult.setMessage({ 'products': products });
                        callback(serviceResult);
                    });
                }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object.
     * @description Attempts to update a component with attribute values provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute Id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect updated component values if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (20) Component successfully updated.                    Yes
     * On Failure:      (2)  No Id provided in request body.                    Yes
     *                  (7)  Component with provided Id does not exist.         Yes
     *                  (3)  Component with provided Id already exists.         Yes
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: 7
     */
    updateComponent(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            this.createComponentFromDatabaseById(request.body.id, (component) => {
                if (component === null) { callback(new ServiceResult(7)); }
                else {
                    this.setObjectUpdateValues(component, request, (component) => {
                        let update = (component.getId() === request.body.id);
                        if (update) {
                            // -> Same Id update component only
                            mongoAdapter.updateRecord('Components', { 'id': request.body.id }, component.getComponent(), (result) => {
                                if (result) { callback(new ServiceResult(20)); }
                                else { callback(new ServiceResult(4)); }
                            });
                        }
                        else {
                            //-> Id Change, cascade updates to parts and products
                            mongoAdapter.findRecord('Components', { 'id': component.getId() }, (result) => {
                                if (result === null) {
                                    mongoAdapter.updateRecord('Components', { 'id': request.body.id }, component.getComponent(),
                                        (result) => {
                                            let success = result;
                                            mongoAdapter.findRecords('Parts', { 'componentId': request.body.id }, (parts) => {
                                                parts.forEach(part => {
                                                    mongoAdapter.updateRecord('Parts', { '_id': part._id }, { 'componentId': component.getId() },
                                                        (result) => { });
                                                });
                                            });
                                            mongoAdapter.findRecords('Products', { 'componentId': request.body.id }, (products) => {
                                                products.forEach(product => {
                                                    mongoAdapter.updateRecord('Products', { '_id': product._id }, { 'componentId': component.getId() },
                                                        (result) => { });
                                                });
                                            });
                                            if (success) { callback(new ServiceResult(20)); }
                                            else { callback(new ServiceResult(4)); }
                                        });
                                } else { callback(new ServiceResult(3)); }
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
     * @description Attempts to update a part with attribute values provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect updated part values if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (22) Part successfully updated.                         Yes.
     * On Failure:      (6)  No Serial provided in request body.                Yes.    
     *                  (21) Part with provided serial does not exist.          Yes.
     *                  (8)  Part with provided serial already exists.          Yes.
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: 8
     */
    updatePart(request, callback) {
        if (!this.hasValue(request.body.serial)) { callback(new ServiceResult(6)); }
        else {
            this.createPartFromDatabaseBySerial(request.body.serial, (part) => {
                if (part === null) { callback(new ServiceResult(21)); }
                else {
                    this.setObjectUpdateValues(part, request, (part) => {
                        let update = (part.getSerial() === request.body.serial);
                        let success = false;
                        if (update) {
                            mongoAdapter.updateRecord('Parts', { 'serial': request.body.serial }, part.getPart(),
                                (result) => { success = result; });
                        }
                        else {
                            mongoAdapter.findRecord('Parts', { 'serial': part.getSerial() }, (result) => {
                                if (result === null) {
                                    mongoAdapter.updateRecord('Parts', { 'serial': request.body.serial }, part.getPart(),
                                        (result) => { success = result; });
                                }
                                else { callback(new ServiceResult(8)); }
                            });
                        }
                        // Cascade to Product's parts lists.
                        mongoAdapter.findRecords('Products', { 'parts': request.body.serial }, (products) => {
                            products.forEach(product => {
                                let parts = product.parts;
                                let newParts = [];
                                let i = 0;
                                parts.forEach(serial => {
                                    i++;
                                    if(serial === request.body.serial) { serial = request.body.newSerial; }
                                    newParts.push(serial);
                                    if (i >= parts.length) {
                                        mongoAdapter.updateRecord('Products', { '_id': product._id }, { 'parts': newParts },
                                        (result) => {
                                            if (success) { callback(new ServiceResult(22)); }
                                            else { callback(new ServiceResult(4)); }
                                        });
                                    }
                                });
                            });
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
     * @description Attempts to update a product with attribute values provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect updated product values if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (23) Product successfully updated.                      
     * On Failure:      (6)  No Serial provided in request body.                     
     *                  (26) Product with provided serial does not exist.       
     *                  (11) Parts list incorrectly formatted in Request.       No.
     *                  (21) Part with provided serial does not exist.          
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: 9
     */
    updateProduct(request, callback) {
        if (!this.hasValue(request.body.serial)) { callback(new ServiceResult(6)); }
        else {
            this.createProductFromDatabaseBySerial(request.body.serial, (product) => {
                if (product === null) { callback(new ServiceResult(26)); }
                else {
                    let aList = [];
                    try { aList = JSON.parse(request.body.partsList); }
                    catch (err) { callback(new ServiceResult(11)); }
                    this.setObjectUpdateValues(product, request, (product) => {
                        let partsList = [];
                        let i = 0;
                        aList.forEach(item => {
                            i++;
                            this.createPartFromDatabaseBySerial(item.serial, (part) => {
                                if (part === null) { callback(new ServiceResult(21)); }
                                else {
                                    partsList.push(part);
                                    if (i >= aList.length) {
                                        product.setParts(partsList, () => {
                                            let success = false;
                                            if (product.getSerial() === request.body.serial) {
                                                mongoAdapter.updateRecord('Products', { 'serial': request.body.serial }, product.getProduct(),
                                                    (result) => { success = result; });
                                            }
                                            else {
                                                mongoAdapter.findRecord('Products', { 'serial': product.getSerial() }, (result) => {
                                                    if (result === null) {
                                                        mongoAdapter.updateRecord('Products', { 'serial': request.body.serial }, product.getProduct(),
                                                            (result) => { success = result; });
                                                    }
                                                });
                                            }
                                            if (success) { callback(new ServiceResult(23)); }
                                            else { callback(new ServiceResult(4)); }
                                        });
                                    }
                                }
                            });
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
     * @description Attempts to delete a component with an Id value provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute Id, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of component if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (29) Component successfully deleted.                     
     * On Failure:      (2)  No id provided in request body.                     
     *                  (27) Parts are linked to component, cannot delete.      
     *                  (28) Products are linked to component, cannot delete.   
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: 5
     */
    deleteComponent(request, callback) {
        if (!this.hasValue(request.body.id)) { callback(new ServiceResult(2)); }
        else {
            mongoAdapter.findRecord('Parts', { 'componentId': request.body.id }, (result) => {
                if (result) { callback(new ServiceResult(27)); }
                else {
                    mongoAdapter.findRecord('Products', { 'componentId': request.body.id }, (result) => {
                        if (result) { callback(new ServiceResult(28)); }
                        else {
                            mongoAdapter.deleteRecord('Components', { 'id': request.body.id }, (result) => {
                                if (result) { callback(new ServiceResult(29)); }
                                else { callback(new ServiceResult(4)); }
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
     * @description Attempts to delete a part with a serial value provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of part if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (30) Part successfully deleted.                         
     * On Failure:      (6)  No serial provided in request body                     
     *                  (32) Products are linked to part, cannot delete.        
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: 4
     */
    deletePart(request, callback) {
        if (!this.hasValue(request.body.serial)) { callback(new ServiceResult(6)); }
        else {
            mongoAdapter.findRecord('Products', { 'parts': request.body.serial }, (result) => {
                if (result) { callback(new ServiceResult(32)); }
                else {
                    mongoAdapter.deleteRecord('Parts', { 'serial': request.body.serial }, (result) => {
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
     * @param {Function} callback A callback function that accepts a ServiceResult object
     * @returns A ServiceResult object Representing the result of Service processing.
     * @description Attempts to delete a product with a serial value provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial, which must have a value.
     * 
     * Post-Conditions: Database updated to reflect deletion of product if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (31) Product successfully deleted.                         
     * On Failure:      (6)  No serial provided in request body.                 
     *                  (4)  Server error - Database connection.                No.
     * 
     * Cyclomatic Complexity: 3
     */
    deleteProduct(request, callback) {
        if (!this.hasValue(request.body.serial)) { callback(new ServiceResult(6)); }
        else {
            mongoAdapter.deleteRecord('Products', { 'serial': request.body.serial }, (result) => {
                if (result) { callback(new ServiceResult(31)); }
                else { callback(new ServiceResult(4)); }
            });
        }
    }

    /**
     * @public
     * @param {Request} request Parsed HTTP Request Object.
     * @param {Function} callback A callback function that accepts a ServiceResult object
     * @description Attempts to add a part to a product by parts serial provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial and partSerial, which must have values.
     * 
     * Post-Conditions: Database updated to reflect addition of part to product if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (34) Part added to product.                             
     * On Failure:      (25) No product or part serial provided in request.                 
     *                  (26) Product with provided serial does not exist.       
     *                  (21) Part with provided serial does not exist.          
     *                  (33) Part already exists in Product.                    
     *                  (4)  Server error - Database connection.                No.                
     * 
     * Cyclomatic Complexity: 7
     */
    addPartToProduct(request, callback) {
        if (!this.hasValue(request.body.serial) || !this.hasValue(request.body.partSerial)) { callback(new ServiceResult(25)); }
        else {
            this.createProductFromDatabaseBySerial(request.body.serial, (result) => {
                if (!result) { callback(new ServiceResult(26)); }
                else {
                    this.createPartFromDatabaseBySerial(request.body.partSerial, (result) => {
                        if (!result) { callback(new ServiceResult(21)); }
                        else {
                            mongoAdapter.findRecord('Products', { 'serial': request.body.serial }, (result) => {
                                result = result.parts.includes(request.body.partSerial);
                                if (result) { callback(new ServiceResult(33)); }
                                else {
                                    mongoAdapter.addToCollectionArray('Products', { 'serial': request.body.serial },
                                    { 'parts': request.body.partSerial },
                                    (result) => {
                                        if (result) { callback(new ServiceResult(34)); }
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
     * @description Attempts to remove a part from a product by parts serial provided in request's body.
     * 
     * Pre-Conditions:  Request's body must contain an attribute serial and partSerial, which must have values.
     * 
     * Post-Conditions: Database updated to reflect removal of part from product if successful.
     *                  Database left in unchanged state if request is unsuccessful.
     *                  A new ServiceResult object is created containing result information.
     * 
     * Result:          Message:                                                Tested.
     * On Success:      (35) Part removed from product.                         
     * On Failure:      (25) No product or part serial provided in request.                 
     *                  (26) Product with provided serial does not exist.       
     *                  (4)  Server error - Database connection.                No.                
     * 
     * Cyclomatic Complexity: 5
     */
    removePartFromProduct(request, callback) {
        if (!this.hasValue(request.body.serial) || !this.hasValue(request.body.partSerial)) { callback(new ServiceResult(25)); }
        else {
            this.createProductFromDatabaseBySerial(request.body.serial, (result) => {
                if (!result) { callback(new ServiceResult(26)); }
                else {
                    mongoAdapter.removeFromCollectionArray('Products', { 'serial': request.body.serial }, { 'parts': request.body.partSerial },
                    (result) => {
                        if (result) { callback(new ServiceResult(35)); }
                        else { callback(new ServiceResult(4)); }
                    });
                }
            });
        }
    }

    //// -> Helper Methods

    /**
     * @private
     * @param {Array} partsList Array containing the serial numbers of parts.
     * @param {Object} product An instance of Product.
     * @param {Function} callback A function accepting a Product object.
     * @description Attempts to add parts to a products parts list.
     * 
     * Pre-Conditions:  partsList must be an Array.
     *                  product must be an instance of the class Product.
     *                  callback must be a function accepting an object of type product.
     * 
     * Post-Conditions: If the array partsList has a length of 0, the original product is returned.
     *                  Else an updated product containing a new parts list.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 3
     */
    addPartsToProduct(partsList, product, callback) {
        if (partsList.length === 0) { callback(product); }
        else {
            let i = 0;
            partsList.forEach(part => {
                i++;
                this.createPartFromDatabaseBySerial(part, (part) => {
                    product.addPart(part, () => { });
                    if (i >= partsList.length) { callback(product); }
                });
            });
        }
    }

    /**
     * @private
     * @param {Object} item An object referencing the body of a request.
     * @param {Function} callback A function accepting a Component object.
     * @description Creates a new instance of a Component and sets its values to the values provided in item.
     * 
     * Pre-Conditions: item must be an object referencing the body of a request.
     *                 item must contain attributes id, name, type and description.
     * 
     * Post-Conditions: A new component is created with values set to those defined in item.
     *                  callback must be a function accepting an object of type Component.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 1 
     */
    createComponent(item, callback) {
        let component = new Component();
        component.setId(item.id);
        component.setName(item.name);
        component.setType(item.type);
        component.setDescription(item.description);
        callback(component);
    }

    /**
     * @private
     * @param {String} anId A String representing an Id of a Component.
     * @param {Function} callback A function accepting a Component object.
     * @description Attempts to create a component from values stored in the Component database referenced by anId.
     * 
     * Pre-Conditions: inId must be of type String
     *                 callback must be a function accepting an object of type Component.
     * 
     * Post-Conditions: A new component is created with values set to those stored in the database referenced by anId
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 2
     */
    createComponentFromDatabaseById(anId, callback) {
        mongoAdapter.findRecord('Components', { 'id': anId }, (result) => {
            if (result === null) { callback(null); }
            else {
                this.createComponent(result, (component) => {
                    callback(component);
                });
            }
        });
    }

    /**
     * @private
     * @param {Array} items An array of Objects that can be converted into Component objects
     * @param {Function} callback A function accepting an Array of Component objects.
     * @description Attempts to create an Array of Component Objects from values referenced by objects in items.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Array.
     * 
     * Post-Conditions: An of component objects is created with values set to those stored in the database
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 3
     */
    createComponents(items, callback) {
        if (!Array.isArray(items)) { callback(null); }
        else {
            let components = [];
            let i = 0;
            items.forEach(item => {
                i++;
                this.createComponent(item, (component) => {
                    components.push(component);
                });
                if (i >= items.length) { callback(components); }
            });
        }
    }

    /**
     * @private
     * @param {Object} item An object referencing a Request objects body object.
     * @param {Object} component An instance of Component.
     * @param {Function} callback A function accepting a Part object.
     * @description Creates a new instance of a Part and sets its values to the values provided in item.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Part.
     *                 item is a reference to a Request objects body object.
     *                 component is an instance of a Component object.
     * 
     * Post-Conditions: A new Part is created with values set to those referenced by item
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 1
     */
    createPart(item, component, callback) {
        let part = new Part(component);
        part.setSerial(item.serial);
        part.setRohsCompliant(item.rohsCompliant);
        part.setValue(item.value);
        part.setCurrency(item.currency);
        callback(part);
    }

    /**
     * @private
     * @param {String} aSerial A string representing the serial of a Part
     * @param {Function} callback A function accepting a Part object.
     * @description Attempts to create a Part from values stored in the Component database referenced by anId.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Part.
     *                 aSerial is of type String with a value referencing a serial of a Part.
     * 
     * Post-Conditions: A new Part is created with values set to those stored in the database referenced by aSerial
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 3
     */
    createPartFromDatabaseBySerial(aSerial, callback) {
        mongoAdapter.findRecord('Parts', { 'serial': aSerial }, (result) => {
            if (result === null) { callback(null); }
            else {
                this.createComponentFromDatabaseById(result.componentId, (component) => {
                    if (component === null) { callback(null); }
                    else {
                        this.createPart(result, component, (part) => {
                            callback(part);
                        });
                    }
                });
            }
        });
    }

    /**
     * @private
     * @param {Array} items An array of items that can be converted into Part objects
     * @param {Function} callback A function accepting an Array of Part objects.
     * @description Attempts to create an array of Part objects from values referenced by the items Array.
     * 
     * Pre-Conditions: callback must be a function accepting an Array of objects of type Part.
     * 
     * Post-Conditions: An Array of Part objects is created with values set to those stored in the database
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 4
     */
    createParts(items, callback) {
        if (!Array.isArray(items)) { callback(null); }
        else {
            let parts = [];
            let i = 0;
            items.forEach(item => {
                i++;
                this.createComponentFromDatabaseById(item.componentId, (component) => {
                    if (component !== null) {
                        this.createPart(item, component, (part) => {
                            parts.push(part);
                        });
                    }
                    if (i >= items.length) { callback(parts); }
                });
            });
        }
    }

    /**
     * @private
     * @param {Object} item An object referencing a Request objects body object
     * @param {Component} component An instance of Component
     * @param {Function} callback A function accepting a Product object.
     * @description Creates a new instance of a Product and sets its values to the values in item.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Product.
     *                 item is a reference to a Request objects body object.
     *                 component is an instance of Component.
     * 
     * Post-Conditions: A new Product is created with values set to those referenced in item.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 1
     */
    createProduct(item, component, callback) {
        let product = new Product(component);
        product.setSerial(item.serial);
        product.setRohsCompliant(item.rohsCompliant);
        product.setValue(item.value);
        product.setCurrency(item.currency);
        callback(product);
    }

    /**
     * @private
     * @param {String} aSerial A string representing the serial of a Product
     * @param {Function} callback A function accepting a Product object.
     * @description Attempts to create a Product from a product stored on the database referenced by aSerial.
     * 
     * Pre-Conditions: callback must be a function accepting an object of type Product.
     *                 aSerial is of type String with a value referencing a serial of a Product.
     * 
     * Post-Conditions: A new Product is created with values set to those stored in the database referenced by aSerial
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 4
     */
    createProductFromDatabaseBySerial(aSerial, callback) {
        mongoAdapter.findRecord('Products', { 'serial': aSerial }, (result) => {
            if (result === null) { callback(null); }
            else {
                this.createComponentFromDatabaseById(result.componentId, (component) => {
                    if (component === null) { callback(null); }
                    else {
                        this.createProduct(result, component, (product) => {
                            if (product === null) { callback(null); }
                            else {
                                this.addPartsToProduct(result.parts, product, (result) => {
                                    callback(product);
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * @private
     * @param {Array} items An array of items that can be converted into Product objects 
     * @param {Function} callback A function accepting an Array of Product objects.
     * @description Attempts to create an Array of Product Objects from values referenced by objects in items.
     * 
     * Pre-Conditions: callback must be a function accepting an Array of objects of type Product.
     * 
     * Post-Conditions: An Array of Product objects is created with values set to those stored in the database
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 3
     */
    createProducts(items, callback) {
        if (!Array.isArray(items)) { callback(null); }
        else {
            let products = [];
            let i = 0;
            items.forEach(item => {
                i++;
                this.createComponentFromDatabaseById(item.componentId, (component) => {
                    this.createProduct(item, component, (product) => {
                        this.addPartsToProduct(item.parts, product, (result) => {
                            products.push(result);
                            if (i >= items.length) { callback(products); }
                        });
                    });
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
     * Cyclomatic Complexity: 2
     */
    hasValue(value) {
        return (typeof value !== 'undefined' && value);
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
     * Cyclomatic Complexity: 2
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
     *                 request is a Request object with values corresponding to an object of type Component, Part or Product.
     * 
     * Post-Conditions: The object type passed in, will be returned with attribute values updated to value of Request's body.
     * 
     * Tested via Service public methods
     * Cyclomatic Complexity: 6
     */
    setObjectUpdateValues(obj, request, callback) {
        if (obj instanceof Component) {
            if (typeof request.body.newId !== 'undefined' && request.body.newId) {
                obj.setId(request.body.newId);
            }
            else { obj.setId(request.body.id); }
            obj.setName(this.isDefined(request.body.name));
            obj.setType(this.isDefined(request.body.type));
            obj.setDescription(this.isDefined(request.body.description));
        } else {
            if (typeof request.body.newSerial !== 'undefined' && request.body.newSerial) {
                obj.setSerial(request.body.newSerial);
            }
            else { obj.setSerial(request.body.serial); }
            obj.setRohsCompliant(this.isDefined(request.body.rohsCompliant));
            obj.setValue(this.isDefined(request.body.value));
            obj.setCurrency(this.isDefined(request.body.currency));
        }
        callback(obj);
    }
}

module.exports = Service;