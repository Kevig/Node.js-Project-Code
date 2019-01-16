/** @static @private @description Data structure for Requisition business logic */
const Requisition = require("./Requisition");

/** @static @private @description Data structure for Component business logic */
const Component = require("./Component");

/** @static @private @description Data structure for Item business logic. */
const Item = require("./Item");

/** */
const PurchaseOrder = require("./PurchaseOrder");

/** @static @private @description ServiceResult - Data structure for holding service processing result information */
const ServiceResult = require("./ServiceResult");

/** @static @private @description An adapter allowing for CRUD operations from Service to Database */
const mongoAdapter = require('./MongoAdapter');

/**
 * @class
 * @classdesc Provides orchestration of the tasks required to deliver the services offered by the applications API
 */
class Service {

    constructor() { }

    newPurchaseOrder(request, callback) {
        if(!this.hasValue(request.body.user)) { callback(new ServiceResult(3)); }
        else {
            this.createPurchaseOrder(request.body, (purchaseOrder) => {
                this.createSupplierFromDatabaseById(request.body.supplierId, (supplier) => {
                    if(supplier === null) { 
                        this.createSupplier(request.body, (supp) => { 
                            if(supplier === null) { callback(new ServiceResult(4)); } // db error in creating supplier
                            else {
                                mongoAdapter.addRecord('Suppliers', supplier.getSupplier(), result => {
                                    if(!result) { callback(new ServiceResult(4)); } // db error
                                    else{ supplier = supp; }
                            }); }}); }
                    purchaseOrder.addSupplier(supplier);
                    let failedItems = [];
                    if(this.hasValue(request.body.items)) {
                        let anArray = [];
                        try { anArray = JSON.parse(request.body.items); } 
                        catch(err) { console.log(err); }  // Add callback list incorrectly formatted
                        anArray.forEach(anItem => {
                            this.validateItem(anItem, (success) => {
                                if(!success) { failedItems.push(anItem); }
                                else {  this.createItem(anItem, (item) => {
                                        purchaseOrder.addItem(item, () => {}); 
                                     }); } }); }); }
                    mongoAdapter.addRecord('PurchaseOrders', purchaseOrder.getPurchaseOrder(), 
                    result => {
                        if(result) {
                            if(failedItems.length === 0) { callback(new ServiceResult(1)); } // Successful Purchaser Order Creation
                            else { 
                                let sResult = new ServiceResult(2); // Partial success - failed items returned
                                sResult.setMessage({'failedItems': failedItems});
                                callback(sResult); }}
                        else { callback(new ServiceResult(4)); } // Server error
                    });
                });
            });
        }
    }

    newSupplier(request, callback) { 
        if(!this.hasValue(request.body.name)) { callback(new ServiceResult(5)); } // supplier must have name
        else {
            this.createSupplier(request.body, (supplier) => {
                if(supplier === null) { callback(new ServiceResult(5)); } //
                else {
                    mongoAdapter.addRecord('Suppliers', supplier.getSupplier(), result => {
                        if(result) {
                            callback(new ServiceResult(5)); // supplier added
                        } else { callback(new ServiceResult(4)); }
                    });
                }
            });
        }
    }

    // Get Purchase Order

    // Get Supplier

    // 2 - {Object}
    // 7 - None
    getPurchaseOrderResponse(purchaseOrder, callback) {
        if(purchaseOrder !== null) {
            let result = new ServiceResult(2);
            result.setMessage(purchaseOrder.getPurchaseOrder());
            callback(result);
        }
        else { callback(new ServiceResult(7)); }
    }
    
    // 2 - {Object}
    // 7 - None 
    getSupplierResponse(supplier, callback) {
        if(supplier !== null) {
            let result = new ServiceResult(2);
            result.setMessage(supplier.getSupplier());
            callback(result);
        }
        else { callback(new ServiceResult(7)); }
    }
    
    createPurchaseOrder(item, callback) {
        let pOrder = new PurchaseOrder();
        pOrder.setReference(this.hasValue(item.reference));
        pOrder.setPurchaser(this.hasValue(item.user));
        callback(pOrder);
    }

    createPuchaseOrderFromDatabaseById() {}

