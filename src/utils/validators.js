export const validators = {
  required: 'This field is required',
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address'
  },
  phone: {
    value: /^\+?[0-9\s-]{7,15}$/,
    message: 'Invalid phone number'
  },
  positiveNumber: {
    value: /^[0-9]+(\.[0-9]{1,2})?$/,
    message: 'Must be a positive number'
  },
  salary: {
    min: {
      value: 1,
      message: 'Salary must be greater than 0'
    }
  }
};
