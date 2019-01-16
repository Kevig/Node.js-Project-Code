class Component
{
    
    constructor() { 
        this.dbId = "";                 // Database identifier
        this.id = "";                   // component identifier
        this.serial = "";               // Serial number
        this.name = "";                 // Name
        this.type = "";                 // Type
        this.description = "";          // Description
        this.rohsCompliant = false;     // RoHs compliant
        this.value = 0.00;              // Monetary value    
        this.valueCurrency = "£";       // Currency Symbol
    }

    getDbId() { return this.dbId; }
    setDbId(aValue) { this.dbId = aValue; }

    getId() { return this.id; }
    setId(aValue) { this.id = aValue; }

    getSerial() { return this.serial; }
    setSerial(aValue) { this.serial = aValue; }

    getName() { return this.name; }
    setName(aValue) { this.name = aValue; }

    getType() { return this.type; }
    setType(aValue) { this.type = aValue; }

    getDescription() { return this.description; }
    setDescription(aValue) { this.description = aValue; }

    getRohsCompliant() { return this.rohsCompliant; }
    setRohsCompliant(aValue) { this.rohsCompliant = aValue; }

    getValue() { return this.value; }
    setValue(aValue) { this.value = aValue; }

    getValueCurrency() { return this.value; }
    setValueCurrency(aValue) { this.valueCurrency = aValue; }

    getObject() {
        return { id: this.getId(), serial: this.getSerial(), name: this.getName(), type: this.getType(), 
                 description: this.getDescription(), roHsCompliant: this.getRohsCompliant(),
                 value: this.getValue(), valueCurrency: this.getValueCurrency() };
    }

    setObject( aDbId, anId, aSerial, aName, aType, aDescription, isRoHsCompliant, aValue, aValueCurrency)
    {
        this.setDbId(aDbId);
        this.setId(anId);
        this.setSerial(aSerial);
    }

    toString() { 
        return  "Component Details: \n"     +
                "Database Id: "             + this.dbId                         + "\n" +
                "Component Id: "            + this.id                           + "\n" +
                "Serial Number: "           + this.serial                       + "\n" +
                "Name: "                    + this.name                         + "\n" +
                "Type: "                    + this.type                         + "\n" +
                "Description: "             + this.description                  + "\n" +
                "RoHs Compliant: "          + this.rohsCompliant                + "\n" +
                "Value: "                   + this.valueCurrency + this.value   + "\n";
    }

};

export default Component;