export const getErrorMessage = (error) => {
  let errorMessage = 'Something went wrong!!';
  
  if (error?.response?.data?.error) {
    const errObj = error.response.data.error;
    
    if (errObj.details && typeof errObj.details === 'object' && Object.keys(errObj.details).length > 0) {
      // It's an object of validation errors { field: 'message', ... }
      const messages = Object.values(errObj.details);
      errorMessage = messages.join('\n');
    } else if (errObj.message) {
      errorMessage = errObj.message;
    }
  } else if (error?.message) {
    // Fallback to JS error message if no API response
    errorMessage = error.message;
  }
  
  return errorMessage;
};
