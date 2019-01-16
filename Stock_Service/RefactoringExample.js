
class ExampleClass {


    // Cyclomatic Complexity: 8
    /**
     * 
     * @param {*} request 
     * @param {*} response 
     */
    updateComponent(request, response) {
        if (typeof request.body.id !== 'undefined' && request.body.id) {
            this.createComponentFromDatabaseById(request.body.id, (component) => {
                if (component !== null) {
                    this.setObjectUpdateValues(component, request, (component) => {
                        let update = (component.getId() === request.body.id);
                        let success = false;
                        if (update) {
                            mongoAdapter.updateRecord('Components', { 'id': request.body.id }, component.getComponent(), (result) => {
                                success = result;
                            });
                        }
                        else {
                            mongoAdapter.findRecord('Components', { 'id': component.getId() }, (result) => {
                                if (result === null) {
                                    mongoAdapter.updateRecord('Components', { 'id': request.body.id }, component.getComponent(), (result) => {
                                        success = result;
                                    });
                                }
                            });
                        }
                        if (component.getId() !== request.body.id) {
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
                            this.requestSuccess(response);
                        } else if (success) {
                            this.requestSuccess(response);
                        } else { this.requestFailure(response); }
                    });
                } else { this.requestFailure(response); }
            });
        } else { this.requestFailure(response); } // Form submission error - No Id provided
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response
     * @description Cyclomatic Complexity: 7
     */
    updateComponent(request, response) {
        if (this.hasValue(request.body.id)) { this.requestFailure(response); } // Form error - No Id provided
        this.createComponentFromDatabaseById(request.body.id, (component) => {
            if (component === null) { this.requestFailure(response); } // Component does not exist
            this.setObjectUpdateValues(component, request, (component) => {
                let update = (component.getId() === request.body.id);
                let success = false;
                if (update) {   // Same Id update component only
                    mongoAdapter.updateRecord('Components', { 'id': request.body.id }, component.getComponent(),
                        (result) => { success = result; });
                }
                else {          // Id change, cascade to possible parts and products
                    mongoAdapter.findRecord('Components', { 'id': component.getId() }, (result) => {
                        if (result === null) {
                            mongoAdapter.updateRecord('Components', { 'id': request.body.id }, component.getComponent(),
                                (result) => {
                                    success = result;
                                    if (!success) { this.requestFailure(response); }
                                });
                        }
                    });
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
                }
                if (success) { this.requestSuccess(response); }
                else { this.requestFailure(response); }
            });
        });
    }


    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @description CC: 10
     */
    updatePart(request, response) {
        if (typeof request.body.serial !== 'undefined' && request.body.serial) {
            this.createPartFromDatabaseBySerial(request.body.serial, (part) => {
                if (part !== null) {
                    this.setObjectUpdateValues(part, request, (part) => {
                        let update = (part.getSerial() === request.body.serial);
                        let success = false;
                        if (update) {
                            mongoAdapter.updateRecord('Parts', { 'serial': request.body.serial }, part.getPart(), (result) => {
                                success = result;
                            });
                        }
                        else {
                            mongoAdapter.findRecord('Parts', { 'serial': part.getSerial() }, (result) => {
                                if (result === null) {
                                    mongoAdapter.updateRecord('Parts', { 'serial': request.body.serial }, part.getPart(), (result) => {
                                        success = result;
                                    });
                                }
                            });
                        }
                        if (part.getSerial() !== request.body.serial) {
                            mongoAdapter.findRecords('Products', { 'parts': request.body.serial }, (products) => {
                                products.forEach(product => {
                                    let parts = product.parts;
                                    let newParts = [];
                                    let i = 0;
                                    parts.forEach(p => {
                                        i++;
                                        if (p === request.body.serial) { p = part.getSerial(); }
                                        newParts.push(p);
                                        if (i >= parts.length) {
                                            mongoAdapter.updateRecord('Products', { '_id': product._id },
                                                { 'parts': newParts },
                                                (result) => { });
                                        }
                                    });
                                });
                            });
                            this.requestSuccess(response);
                        }
                        else if (success) { this.requestSuccess(response); }
                        else { this.requestFailure(response); }
                    });
                }
                else { this.requestFailure(response); }
            });
        } else { this.requestFailure(response); }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @description Cyclomatic Complexity: 9
     */
    updatePart(request, response) {
        if (this.hasValue(request.body.serial)) { this.requestFailure(response); } // Form error - No serial provided
        this.createPartFromDatabaseBySerial(request.body.serial, (part) => {
            if (part === null) { this.requestFailure(response); }
            this.setObjectUpdateValues(part, request, (part) => {
                let update = (part.getSerial() === request.body.serial);
                let success = false;
                if (update) {
                    mongoAdapter.updateRecord('Parts', { 'serial': request.body.serial }, part.getPart(), (result) => {
                        success = result;
                    });
                }
                else {
                    mongoAdapter.findRecord('Parts', { 'serial': part.getSerial() }, (result) => {
                        if (result === null) {
                            mongoAdapter.updateRecord('Parts', { 'serial': request.body.serial }, part.getPart(), (result) => {
                                success = result;
                                if (!success) { this.requestFailure(response); }
                            });
                        }
                    });
                    mongoAdapter.findRecords('Products', { 'parts': request.body.serial }, (products) => {
                        products.forEach(product => {
                            let parts = product.parts;
                            let newParts = [];
                            let i = 0;
                            parts.forEach(serial => {
                                i++;
                                if (serial === request.body.serial) { serial = part.getSerial(); }
                                newParts.push(serial);
                                if (i >= parts.length) {
                                    mongoAdapter.updateRecord('Products', { '_id': product._id }, { 'parts': newParts },
                                        (result) => { });
                                }
                            });
                        });
                    });
                }
                if (success) { this.requestSuccess(response); }
                else { this.requestFailure(response); }
            });
        });
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * CC: 10
     */
    updateProduct(request, response) {
        if (typeof request.body.serial !== 'undefined' && request.body.serial) {
            this.createProductFromDatabaseBySerial(request.body.serial, (product) => {
                if (product !== null) {

                    let aList = [];
                    try { aList = JSON.parse(request.body.partsList); }
                    catch (err) { this.requestFailure(response); }

                    this.setObjectUpdateValues(product, request, (product) => {
                        let partsList = [];
                        let i = 0;
                        aList.forEach(item => {
                            i++;
                            this.createPartFromDatabaseBySerial(item.serial, (part) => {
                                if (part !== null) {
                                    partsList.push(part);
                                    if (i >= aList.length) {
                                        product.setParts(partsList, () => {
                                            let update = (product.getSerial() === request.body.serial);
                                            let success = false;
                                            if (update) {
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
                                            if (success) { this.requestSuccess(response); }
                                            else { this.requestFailure(response); }
                                        });
                                    }
                                }
                                else { this.requestFailure(response); } // Part Change where part does not exist
                            });
                        });
                    });
                }
                else { this.requestFailure(response); }
            });
        }
        else { this.requestFailure(response); }
    }

    // CC: 9
    updateProduct(request, response) {
        if (!this.hasValue(request.body.serial)) { this.requestFailure(response); } // Form error - No serial provided
        this.createProductFromDatabaseBySerial(request.body.serial, (product) => {
            if (product === null) { this.requestFailure(response); } // Component not found
            let aList = [];
            try { aList = JSON.parse(request.body.partsList); }
            catch (err) { this.requestFailure(response); } // Parts List incorrectly formatted in request

            this.setObjectUpdateValues(product, request, (product) => {
                let partsList = [];
                let i = 0;
                aList.forEach(item => {
                    i++;
                    this.createPartFromDatabaseBySerial(item.serial, (part) => {
                        if (part === null) { this.requestFailure(response); } // Part Change where part does not exist
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
                                if (success) { this.requestSuccess(response); } // Updated
                                else { this.requestFailure(response); } // Server - Database Error
                            });
                        }
                    });
                });
            });
        });
    }

}