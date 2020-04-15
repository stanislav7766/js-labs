import { validateData } from './modules/validator.js';
import {
  sum,
  insertAfter,
  isElemExistByID,
  isElemExistByClassName,
} from './modules/helpers.js';

const COUNT_INPUTS = 2;

const clearErrors = () => {
  isElemExistByClassName('error-message') &&
    [...document.getElementsByClassName('error-message')].forEach((elem) => {
      elem.remove();
    });
};

const clearResult = () => {
  isElemExistByID('result') && document.getElementById('result').remove();
};

const notValidInputs = (errors) => {
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      const div = document.createElement('div');
      div.className = 'error-message';
      div.innerHTML = errors[key];
      const input = document.getElementById(key);
      insertAfter(div, input);
    }
  }
};

const getInputsValue = () => {
  const input1 = document.getElementById('input1');
  const input2 = document.getElementById('input2');
  return { input1: input1.value, input2: input2.value };
};

const btnListener = () => {
  const { input1, input2 } = getInputsValue();
  const { isValid, errors } = validateData({
    input1,
    input2,
  });

  clearErrors();
  clearResult();

  if (!isValid) {
    notValidInputs(errors);
    return;
  }
  const btn = document.getElementById('btn');
  const result = document.createElement('div');
  result.setAttribute('id', 'result');
  result.innerHTML = sum(input1, input2);
  insertAfter(result, btn);
};

const initInputs = (container) => {
  for (let i = 1; i <= COUNT_INPUTS; i++) {
    const input = document.createElement('INPUT');
    input.setAttribute('id', `input${i}`);
    input.setAttribute('type', 'text');
    container.appendChild(input);
  }
};

const initBtn = (container) => {
  const btn = document.createElement('BUTTON');
  btn.setAttribute('id', 'btn');
  btn.innerHTML = 'Посчитать';
  container.appendChild(btn);
  btn.onclick = btnListener;
};

const initContainer = () => {
  const container = document.createElement('div');
  container.style.display = 'table-caption';
  container.setAttribute('id', 'container');
  document.body.appendChild(container);
  return container;
};

(() => {
  const container = initContainer();
  initInputs(container);
  initBtn(container);
})();
