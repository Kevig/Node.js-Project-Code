const Component = require("./Component.js");
const Product = require("./Product");
const Part = require("./Part");
const bodyParser = require('body-parser');

var mongoAdapter = null;

class API_Post
{
    constructor(dbObject) {
        mongoAdapter = dbObject;
    }

    init(expressApp)
    {
        
        // *
        expressApp.post('/NewComponent', (request, response) => {
            console.log('Create New Component Event');
            if(typeof request.body.id !== 'undefined' && request.body.id) {
                let component = API_Post.createComponentFromRequest(request, (component) => {
                    API_Post.componentToDatabase(component, (result) => {
                        if(result){ API_Post.requestSuccess(response); } 
                        else { API_Post.requestFailure(response); }
                    });
                });
            } else { API_Post.requestFailure(response); }
        });
        
        // *
        expressApp.post('/NewPart', (request, response) => {
            console.log('Create New Part Event');
            if(typeof request.body.id !== 'undefined' && request.body.id) {
                API_Post.createComponentFromDatabaseById(request.body.id, (component) => {
                    if(component !== null) {
                        API_Post.createPartFromRequest(request, component, (part) => {
                            API_Post.partToDatabase(part, (result) => {
                                if(result) { API_Post.requestSuccess(response); } 
                                else { API_Post.requestFailure(response); }
                            });
                        });
                    } else { API_Post.requestFailure(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        // *
        expressApp.post('/NewProduct', (request, response) => {
            console.log('Create New Product Event');
            if(typeof request.body.id !== 'undefined' && request.body.id) {
                API_Post.createComponentFromDatabaseById(request.body.id, (component) => {
                    if(component !== null) {
                        API_Post.createProductFromRequest(request, component, (product) => {
                            if(product !== null) {
                                let aList = [];
                                try { aList = JSON.parse(request.body.partsList); } 
                                catch(err) { API_Post.requestFailure(response); }
                                let count = 0;
                                aList.forEach(item => {
                                    count++;
                                    API_Post.createPartFromDatabaseBySerial(item.serial, (part) => {
                                        product.addPart(part, () => {
                                            if(count >= aList.length) {
                                                API_Post.productToDatabase(product, (result) => {
                                                    if(result) { API_Post.requestSuccess(response); }
                                                    else { API_Post.requestFailure(response); }
                                });}});});});
                            } else { API_Post.requestFailure(response); }
                        });
                    } else { API_Post.requestFailure(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        // *
        expressApp.post('/GetComponentById', (request, response) => {
            console.log('Get Component By Id Event');
            if(typeof request.body.id !== 'undefined' && request.body.id) {
                API_Post.createComponentFromDatabaseById(request.body.id, (component) => {
                    if(component !== null) {
                        API_Post.requestSuccessJSON(response, component.getComponent());
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        // *
        expressApp.post('/GetComponentByName', (request, response) => {
            console.log('Get Component By Name Event');
            if(typeof request.body.name !== 'undefined' && request.body.name) {
                API_Post.createComponentsFromDatabaseByName(request.body.name, (components) => {
                    if(components !== null) {
                        API_Post.getComponentsResult(components, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });
        
        // *
        expressApp.post('/GetComponentByType', (request, response) => {
            console.log('Get Component By Type Event');
            if(typeof request.body.type !== 'undefined' && request.body.type) {
                API_Post.createComponentsFromDatabaseByType(request.body.type, (components) => {
                    if(components !== null) {
                        API_Post.getComponentsResult(components, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        // *
        expressApp.post('/GetComponentByDescription', (request, response) => {
            console.log('Get Component By Description Event');
            if(typeof request.body.description !== 'undefined' && request.body.description) {
                API_Post.createComponentsFromDatabaseByDescription(request.body.description, (components) => {
                    if(components !== null) {
                        API_Post.getComponentsResult(components, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        // *
        expressApp.post('/GetPartBySerial', (request, response) => {
            console.log('Get Part By Serial Event');
            if(typeof request.body.serial !== 'undefined' && request.body.serial) {
                API_Post.createPartFromDatabaseBySerial(request.body.serial, (parts) => {
                    if(parts !== null) {
                        API_Post.getPartsResult(parts, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        
        expressApp.post('/GetPartByRohsCompliant', (request, response) => {
            console.log('Get Part By Rohs Compliance Event');
            if(typeof request.body.rohsCompliant !== 'undefined' && request.body.rohsCompliant) {
                API_Post.createPartsFromDatabaseByRohsCompliant(request.body.rohsCompliant, (parts) => {
                    if(parts !== null) {
                        API_Post.getPartsResult(parts, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        expressApp.post('/GetPartByValue', (request, response) => {
            console.log('Get Part By Value Event');
            if(typeof request.body.value !== 'undefined' && request.body.value) {
                API_Post.createPartsFromDatabaseByValue(request.body.value, (parts) => {
                    if(parts !== null) {
                        API_Post.getPartsResult(parts, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        expressApp.post('/GetPartByCurrency', (request, response) => {
            console.log('Get Part By Currency Event');
            if(typeof request.body.valueCurrency !== 'undefined' && request.body.valueCurrency) {
                API_Post.createPartsFromDatabaseByValueCurrency(request.body.valueCurrency, (parts) => {
                    if(parts !== null) {
                        API_Post.getPartsResult(parts, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        expressApp.post('/GetProductBySerial', (request, response) => {
            console.log('Get Product By Serial Event');
            if(typeof request.body.serial !== 'undefined' && request.body.serial) {
                API_Post.createProductFromDatabaseBySerial(request.body.serial, (products) => {
                    if(products !== null) {
                        API_Post.getProductsResult(products, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        expressApp.post('/GetProducByRohsCompliant', (request, response) => {
            console.log('Get Product By Rohs Compliance Event');
            if(typeof request.body.rohsCompliant !== 'undefined' && request.body.rohsCompliant) {
                API_Post.createProductsFromDatabaseByRohsCompliant(request.body.rohsCompliant, (products) => {
                    if(products !== null) {
                        API_Post.getPartsResult(products, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        expressApp.post('/GetProductByValue', (request, response) => {
            console.log('Get Product By Value Event');
            if(typeof request.body.value !== 'undefined' && request.body.value) {
                API_Post.createProductsFromDatabaseByValue(request.body.value, (products) => {
                    if(products !== null) {
                        API_Post.getProductsResult(products, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        expressApp.post('/GetProductByCurrency', (request, response) => {
            console.log('Get Product By Currency Event');
            if(typeof request.body.valueCurrency !== 'undefined' && request.body.valueCurrency) {
                API_Post.createProductsFromDatabaseByValueCurrency(request.body.valueCurrency, (products) => {
                    if(products !== null) {
                        API_Post.getProductsResult(products, request, response);
                    } else { API_Post.requestSuccess(response); }
                });
            } else { API_Post.requestFailure(response); }
        });

        expressApp.post('*', (request, response) => {
            console.log('Post request receieved');
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static requestFailure(response) {
        response.writeHead(400, {'Content-Type': 'text/html'});
        response.end();
    }

    static requestSuccess(response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end();
    }

    static requestSuccessJSON(response, body) {
        body = JSON.stringify(body);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(body);
        response.end();
    }

    static isDefined(aValue) {
        if(typeof aValue === 'undefined') { aValue = ''; }
        return aValue;
    }

    static getComponentsResult(components, request, response) {
        if(components.length !== 0 || components !== null) {
            let result = {'components': components };
            this.requestSuccessJSON(response, result);
        } else { this.requestSuccess(response); }
    }

    static getPartsResult(parts, request, response) {
        if(parts.length !== 0 || parts !== null) {
            let result = {'parts': parts };
            this.requestSuccessJSON(response, result);
        } else { this.requestSuccess(response); }
    }

    static getProductsResult(products, request, response) {
        if(products.length !== 0 || products !== null) {
            let result = {'products': products };
            this.requestSuccessJSON(response, result);
        } else { this.requestSuccess(response); }
    }

    static componentToDatabase(component, callback) {
        mongoAdapter.findRecord('Components', {'id': component.getId()}, (result) => {
            if(result === null) {
                mongoAdapter.addRecord('Components', component.getComponent(), (result) => {
                    callback(result);
                });
            } else { callback(false); }
        });
    }

    static partToDatabase(part, callback) {
        mongoAdapter.findRecord('Parts', {'serial': part.getSerial()}, (result) => {
            if(result === null) {
                mongoAdapter.addRecord('Parts', part.getPart(), (result) => {
                    callback(result);
                });
            } else { callback(false); }
        });
    }

    static productToDatabase(product, callback) {
        mongoAdapter.findRecord('Products', {'serial': product.getSerial()}, (result) => {
            if(result === null) {
                mongoAdapter.addRecord('Products', product.getProduct(), (result) => {
                    callback(result);
                });
            } else { callback(false); }
        });
    }

    static createComponentFromRequest(request, callback) {
        let component = new Component();
        component.setId( API_Post.isDefined(request.body.id) );
        component.setName( API_Post.isDefined(request.body.name) );
        component.setType( API_Post.isDefined(request.body.type) );
        component.setDescription( API_Post.isDefined(request.body.description) );
        callback(component);
    }

    static createComponent(item, callback) {
        let component = new Component();
        component.setId(item.id);
        component.setName(item.name);
        component.setType(item.type);
        component.setDescription(item.description);
        callback(component);
    }

    static createComponents(result, callback) {
        if(result.length !== 0) {
            let components = [];
            let i = 0;
            result.forEach(item => {
                i++;
                this.createComponent(item, (component) => {
                    components.push(component);    
                });
                if(i >= result.length) { callback(components); }
            });
        } else { callback(null); }
    }

    static createComponentFromDatabaseById(anId, callback) {
        let component = null;
        mongoAdapter.findRecord('Components', {'id': anId}, (result) => {
            if(result !== null) {
                this.createComponent(result, (component) => {
                    callback(component);
                });
            } else { callback(null); }
        });
    }

    static createComponentsFromDatabaseByName(aValue, callback) {
        mongoAdapter.findRecords('Components', { 'name': aValue }, (result) => {
            this.createComponents(result, (components) => {
                callback(components);
            });
        });
    }

    static createComponentsFromDatabaseByType(aValue, callback) {
        mongoAdapter.findRecords('Components', { 'type': aValue }, (result) => {
            this.createComponents(result, (components) => {
                callback(components);
            });
        });
    }

    static createComponentsFromDatabaseByDescription(aValue, callback) {
        mongoAdapter.findRecords('Components', { 'description': aValue }, (result) => {
            this.createComponents(result, (components) => {
                callback(components);
            });
        }); 
    }

    static createPartFromRequest(request, component, callback) {
        let part = new Part(component);
        part.setSerial( API_Post.isDefined(request.body.serial) );
        part.setRohsCompliant( API_Post.isDefined(request.body.rohsCompliant) );
        part.setValue( API_Post.isDefined(request.body.value) );
        part.setValueCurrency( API_Post.isDefined(request.body.currency) );
        callback(part);
    }

    static createPart(item, component, callback) {
        let part = new Part(component);
        part.setSerial(item.serial);
        part.setRohsCompliant(item.rohsCompliant);
        part.setValue(item.value);
        part.setValueCurrency(item.valueCurrency);
        callback(part);
    }

    static createParts(result, callback) {
        if(result.length !== 0) {
            let parts = [];
            let i = 0;
            result.forEach(item => {
                i++;
                this.createComponentFromDatabaseById(item.componentId, (component) => {
                    if(result !== null) {
                        this.createPart(item, component, (part) => {
                            parts.push(part);
                            if(i >= result.length) { callback(parts); }
                        });
                    } else { callback(null); }
        });});}
    }

    static createPartFromDatabaseBySerial(aSerial, callback) {
        mongoAdapter.findRecord('Parts', {'serial': aSerial}, (result) => {
            if(result !== null) {
                this.createComponentFromDatabaseById(result.componentId, (component) => {
                    if(component !== null) {
                        this.createPart(result, component, (part) => {
                            callback(part);
                        });
                    } else { callback(null); }
                });
            } else { callback(null); }
        });
    }

    static createPartsFromDatabaseByRohsCompliant(aValue, callback) {
        mongoAdapter.findRecords('Parts', { 'rohsCompliant': aValue }, (result) => {
            this.createParts(result, (parts) => {
                callback(parts);
            });
        });
    }

    static createPartsFromDatabaseByValue(aValue, callback) {
        mongoAdapter.findRecords('Parts', { 'value': aValue }, (result) => {
            this.createParts(result, (parts) => {
                callback(parts);
            });
        });
    }

    static createPartsFromDatabaseByValueCurrency(aValue, callback) {
        mongoAdapter.findRecords('Parts', { 'valueCurrency': aValue }, (result) => {
            this.createParts(result, (parts) => {
                callback(parts);
            });
        });
    }

    static addPartsToProduct(partsList, product, callback) {
        let i = 0;
        partsList.forEach(p => {
            i++;
            this.createPartFromDatabaseBySerial(p.serial, (part) => {
                product.addPart(part);
                if(i >= partsList.length) { callback(product); }
            });
        });
    }

    static createProductFromRequest(request, component, callback) {
        let product = new Product(component);
        product.setSerial( API_Post.isDefined(request.body.serial) );
        product.setRohsCompliant( API_Post.isDefined(request.body.rohsCompliant) );
        product.setValue( API_Post.isDefined(request.body.value) );
        product.setValueCurrency( API_Post.isDefined(request.body.currency) );
        callback(product);
    }

    static createProduct(item, component, callback) {
        let product = new product(component);
        product.setSerial(item.serial);
        product.setRohsCompliant(item.rohsCompliant);
        product.setValue(item.value);
        product.setValueCurrency(item.valueCurrency);
        callback(product);
    }

    static createProducts(result, callback) {
        if(result.length !== 0) {
            let products = [];
            let i = 0;
            result.forEach(item => {
                i++;
                this.createComponentFromDatabaseById(item.componentId, (component) => {
                    if(result !== null) {
                        this.createProduct(item, component, (product) => {
                            this.addPartsToProduct(item.partsList, product, (result) => {
                                products.push(result);
                                if(i >= result.length) { callback(products); }
                        });});
                    } else { callback(null); }
                });});}
    }

    static createProductFromDatabaseBySerial(aSerial, callback) {
        mongoAdapter.findRecord('Products', {'serial': aSerial}, (result) => {
            if(result !== null) {
                this.createComponentFromDatabaseById(result.componentId, (component) => {
                    if(component !== null) {
                        this.createProduct(item, component, (product) => {
                            this.addPartsToProduct(result.partsList, product, (result) => {
                                callback(product);    
                        });});                        
                    } else { callback(null); }
                });
            } else { callback(null); }
        });
    }

    static createProductsFromDatabaseByRohsCompliant(aValue, callback) {
        mongoAdapter.findRecords('Products', { 'rohsCompliant': aValue }, (result) => {
            this.createProducts(result, (products) => {
                callback(products);
            });
        });
    }

    static createProductsFromDatabaseByValue(aValue, callback) {
        mongoAdapter.findRecords('Products', { 'value': aValue }, (result) => {
            this.createProducts(result, (products) => {
                callback(products);
            });
        });
    }

    static createProductsFromDatabaseByValueCurrency(aValue, callback) {
        mongoAdapter.findRecords('Products', { 'valueCurrency': aValue }, (result) => {
            this.createProducts(result, (products) => {
                callback(products);
            });
        });
    }

}
module.exports = API_Post;