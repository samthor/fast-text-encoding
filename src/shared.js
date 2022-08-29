
export var failedToString = 'Failed to ';

/**
 * @param {boolean|undefined} check 
 * @param {string} operation 
 * @param {string} fieldName 
 */
export var maybeThrowFailedToOption = (check, operation, fieldName) => {
  if (check) {
    throw new Error(`${failedToString}${operation}: the '${fieldName}' option is unsupported.`);
  }
};