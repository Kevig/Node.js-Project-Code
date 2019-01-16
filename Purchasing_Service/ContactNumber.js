class ContactNumber
{

    constructor() {
        this.name = '';
        this.number = '';
    }

    getContactNumber() {
        return { 'name': this.getName(), 'number': this.getNumber() };
    }
    
    setContactNumber(aName, aNumber) {
        this.setName(aName);
        this.setNumber(aNumber);
    }

    getName() { return this.name; }
    setName(aName) { this.name = aName; }

    getNumber() { return this.number; }
    setNumber(aNumber) { this.number = aNumber; }

    toString() {
        return "\n" + 
               "Contact Phone \n" +
               "Name: " + this.getName() + "\n" +
               "Number: " + this.getNumber();
    }

    print() { console.log(this.toString()); }
}

module.exports = ContactNumber;