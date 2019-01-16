/** */
const Supplier = require("./Supplier");

class PurchaseOrder
{

    constructor() {
        this.reference = '';
        this.dateCreated = this.setDateCreated();
        this.dateOrdered = null;
        this.purchaser = '';
        this.supplier = null;
        
        this.items = [];
        // Total Value - Derived
    }

    getPurchaseOrder() {
        return { 'reference': this.getReference(), 'dateCreated': this.getDateCreated(), 
                 'dateOrdered': this.getDateOrdered(), 'purchaser': this.getPurchaser(), 
                 'supplier': this.getSupplier(), 'items': this.getItems() };
    }

    setPurchaseOrder(aReference, aPurchaser, aSupplier) {
        this.setReference(aReference);
        this.setPurchaser(aPurchaser);
        this.setSupplier(aSupplier);
        this.setDateCreated();
    }

    getReference() { return this.reference; }
    setReference(aString) { this.reference = aString; }

    getDateCreated() { return this.dateCreated; }
    setDateCreated() { this.dateCreated = new Date(); }

    getDateOrdered() { return this.dateOrdered; }
    setDateOrdered() { this.dateOrdered = new Date(); }

    getPurchaser() { return this.purchaser; }
    setPurchaser(aString) { this.purchaser = aString; }

    getSupplier() { return this.supplier; }
    setSupplier(aSupplier) { this.supplier = aSupplier; }

    getItems() { return this.items; }
    setItems(anArray) { this.items = anArray; }

    addItem(anItem) { this.items.push(anItem); }
    removeItemByIndex(anIndex) { this.items.splice(anIndex, 1); }
    
    getTotalValue(callback) { 
        let totalValue = 0.00;
        let length = this.items.length;
        if(length === 0) { callback(totalValue); }
        for(i = 0; i < length; i++) {
            totalValue += this.items[i].getTotalValue();
            if(i >= length) {
                callback(totalValue);
            }
        }
    }

    toString() {
        return  "Purchase Order \n" +
                "  Reference: " + this.getReference() + "\n" +
                "  Date Created: " + this.getDateCreated() + "\n" +
                "  Date Ordered: " + this.getDateOrdered() + "\n" +
                "  Purchaser: " + this.getPurchaser() + "\n" +
                "  Total Value: " + this.getReference() + "\n" +
                "Supplier: \n" +
                "  " + this.getSupplier().toString() + "\n";
    }

    print() {
        console.log(this.toString());
    }
}

module.exports = PurchaseOrder;