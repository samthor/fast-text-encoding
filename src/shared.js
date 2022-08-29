
export const failedToString = 'Failed to ';

/**
 * @param {boolean|undefined} check 
 * @param {string} operation 
 * @param {string} fieldName 
 */
export const maybeThrowFailedToOption = (check, operation, fieldName) => {
  if (check) {
    throw new Error(`${failedToString}${operation}: the '${fieldName}' option is unsupported.`);
  }
};