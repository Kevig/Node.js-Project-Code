const assert = require('assert');
const Container = require('./Container');


class Location extends Container
{
    constructor() {
        super();
    }

    getLocation() { 
        return { 'id': this.getId(), 
                 'items': this.getItems(), 
                 'description': this.getDescription() } ;
    }
    
    setLocation(aReference, aDescription) {
        assert(typeof aReference === "string" && typeof aDescription === "string");
        this.setId(aReference);
        this.setDescription(aDescription);
    }

    addStorage(storage) {
        this.addItem(storage);
    }

    removeStorage(storage) {
        this.removeItemByDescription(storage);
    }

    print() {
        console.log( 'Id' + this.getId() + "\n" + 
                     'Description: ' + this.getDescription() + "\n" +
                     'Storage Units: ' + this.items.length + "\n" );
    }

    printStorage() {
        console.log( 'Location: ' + this.getId() + '\n' + 'Storage Units:\n');
        this.items.forEach(item => {
            item.print();
        });
    }

    printFull() {
        console.log( 'Location: ' + this.getId() + '\n' + 'Description: ' + this.getDescription() + '\n');
        this.items.forEach(item => {
            item.printItems();
        });
    }
};

module.exports = Location;