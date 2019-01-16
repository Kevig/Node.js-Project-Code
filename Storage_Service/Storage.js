const types = [
    'PALLET',
    'RACK',
    'SHELF',
    'BENCH',
    'CONTAINER',
    'OTHER'
];

const assert = require('assert');
const Container = require('./Container');

class Storage extends Container
{
    constructor() {
        super();
        this.type = this.setType('NONE');
        this.items = [];
    }

    getStorage() { 
        return { "id": this.getId(), "description": this.getDescription(),
                 "type": this.getType(), "items": this.getItems() };
    }
    
    setStorage(anId, aDescription, aStorageType) {
        assert(typeof anId === "string" && typeof aDescription === "string");
        this.setId(anId);
        this.setDescription(aDescription);
        this.setType(aStorageType);
    }

    getType() { return this.type; }
    setType(aStorageType) {
        aStorageType = aStorageType.toUpperCase();
        let exists = types.indexOf(aStorageType);
        if(exists === -1) {
            this.type = 'NONE';
        }
        else {
            this.type = aStorageType;
        }
    }

    removeItem(item) {
        this.removeItemById(item);
    }
    
    print() {
        console.log( '    Id: ' + this.getId() + "\n" + 
                     '    Description: ' + this.getDescription() + "\n" +
                     '    Type: ' + this.getType() + '\n' +
                     '    Items Stored: ' + this.items.length + '\n' );
    }
    
    printItems() {
        console.log( 'Storage: ' + this.getId() + '\n\n' + '  Items Stored:\n');
        this.items.forEach(item => {
            item.print();
        });
    }
}

module.exports = Storage;
