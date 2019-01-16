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

            case 1:  this.status = 'success'; this.code = 200; this.message = 'Requisition Created';                        break;
            case 2:  this.status = 'success'; this.code = 200; this.message =  null;                                        break;
            case 3:  this.status = 'failure'; this.code = 400; this.message = 'No requestee found in request body';         break;
            case 4:  this.status = 'failure'; this.code = 400; this.message = 'Server Error - Database Connection';         break;
            case 5:  this.status = 'failure'; this.code = 400; this.message = 'No id provided in request body';             break;
            case 7:  this.status = 'success'; this.code = 200; this.message = 'None Found';                                 break;
            case 8:  this.status = 'failure'; this.code = 400; this.message = 'No status provided in request body';         break;
            case 9:  this.status = 'failure'; this.code = 400; this.message = 'No department provided in request body';     break;
            case 10: this.status = 'failure'; this.code = 400; this.message = 'No lastUpdated provided in request body';    break;
            case 11: this.status = 'failure'; this.code = 400; this.message = 'No lastUpdatedBy provided in request body';  break;
            case 12: this.status = 'failure'; this.code = 400; this.message = 'No dateApproved provided in request body';   break;
            case 13: this.status = 'failure'; this.code = 400; this.message = 'No orderedBy provided in request body';      break;
            case 14: this.status = 'failure'; this.code = 400; this.message = 'No receivedBy provided in request body';     break;
            case 15: this.status = 'failure'; this.code = 400; this.message = 'No completed provided in request body';      break;
            case 16: this.status = 'failure'; this.code = 400; this.message = 'No dateCompleted provided in request body';  break;
            case 17: this.status = 'failure'; this.code = 400; this.message = 'Provided id does not exist';                 break;
            case 18: this.status = 'success'; this.code = 200; this.message = 'Requisition Updated Successfully';           break;
            case 20: this.status = 'failure'; this.code = 400; this.message = 'All Items incorrectly formatted in request'; break;
            case 21: this.status = 'success'; this.code = 200; this.message = 'Requisition Successfully Deleted';           break;
            case 22: this.status = 'success'; this.code = 200; this.message = 'Requisition Successfully Submitted';         break;
            case 23: this.status = 'success'; this.code = 200; this.message = 'Requisition Successfully Approved';          break;
            case 24: this.status = 'success'; this.code = 200; this.message = 'Requisition Status Set to Ordered';          break;
            case 25: this.status = 'success'; this.code = 200; this.message = 'Requisition Status Set to Completed';        break;
            
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