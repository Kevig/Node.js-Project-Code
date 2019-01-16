const assert = require('assert');

const status = [ 'AWAITING_APPROVAL', 'APPROVED', 'DECLINED', 'AWAITING_PURCHASE', 'ORDERED',
                 'AVAILABLE', 'COMPLETED', 'NONE'];

const dateCreated = new Date(); 

class Requisition
{
    
    constructor() { 
        this.id = '';
        this.requestee = '';
        this.lastUpdatedBy = '';
        this.approvedBy = '';
        this.orderedBy = '';
        this.receivedBy = '';
        this.items = [];
        this.receivedItems = [];

        this.isStockItem = false;

        // Automatically assigned
        this.dateRequested = '';
        this.status = 'NONE';
        this.department = 'NONE';
        this.lastUpdated = ''; 
        this.dateApproved = '';
        this.completed = false;
        this.dateCompleted = '';
    }

    getRequisition() {
        return { 'requestee': this.getRequestee(), 
                 'dateRequested': this.getDateRequested(),
                 'status': this.getStatus(), 'department': this.getDepartment(), 
                 'lastUpdated': this.getLastUpdated(), 'lastUpdatedBy': this.getLastUpdatedBy(), 
                 'dateApproved': this.getDateApproved(), 'approvedBy': this.getApprovedBy(), 
                 'orderedBy': this.getOrderedBy(), 'receivedBy': this.getReceivedBy(), 
                 'completed': this.getCompleted(), 'dateCompleted': this.getDateCompleted(), 
                 'items': this.getItems(), 'receivedItems': this.getReceivedItems() };
    }

    getId() { return this.id; }
    setId(aValue) { this.id = aValue; }
    
    getDateCreated() { return dateCreated; }
    
    getRequestee() { return this.requestee; }
    setRequestee(aValue) { this.requestee = aValue; }

    setIsStockItem() { this.isStockItem = true; }

    getDateRequested() { return this.dateRequested; }
    setDateRequested() { new Date(); }

    getStatus() { return this.status; }
    setStatus(aValue) { 
        aValue = aValue.toUpperCase();
        let exists = status.indexOf(aValue);
        if(exists === -1) { this.status = 'NONE'; } 
        else { this.status = aValue; }
        this.setDepartment();
    }

    getDepartment() { return this.department; }
    setDepartment() { 
        switch(this.getStatus()) {
            case 'AWAITING_APPROVAL': this.department = 'ENGINEERING'; break;
            case 'DECLINED': this.department = 'ENGINEERING'; break;
            case 'AWAITING_PURCHASE': this.department = 'PURCHASING'; break;
            
            case 'ORDERED': 
                if(this.isStockItem){ this.setStatus('AVAILABLE'); }
                this.department = 'WAREHOUSE';
                break;
            
            case 'AVAILABLE': this.department = 'WAREHOUSE'; break;
            
            case 'APPROVED': 
                if(!this.isStockItem) { this.department = 'PURCHASING'; }
                else { this.department = 'WAREHOUSE'; }
                this.setDateApproved(); 
                break;

            case 'NONE': 
            case 'COMPLETED': this.department = 'NONE'; break;
        }
    }

    getLastUpdated() { return this.lastUpdated; }
    setLastUpdated() { this.lastUpdated = new Date(); }

    getLastUpdatedBy() { return this.lastUpdatedBy; }
    setLastUpdatedBy(aValue) { this.lastUpdatedBy = aValue; }

    getDateApproved() { return this.dateApproved; }
    setDateApproved() { this.dateApproved = Date(); }

    getApprovedBy() { return this.approvedBy; }
    setApprovedBy(aValue) { this.approvedBy = aValue; }

    getOrderedBy() { return this.orderedBy; }
    setOrderedBy(aValue) { this.orderedBy = aValue; }

    getReceivedBy() { return this.receivedBy; }
    setReceivedBy(aValue) { this.receivedBy = aValue; }

    getCompleted() { return this.completed; }
    setCompleted() { this.completed = true; }

    getDateCompleted() { return this.dateCompleted; }
    setDateCompleted() { this.dateCompleted = new Date(); }

    getItems() { return this.items; }
    setItems(anArray) { this.items = anArray; }

    getReceivedItems() { return this.receivedItems; }
    setReceivedItems(anArray) { this.receivedItems = anArray; }

    getItemByIndex(anIndex) { return this.items[anIndex]; }
    getReceivedItemByIndex(anIndex) { return this.items[anIndex]; }