    createSupplier(item, callback) {
        let supp = new Supplier();
        if(this.isDefined(item._id)) { item.id = item._id; }
        supp.setId(this.isDefined(item.id));
        supp.setAddedBy(this.isDefined(item.user));
        supp.setName(this.isDefined(item.name));
        supp.setDescription(this.isDefined(item.description));
        this.createAddress(item, (address) => { 
            supp.setAddress(address); 
            this.createContactNumbers(item, (cNumbers) => {
                supp.setContactNumbers(cNumbers);
                this.createContactEmails(item, (cEmails) => {
                    supp.setContactEmails(cEmails);
                    this.createNotes(item, (notes) => {
                        supp.setNotes(notes);
                        callback(supp);
                    });
                });
            });
        });
    }

    createContactNumbers(item, callback) {
        let anArray = [];
        let contactNumbers = [];
        try { anArray = JSON.parse(item.contactNumbers); }
        catch(err) { anArray = null; }
        
        if(anArray !== null) {
            let len = anArray.length;
            let i = 0;
            anArray.forEach(anItem, () => {
                i++;
                let cNum = new ContactNumber();
                cNum.setName(this.isDefined(anItem.name));
                cNum.setNumber(this.isDefined(anItem.number));
                contactNumbers.push(cNum);
                if(i === len) { callback(contactNumbers); }
            });
        } else { callback(null); }
    }

    createContactEmails(item, callback) {
        let anArray = [];
        let contactEmails = [];
        try { anArray = JSON.parse(item.contactEmails); }
        catch(err) { anArray = null; }
        
        if(anArray !== null) {
            let len = anArray.length;
            let i = 0;
            anArray.forEach(anItem, () => {
                i++;
                let cEmail = new ContactEmail();
                cEmail.setName(this.isDefined(anItem.name));
                cEmail.setEmail(this.isDefined(anItem.email));
                contactEmails.push(cEmail);
                if(i === len) { callback(contactEmails); }
            });
        } else { callback(null); }
    }

    createNotes(item, callback) {
        let anArray = [];
        let notes = [];
        try { anArray = JSON.parse(item.notes); }
        catch(err) { anArray = null; }
        
        if(anArray !== null) {
            let len = anArray.length;
            let i = 0;
            anArray.forEach(anItem, () => {
                i++;
                let note = new Note();
                note.setAddedBy(this.isDefined(anItem.user));
                note.setTitle(this.isDefined(anItem.title));
                note.setText(this.isDefined(anItem.noteText));
                notes.push(note);
                if(i === len) { callback(notes); }
            });
        } else { callback(null); }
    }

    createAddress(item, callback) {
        let anArray = [];
        try { anArray = JSON.parse(item.address); }
        catch(err) { anArray = null; }
        if(anArray !== null) {
            let address = new address();
            address.setLine1(this.isDefined(anArray[0]));
            address.setLine2(this.isDefined(anArray[1]));
            address.setLine3(this.isDefined(anArray[2]));
            address.setLine4(this.isDefined(anArray[3]));
            address.setLine5(this.isDefined(anArray[4]));
            address.setPostCode(this.isDefined(anArray[5]));
        } else { callback(null); }
    }

    createSupplierFromDatabase(result, callback) {
        if(result === null) { callback(null); }
        else {
            this.createSupplier(result, (supplier) => {
                callback(supplier);
            });
        }
    }

    createSupplierFromDatabaseById(aValue, callback) {
        mongoAdapter.findRecord('Suppliers', {'_id': aValue}, (result) => {
            this.createSupplierFromDatabase(result, callback);
        });
    }

    createItem(item, callback) {
        let i = new Item();
        i.setId(item.id);
        i.setName(item.name);
        i.setType(this.isDefined(item.type));
        i.setDescription(item.description);
        if(i.quantity > 1) { i.setQuantity(item.quantity); }
        if(this.hasValue(item.currency)) { i.setValueCurrency(item.currency); }
        i.setValue(item.value);
        callback(i);
    }
    
    hasValue(aValue) {
        return (typeof aValue !== 'undefined' && aValue);
    }

    isDefined(aValue) { 
        if (typeof aValue === 'undefined') { aValue = ''; }
        return aValue;
    }

    validateItem(anItem, callback) {
        let success = false;
        if( this.hasValue(anItem.value) ) {
            if(  this.hasValue(anItem.id) ) { success = true; }
            else if ( this.hasValue(anItem.name) &&  
                    this.hasValue(anItem.description)) { success = true; } 
            else { success = false; }
        }
        else { success = false; }
        callback(success);
    }

}

module.exports = Service;