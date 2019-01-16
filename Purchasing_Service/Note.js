class Note
{

    constructor() {
        this.addedBy = '';
        this.dateAdded = this.setDateAdded();
        this.title = '';
        this.text = '';
    }

    getNote() {
        return { 'addedBy': this.getAddedBy(), 'dateAdded': this.getDateAdded() }
    }

    setNote(aUser, aTitle, aString) { 
        this.setAddedBy(aUser);
        this.setTitle(aTitle);
        this.setText(aString);
    }

    getAddedBy() { return this.addedBy; }
    setAddedBy(aUser) { this.addedBy = aUser; }

    getDateAdded() { return this.dateAdded; }
    setDateAdded() { this.dateAdded = new Date(); }

    getTitle() { return this.title; }
    setTitle(aTitle) { this.title = aTitle; }

    getText() { return this.text; }
    setText(aString) { this.text = aString; }

    toString() {
        return  "\n" +
                "Note: \n" + 
                "Title: " + this.getTitle() + "\n" +
                "Added By: " + this.getAddedBy() + 
                " | Date: " + this.getDateAdded() + "\n\n" +
                "Text: " + this.getText();
    }

    print() { console.log(this.toString()); }
}

module.exports = Note;