    getItemById(anId, callback) {
        this.items.forEach(i => {
            if(i.getId() === anId) { callback(i); }
        });
    }

    getReceivedItemsById(anId, callback) {
        this.receivedItems.forEach(i => {
            if(i.getId() === anId) { callback(i); }
        });
    }

    addItem(aValue, callback) { 
        let exists = false;
        let len = this.items.length;
        let i = 0;
        for(i = 0; i < len; i++) {
            if(this.items[i].getId() === aValue.getId()) { 
                exists = true;
                break;
            }}
        if(!exists) { 
            this.items.push(aValue);
            callback(); } 
        else { 
            this.items.splice(i, 1);
            this.items.push(aValue);
            callback(); }
    }

    removeItem(aValue) { 
        let i = 0;
        let anArray = this.getItems();
        anArray.forEach(item => {
            if(i === this.items.length) { this.setItems(anArray); }
            if(item.getId() === aValue.getId()) { anArray = anArray.splice(i,1); }
            i++;
        });
    }

    addReceivedItem(aValue, callback) { 
        let exists = false;
        let len = this.receivedItems.length;
        let i = 0;
        for(i = 0; i < len; i++) {
            if(this.receivedItems[i].getId() === aValue.getId()) { 
                exists = true;
                break;
            }}
        if(!exists) { 
            this.receivedItems.push(aValue);
            callback(); } 
        else {
            this.receivedItems.splice(i, 1);
            this.receivedItems.push(aValue);
            callback(); }
    }

    itemReceived(aValue, callback) {
        let len = this.items.length;
        for(let i = 0; i < len; i++) {
            let x = this.getItemByIndex(i);
            if(x.getId() === aValue.getId()) {
                let diff = x.getQuantity() - aValue.getQuantity();
                if(diff < 0) { diff = Math.abs(diff); }
                if(diff === 0) {
                    this.removeItem(this.getItemByIndex(i));
                    this.addReceivedItem(aValue, () => {
                        this.checkComplete();
                        callback();
                    }); }
                else {
                    let awaitingItem = this.getItemByIndex(i);
                    awaitingItem.setQuantity(awaitingItem.getQuantity() - aValue.getQuantity());
                    this.addItem(awaitingItem, () => {
                        this.addReceivedItem(aValue, () => {
                            this.checkComplete();
                            callback();
                        });
                    });
                }
            }
        }
    }

    checkComplete() {
        if(this.items.length === 0) {
            this.setStatus('AVAILABLE');    
        }
    }

    submit(aUser, callback) {
        this.setStatus('AWAITING_APPROVAL');
        this.setRequestee(aUser);
        this.setDateRequested();
        this.setLastUpdated(new Date());
        this.setLastUpdatedBy(aUser);
        callback();
    }

    approve(aUser, callback) {
        this.setStatus('APPROVED');
        this.setApprovedBy(aUser);
        this.setDateApproved(new Date());
        this.setLastUpdated(new Date());
        this.setLastUpdatedBy(aUser);
        callback();
    }

    ordered(aUser, callback) {
        this.setStatus('ORDERED');
        this.setOrderedBy(aUser);
        this.setLastUpdatedBy(aUser);
        this.setLastUpdated(new Date());
        callback();
    }

    complete(aUser, callback) {
        this.setStatus('NONE');
        this.setCompleted();
        this.setDateCompleted();
        this.setLastUpdated(new Date());
        this.setLastUpdatedBy(aUser);
        callback();
    }

    toString() { 
        return  "\n" +
                "Requisition: " + this.getId() + " | " + this.getStatus() + " | " + this.getDepartment() +
                "  -Requested By: " + this.getRequestee() + " |  Date: " + this.getDateRequested() + 
                " Updates: \n" +
                "  -Last Updated By: " + this.getLastUpdatedBy() + " | Date: " + this.getLastUpdated() +
                " Approval: \n" +
                "  -Approved By: " + this.getApprovedBy() + " | Date: " + this.getDateApproved() +
                " Ordering: \n" +
                "  -Ordered By: " + this.getOrderedBy() + 
                " Receipt: \n" +
                "  -Received By: " + this.getReceivedBy() + 
                " Completion: \n" +
                "  -Completed: " + this.getCompleted() + " | Date: " + this.getDateCompleted();    
    }
    
    print() { console.log(this.toString()); }
}

module.exports = Requisition;