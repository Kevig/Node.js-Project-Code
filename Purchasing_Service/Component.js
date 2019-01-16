const assert = require('assert');

class Component
{
    
    constructor() { 
        this.id = "";                   // component identifier
        this.name = "";                 // Name
        this.type = "";                 // Type
        this.description = "";          // Description
        this.value = 0.00;
        this.valueCurrency = "GBP";
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

    getValue() { return this.value; }
    setValue(aValue) {  
        if(aValue < 0) { aValue = 0.00; }
        this.value = aValue;
    }

    getValueCurrency() { return this.valueCurrency; }
    setValueCurrency(aString) { this.valueCurrency = aString; }

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

}

module.exports = Component;