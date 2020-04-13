export const backlight = {
  outline: 'solid red 5px',
  backgroundColor: 'lightblue',
};
export const emptyStr = (value) => value === '';

export const activeBtn = (className) => {
  document.getElementsByClassName(className)[0].disabled = false;
};
export const disableBtn = (className) => {
  document.getElementsByClassName(className)[0].disabled = true;
};
export const getInputText = (className) =>
  document.getElementsByClassName(className)[0].value;

export const selectorExist = (text) => {
  try {
    return !!document.querySelector(text);
  } catch {
    return false;
  }
};

export const getParentNode = (node) => node.parentElement;
export const getFirstChild = (node) => node.firstElementChild;
export const getNextNode = (node) => node.nextElementSibling;
export const getPrevNode = (node) => node.previousElementSibling;
