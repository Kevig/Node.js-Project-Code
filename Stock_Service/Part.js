const assert = require('assert');

class Part
{
    constructor(aComponent) {
        this.component = aComponent;
        this.serial = "";               // Serial number
        this.rohsCompliant = "false";   // RoHs compliant
        this.value = 0.00;              // Monetary value    
        this.currency = "GBP";     // Currency Symbol
    }

    getComponent() { return this.component; }
    setComponent(aComponent) { this.component = aComponent; }

    getPart() {
        return { 'componentId': this.component.getId(),
                 'serial': this.getSerial(), 'rohsCompliant': this.getRohsCompliant(), 
                 'value': this.getValue(), 'currency': this.getCurrency() };
    }
    
    setPart(aSerial, isRohsCompliant, aValue, aCurrency) {
        this.setSerial(aSerial);
        this.setRohsCompliant(isRohsCompliant);
        this.setValue(aValue);
        this.setCurrency(aCurrency);
    }

    getSerial() { return this.serial; }
    setSerial(aValue) { 
        assert(typeof aValue === "string");
        this.serial = aValue; 
    }

    getRohsCompliant() { return this.rohsCompliant; }
    setRohsCompliant(aValue) { 
        if(aValue !== "true") { aValue = "false"; } else { aValue = "true"; }
        this.rohsCompliant = aValue; 
    }

    getValue() { return this.value; }
    setValue(aValue) { 
        if(aValue === "") { aValue = 0.00; }
        aValue = Number(aValue);
        assert(typeof aValue === "number");
        this.value = aValue.toFixed(2); 
    }

    getCurrency() { return this.currency; }
    setCurrency(aValue) {
        if(aValue === "") { aValue = 'GBP'; } 
        assert(aValue.length === 3 && typeof aValue === "string");
        this.currency = aValue; 
    }

    print() {
        console.log(this.toString());
    }

    toString() { 
        return  this.component.toString()                                               + "\n" +
                "  Serial Number: "   + this.getSerial()                                + "\n" +
                "  Rohs Compliant: "  + this.getRohsCompliant()                         + "\n" +
                "  Value: "           + this.getCurrency() + " " + this.getValue()      + "\n";
    }
}

module.exports = Part;