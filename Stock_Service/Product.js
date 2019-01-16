const assert = require('assert');
const Part = require("./Part.js");

class Product extends Part
{
    constructor(aComponent) {
        super(aComponent);
        this.parts = [];
    }

    getComponent() { return this.component; }
    setComponent(aComponent) { this.component = aComponent; }

    getParts() { return this.parts; }
    setParts(anArray, callback) { this.parts = anArray; callback(); }

    getPartsByIndex(anIndex) { return this.parts[anIndex]; }
    setPartsByIndex(anIndex, aPart) { this.parts.splice(anIndex, 0, aPart); }

    getProduct() {
        return { 'componentId': this.component.getId(),
                 'serial': this.getSerial(), 'rohsCompliant': this.getRohsCompliant(), 
                 'value': this.getValue(), 'currency': this.getCurrency(),
                 'parts': this.getPartsSerials() };
    }

    addPart(aPart, callback) {
        this.parts.push(aPart);
        callback();
    }

    removePart(aPart) {
        this.findPartIndexBySerial(aPart.getSerial(), (i, parts) => {
            if(!(i === -1)) { 
                parts.splice(i, 1);
            }
        });
    }

    findPartIndexBySerial(aSerial, callback) {
        let i = 0;
        this.getParts().forEach(item => {
            if(item.getSerial() === aSerial) { callback(i, this.getParts()); }
            i++;
            if(i >= this.getParts().length) { callback(-1, this.getParts()); }
        });
    }

    getPartsSerials() {
        let partsSerials = [];
        this.parts.forEach(item => {
            partsSerials.push(item.getSerial());
        });
        return partsSerials;
    }

    getPartsValue() {
        let result = 0;
        this.getParts().forEach(item => {
            result += item.getValue();
        });
        return result;
    }

    printParts() { 
        if(this.getParts().length === 0) { console.log("No Linked Parts"); }
        else {
            let result = "";
            let i = 0;
            this.getParts().forEach(item => {
                result += i + " | Id: " + item.getComponent().getId() + 
                              " | Serial: " + item.getSerial() + 
                              " | Name: " + item.getComponent().getName() + " \n";
                i++;
            });
            console.log(result);
        }
    }
}

module.exports = Product;