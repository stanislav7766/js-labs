const NOT_NUMBER = 'Это не число';

const isEmpty = (obj) => Object.keys(obj).length === 0;
const isNumber = (text) =>
  !isNaN(text) &&
  /^(-?[1-9]+\d*([.]\d+)?)$|^(-?0[.]\d*[1-9]+)$|^0$|^0.0$/.test(text);

export const validateData = (data, errors = {}) => {
  !isNumber(data.input1) && (errors.input1 = NOT_NUMBER);
  !isNumber(data.input2) && (errors.input2 = NOT_NUMBER);
  return { isValid: isEmpty(errors), errors };
};
