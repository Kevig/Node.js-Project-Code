const assert = require('assert');
const Component = require('./Component');

class Item extends Component
{
    constructor() {
        super();
        this.quantity = 1;
    }

    getItem() {
        let item = this.getComponent();
        item.quantity = this.getQuantity();
        item.totalValue = this.getTotalValue();
        item.valueCurrency = this.getValueCurrency();
        return item;
    }

    setItem(anId, aName, aType, aDescription, aQuantity) {
        this.setComponent(anId, aName, aType, aDescription);
        this.setQuantity(aQuantity);
    }

    getQuantity() { return this.quantity; }
    setQuantity(aValue) {
        aValue = parseInt(aValue);
        assert( (aValue % 1 === 0) && (aValue >= 1) );
        this.quantity = aValue;
    }

    quantityIncrement() {
        this.quantity += 1;
    }

    quantityDecrement() {
        if(this.quantity > 1) { this.quantity -= 1; }
    }

    toString() {
        return super.toString() + "  Quantity: " +  this.getQuantity() + "\n" +
                                  "  Value: " + this.getTotalValue() + " " + 
                                           this.getValueCurrency() + "\n";
    }

    print() {
        console.log(this.toString());
    }

    getTotalValue() { 
        return this.getValue() * this.quantity;
    }
}

module.exports = Item;