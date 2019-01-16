/**
 * @class
 * @classdesc Serves as an attribute wrapper for pre-defined Service processing results, only attribute message is public, other attributes
 *            are implied private access.
 */
class ServiceResult {

    /**
     * 
     * @param {Integer} aValue An integer value as a reference to a pre-defined Service result message.
     * @description Sets the attributes of this instance of ServiceResult to a pre-defined set of values.
     * 
     * Pre-Conditions: aValue is a type of Integer from 1 to 35 inclusive.
     * 
     * Post-Conditions: This instance attributes will reflect the values defined in the case referenced by aValue.
     * 
     * Cyclomatic Complexity: 36
     */
    constructor(aValue) {

        switch(aValue) {

            case 1:  this.status = 'success'; this.code = 200; this.message = 'Component Created';                              break;
            case 2:  this.status = 'failure'; this.code = 400; this.message = 'No id found in request body';                    break;
            case 3:  this.status = 'failure'; this.code = 400; this.message = 'Component exists with provided id';              break;
            case 4:  this.status = 'failure'; this.code = 500; this.message = 'Server error - Database connection';             break;
            case 5:  this.status = 'success'; this.code = 200; this.message = 'Part Created';                                   break;
            case 6:  this.status = 'failure'; this.code = 400; this.message = 'No serial found in request body';                break;
            case 7:  this.status = 'failure'; this.code = 400; this.message = 'Component with provided Id does not exist';      break;
            case 8:  this.status = 'failure'; this.code = 400; this.message = 'Part with provided serial already exists';       break;
            case 9:  this.status = 'success'; this.code = 200; this.message = 'Product Created';                                break;
            case 10: this.status = 'failure'; this.code = 400; this.message = 'Product with provided serial already exists';    break;
            case 11: this.status = 'failure'; this.code = 400; this.message = 'Parts list incorrectly formatted in request';    break;
            case 12: this.status = 'success'; this.code = 200; this.message = null;                                             break;
            case 13: this.status = 'success'; this.code = 200; this.message = 'None Found';                                     break;
            case 14: this.status = 'failure'; this.code = 400; this.message = 'No name found in request body';                  break;
            case 15: this.status = 'failure'; this.code = 400; this.message = 'No type found in request body';                  break;
            case 16: this.status = 'failure'; this.code = 400; this.message = 'No description found in request body';           break;
            case 17: this.status = 'failure'; this.code = 400; this.message = 'No rohsCompliant value found in request body';   break;
            case 18: this.status = 'failure'; this.code = 400; this.message = 'No value attribute found in request body';       break;
            case 19: this.status = 'failure'; this.code = 400; this.message = 'No currency value found in request body';        break;
            case 20: this.status = 'success'; this.code = 200; this.message = 'Component successfully updated';                 break;
            case 21: this.status = 'failure'; this.code = 400; this.message = 'Part with provided serial does not exists';      break;
            case 22: this.status = 'success'; this.code = 200; this.message = 'Part successfully updated';                      break;
            case 23: this.status = 'success'; this.code = 200; this.message = 'Product successfully updated';                   break;
            case 24: this.status = 'failure'; this.code = 400; this.message = 'No Id or Serial found in request body';          break;
            case 25: this.status = 'failure'; this.code = 400; this.message = 'No Product serial or Part serial found';         break;
            case 26: this.status = 'failure'; this.code = 400; this.message = 'Product with provided serial does not exists';   break;
            case 27: this.status = 'failure'; this.code = 400; this.message = 'Parts are linked to component cannot delete';    break;
            case 28: this.status = 'failure'; this.code = 400; this.message = 'Products are linked to component cannot delete'; break;
            case 29: this.status = 'success'; this.code = 200; this.message = 'Component successfully deleted';                 break;
            case 30: this.status = 'success'; this.code = 200; this.message = 'Part successfully deleted';                      break;
            case 31: this.status = 'success'; this.code = 200; this.message = 'Product successfully deleted';                   break;
            case 32: this.status = 'failure'; this.code = 400; this.message = 'Products are linked to part cannot delete';      break;
            case 33: this.status = 'failure'; this.code = 400; this.message = 'Part already exists in Product';                 break;
            case 34: this.status = 'success'; this.code = 200; this.message = 'Part successfully added to Product';             break;
            case 35: this.status = 'success'; this.code = 200; this.message = 'Part successfully removed from Product';         break;
        }

    }

    /**
     * @public
     * @param {Object} anObject An object of type String containing a message or an Object that can be Stringified by JSON.
     * @description Sets message attribute to the object anObject.
     * 
     * Pre-Conditions: Object is a type of Object.
     * 
     * Post-Conditions: this instance of ServiceResult's message attribute will reference the object provided in anObject.
     * 
     * Cyclomatic Complexity: 1
     */
    setMessage(anObject) { this.message = anObject; }

}

module.exports = ServiceResult;