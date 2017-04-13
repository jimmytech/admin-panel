'use strict';

/**
 * commaon function for entire application
 * Return the success format with data object
 * data: {
 *  // your format
 * }
 */
function success(responseObj){
    return {
        data: responseObj
    };
}



/**
 * commaon function for entire application
 * Return the error format with errors object
 * errors: {
 *  // your format
 * }
 */
function errors(errorObj){
    return{
        errors: errorObj
    };
}

module.exports = {
    success: success,
    errors: errors
};