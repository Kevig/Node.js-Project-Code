class Address 
{
    constructor() {
        this.line1 = '';
        this.line2 = '';
        this.line3 = '';
        this.line4 = '';
        this.line5 = '';
        this.postCode = '';
    }

    getAddress() {
        return { 'line1': this.getLine1(), 'line2': this.getLine2(),
                 'line3': this.getLine3(), 'line4': this.getLine4(),
                 'line5': this.getLine5(), 'postCode': this.getPostCode() };
    }

    getLine1() { return this.line1; }
    setLine1(aString) { this.line1 = aString; }

    getLine2() { return this.line2; }
    setLine2(aString) { this.line2 = aString; }

    getLine3() { return this.line3; }
    setLine3(aString) { this.line3 = aString; }

    getLine4() { return this.line4; }
    setLine4(aString) { this.line4 = aString; }

    getLine5() { return this.line5; }
    setLine5(aString) { this.line5 = aString; }

    getPostCode() { return this.postCode; }
    setPostCode(aString) { this.postCode = aString; }

    toString() {
        return  "\n" +
                "Address:  " + "\n" +
                "          " + this.getLine1() + "\n" +
                "          " + this.getLine2() + "\n" +
                "          " + this.getLine3() + "\n" +
                "          " + this.getLine4() + "\n" +
                "          " + this.getLine5() + "\n" +
                "          " + this.getPostCode();
    }

    print() { console.log(this.toString()); }
}

module.exports = Address;