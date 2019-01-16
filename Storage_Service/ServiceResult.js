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
     * Cyclomatic Complexity: ???
     */
    constructor(aValue) {

        switch(aValue) {

            case 1:  this.status = 'success'; this.code = 200; this.message = 'Location Created';                               break;
            case 2:  this.status = 'failure'; this.code = 400; this.message = 'No id found in request body';                    break;
            case 3:  this.status = 'failure'; this.code = 400; this.message = 'Location exists with provided id';               break;
            case 4:  this.status = 'failure'; this.code = 500; this.message = 'Server error - Database connection';             break;
            case 5:  this.status = 'success'; this.code = 200; this.message = 'Storage Created';                                break;
            case 6:  this.status = 'failure'; this.code = 400; this.message = 'Storage with provided id already exists';        break;
            case 7:  this.status = 'success'; this.code = 200; this.message = 'Item Created';                                   break;
            case 8:  this.status = 'failure'; this.code = 400; this.message = 'Item with provided id already exists';           break;
            case 9:  this.status = 'success'; this.code = 200; this.message = null;                                             break;
            case 10: this.status = 'success'; this.code = 200; this.message = 'None Found';                                     break;
            case 11: this.status = 'failure'; this.code = 400; this.message = 'No Description found in request body';           break;
            case 12: this.status = 'failure'; this.code = 400; this.message = 'No Type found in request body';                  break;
            case 13: this.status = 'failure'; this.code = 400; this.message = 'Location with provided Id does not exist';       break;
            case 14: this.status = 'success'; this.code = 200; this.message = 'Location successfully updated';                  break;
            case 15: this.status = 'failure'; this.code = 400; this.message = 'Storage with provided Id does not exist';        break;
            case 16: this.status = 'success'; this.code = 200; this.message = 'Storage successfully updated';                   break;
            case 17: this.status = 'failure'; this.code = 400; this.message = 'Item with provided Id does not exist';           break;
            case 18: this.status = 'success'; this.code = 200; this.message = 'Item successfully updated';                      break;
            case 19: this.status = 'failure'; this.code = 400; this.message = 'Storage is linked to location cannot delete';    break;
            case 20: this.status = 'success'; this.code = 200; this.message = 'Location successfully deleted';                  break;
            case 21: this.status = 'failure'; this.code = 400; this.message = 'Item(s) are linked to storage cannot delete';    break;
            case 22: this.status = 'success'; this.code = 200; this.message = 'Storage successfully deleted';                   break;
            case 23: this.status = 'success'; this.code = 200; this.message = 'Item successfully deleted';                      break;
            case 24: this.status = 'failure'; this.code = 400; this.message = 'No Location id or Storage id found';             break;
            case 25: this.status = 'failure'; this.code = 400; this.message = 'Storage already exists in a Location';           break;
            case 26: this.status = 'success'; this.code = 200; this.message = 'Storage successfully added to Location';         break;
            case 27: this.status = 'failure'; this.code = 400; this.message = 'No Item id or Storage id found';                 break;
            case 28: this.status = 'failure'; this.code = 400; this.message = 'Item already exists in a Storage';               break;
            case 29: this.status = 'success'; this.code = 200; this.message = 'Item successfully added to Storage';             break;
            case 30: this.status = 'success'; this.code = 200; this.message = 'Storage successfully removed from Location';     break;
            case 31: this.status = 'success'; this.code = 200; this.message = 'Item successfully removed from Storage';         break;
            case 32: this.status = 'success'; this.code = 200; this.message = 'Storage successfully moved';                     break;
            case 33: this.status = 'success'; this.code = 200; this.message = 'Item successfully moved';                        break;
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