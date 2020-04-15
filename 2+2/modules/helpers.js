export const sum = (str1, str2) => {
  const val1 = Number(str1);
  const val2 = Number(str2);
  return val1 + val2;
};

export const isElemExistByID = (id) => !!document.getElementById(id);

export const isElemExistByClassName = (className) =>
  !!document.getElementsByClassName(className);

export const insertAfter = (next, target, parent = target.parentNode) => {
  parent.lastChild === target
    ? parent.appendChild(next)
    : parent.insertBefore(next, target.nextSibling);
};
