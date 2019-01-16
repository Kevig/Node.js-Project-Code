const assert = require('assert');

class Container
{
    constructor() {
        this.id = "";
        this.description = "";
        this.items = [];
    }

    getId() { return this.id; }
    setId(aReference) {
        assert(typeof aReference === "string");
        this.id = aReference;
    }

    getDescription() { return this.description; }
    setDescription(aDescription) {
        assert(typeof aDescription === "string");
        this.description = aDescription;
    }

    getItems() { return this.items; }
    setItems(anArray) { this.items = this.removeDuplicates(anArray); }
    clearItems() { this.items = []; }

    removeDuplicates(anArray) {
        let aSet = new Set(anArray);
        return Array.from(aSet);
    }

    addItem(item) {
        let items = this.getItems();
        items.push(item);
        this.setItems(items);
    }

    removeItemById(item) { 
        this.findItemIndexById(item.getId(), (i, items) => { 
            if(i !== -1) { 
                items.splice(i, 1); 
            }
        });
    }

    removeItemByDescription(item) {
        this.findItemIndexByDescription(item.getDescription(), (i, items) => {
            if(!(i === -1)) {
                items.splice(i,1);
            }
        });
    }

    findItemIndexByDescription(aDescription, callback) {
        let i = 0;
        this.getItems().forEach(item => {
            if(item.getDescription() === aDescription) { callback(i, this.getItems()); }
            i++;
            if(i >= this.getItems().length) { callback(-1, this.getItems()); }
        });
    }

    findItemIndexById(anId, callback) {
        let i = 0;
        this.getItems().forEach(item => {
            if(item.getId() === anId) { callback(i, this.getStores()); }
            i++;
            if(i >= this.getItems().length) { callback(-1, this.getItems()); }
        });
    }
}

module.exports = Container;