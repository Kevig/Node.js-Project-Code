/** */
const Note = require("./Note");
/** */
const ContactNumber = require("./ContactNumber");
/** */
const ContactEmail = require("./ContactEmail");
/** */
const Address = require("./Address");

class Supplier 
{

    constructor() {
        this.id = '';
        this.dateAdded = this.setDateAdded();
        this.addedBy = '';
        this.name = '';
        this.address = null;
        this.contactNumbers = [];
        this.contactEmails = [];
        this.description = '';
        this.notes = [];
    }

    getSupplier() { 
        return { 'dateAdded': this.getDateAdded(), 'addedBy': this.getAddedBy(),
                 'name': this.getName(), 'address': this.getAddress(),
                 'contactNumbers': this.getContactNumbers(), 
                 'contactEmails': this.getContactEmails(), 
                 'description': this.getDescription(),
                 'notes': this.getNotes(), 'id': this.getId() };
    }
    
    setId(anId) { this.id = anId; }
    getId() { return this.id; }

    getDateAdded() { return this.dateAdded; }
    setDateAdded(aDate) { this.dateAdded = new Date(); }

    getAddedBy() { return this.addedBy; }
    setAddedBy(aUser) { this.addedBy = aUser; }

    getName() { return this.name; }
    setName(aName) { this.name = aName; }

    getAddress() { return this.address; }
    setAddress(anAddress) { this.address = anAddress; }

    getContactNumbers() { return this.contactNumbers; }
    setContactNumbers(anArray) { this.contactNumbers = anArray; }

    getContactEmails() { return this.contactEmails; }
    setContactEmails(anArray) { this.contactEmails = anArray; }

    getDescription() { return this.description; }
    setDescription(aDescription) { this.description = aDescription; }
    
    getNotes() { return this.notes; }
    setNotes(anArray) { this.notes = anArray; }

    toString() {
        return "\n" +
               "Supplier: " + this.getName() + "\n" +
               "Added By: " + this.getDateAdded() + " | Date: " + this.getDateAdded() + "\n" +
               "Description: " + this.getDescription();
    }

    print() { this.toString(); }
}

module.exports = Supplier;