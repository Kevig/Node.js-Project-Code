class ContactEmail
{

    constructor() {
        this.name = '';
        this.email = '';
    }

    getContactEmail() {
        return { 'name': this.getName(), 'email': this.getEmail() };
    }
    
    setContactEmail(aName, anEmail) {
        this.setName(aName);
        this.setEmail(anEmail);
    }

    getName() { return this.name; }
    setName(aName) { this.name = aName; }

    getEmail() { return this.email; }
    setEmail(anEmail) { this.email = anEmail; }

    toString() {
        return  "\n" +
                "Contact Email \n" +
                "Name: " + this.getName() + "\n" +
                "Email: " + this.getEmail();
    }

    print() { console.log(this.toString()); }
}

module.exports = ContactEmail;