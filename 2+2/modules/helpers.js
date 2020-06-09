export const sum = (str1, str2) => {
  //функция для суммирования чисел, которые приходят в виде строчек , "3" + "2" = 5,
  //в javascipt если суммировать строки , то будет так "3" + "2" = "32"
  const val1 = Number(str1); //по этому нам нужно сначала обе строки преобразовать в число с помощью Number
  const val2 = Number(str2);
  return val1 + val2; // и тогда можно суммировать числа
};

export const isElemExistByID = (id) => !!document.getElementById(id); //функция для проверки есть ли в дереве dom нужный нам узел с указанным id

export const isElemExistByClassName = (className) => !!document.getElementsByClassName(className); //функция для проверки есть ли в дереве dom нужные нам узлы с указанным className

export const insertAfter = (next, target, parent = target.parentNode) => {
  //функия для вставки\приклеивания нового узла после нужного нам
  parent.lastChild === target ? parent.appendChild(next) : parent.insertBefore(next, target.nextSibling);
};
