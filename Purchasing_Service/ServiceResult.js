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
     * Pre-Conditions: aValue is a type of Integer with the value representing one of the pre-defined cases
     * 
     * Post-Conditions: This instance attributes will reflect the values defined in the case referenced by aValue.
     * 
     * Cyclomatic Complexity: ???
     */
    constructor(aValue) {

        switch(aValue) {

            case 1:  this.status = 'success'; this.code = 200; this.message = 'Purchase Order Created';                     break;
            case 2:  this.status = 'success'; this.code = 200; this.message =  null;                                        break;
            case 3:  this.status = 'failure'; this.code = 400; this.message = 'No user name found in request body';         break;
            case 4:  this.status = 'failure'; this.code = 400; this.message = 'Server Error - Database Connection';         break;            
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