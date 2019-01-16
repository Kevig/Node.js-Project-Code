const assert = require('assert');

class Component
{
    
    constructor() { 
        this.id = "";                   // component identifier
        this.name = "";                 // Name
        this.type = "";                 // Type
        this.description = "";          // Description
    }

    getComponent() {
        return { 'id': this.getId(), 'name': this.getName(), 
                 'type': this.getType(), 'description': this.getDescription() };
    }

    setComponent(anId, aName, aType, aDescription) {
        this.setId(anId);
        this.setName(aName);
        this.setType(aType);
        this.setDescription(aDescription);
    }

    getId() { return this.id; }
    setId(aValue) { 
        assert(typeof aValue === "string");
        this.id = aValue; 
    }

    getName() { return this.name; }
    setName(aValue) { 
        assert(typeof aValue === "string");
        this.name = aValue; 
    }

    getType() { return this.type; }
    setType(aValue) { 
        assert(typeof aValue === "string");
        this.type = aValue; 
    }

    getDescription() { return this.description; }
    setDescription(aValue) { 
        assert(typeof aValue === "string");
        this.description = aValue; 
    }

    toString() { 
        return  "Details \n"     +
                "  Component Id: "  + this.getId()          + "\n" +
                "  Name: "          + this.getName()        + "\n" +
                "  Type: "          + this.getType()        + "\n" +
                "  Description: "   + this.getDescription() + "\n";
    }

    print() {
        console.log(this.toString());
    }

};

module.exports = Component;