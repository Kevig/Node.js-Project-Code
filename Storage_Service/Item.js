const types = [
    'PART',
    'PRODUCT',
    'OTHER'
]

const assert = require('assert');

class Item
{
    
    constructor() {
        this.type = this.setType('NONE');
        this.id = ''; 
    }

    getItem() {
        return { 'type': this.getType(), 'id': this.getId() };
    }

    setItem(anId, anItemType) {
        this.setId(anId);
        this.setType(anItemType);
    }

    getType() { return this.type; }
    setType(anItemType) {
        anItemType = anItemType.toUpperCase();
        let exists = types.indexOf(anItemType);
        if(exists === -1) {
            this.type = 'NONE';
        }
        else {
            this.type = anItemType;
        }
    }

    getId() { return this.id; }
    setId(anId) {
        assert(typeof anId === "string");
        this.id = anId;
    }

    print() {
        console.log( '    Id: ' + this.getId() + '\n' + 
                     '    Type: ' + this.getType() + '\n');
    }
};

module.exports = Item;