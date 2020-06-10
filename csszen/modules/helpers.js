// это стили для подсвечивания совпадения селектора, в задании были требования именно эти стили
export const backlight = {
  outline: 'solid red 5px',
  backgroundColor: 'lightblue',
};
export const emptyStr = (value) => value === '';
// функция, которая по className ищет узел btn кнопку и делает ее активной
export const activeBtn = (className) => {
  document.getElementsByClassName(className)[0].disabled = false;
};
// функция, которая по className ищет узел btn кнопку и делает ее не активной
export const disableBtn = (className) => {
  document.getElementsByClassName(className)[0].disabled = true;
};
// функция, которая по className ищет узел input поле ввода и возвращает ее текст с поля
export const getInputText = (className) => document.getElementsByClassName(className)[0].value;
// функция, которая по шаблону проверяет dom дерево на наличие такого селектора
export const selectorExist = (text) => {
  try {
    return !!document.querySelector(text);
  } catch {
    return false;
  }
};
//прочти предисловие про связи
// функция, которая принимает узел и возвращает parent node(родитель) переданного узла
export const getParentNode = (node) => node.parentElement;
// функция, которая принимает узел и возвращает узел первый наследник переданного узла
export const getFirstChild = (node) => node.firstElementChild;
// функция, которая принимает узел и возвращает следующий узел, того же родителя переданного узла или возвращает null, если такого нет
export const getNextNode = (node) => node.nextElementSibling;
// функция, которая принимает узел и возвращает предыдущий узел, того же родителя переданного узла или возвращает null, если такого нет
export const getPrevNode = (node) => node.previousElementSibling;
