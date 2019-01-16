import Component from "./Component.js";

class Product extends Component
{
    constructor()
    {
        super();
        this.components = [];
    }

    addComponent(aComponent) {
        this.components.push(aComponent);
    }

    removeComponent(aComponent) {
        let i = this.findComponentBySerial(aComponent.getSerial());
        if(!i === -1) { 
            this.components.splice(i, 1); 
        }
    }

    findComponentIndexBySerial(aSerial) {
        let i = 0;
        this.components.forEach(item => {
            if(item.getSerial() === aSerial) { return i; }
            i++;
        });
        return -1;
    }

    listComponents() {
        let result = "";
        let i = 0;
        this.components.forEach(item => {
            result += i + " | Id: " + item.getId() + 
                          " | Serial: " +  item.getSerial() + 
                          " | Name: " + item.getName() + " \n";
        });
        return result;
    }

    getComponentsValue() {
        let result = 0;
        this.components.forEach(item => {
            result += item.getValue();
        });
        return result;
    }
}

export default Product;