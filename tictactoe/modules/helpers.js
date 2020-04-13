export const activeBtn = (className) => {
  document.getElementsByClassName(className)[0].disabled = false;
};
export const disableBtn = (className) => {
  document.getElementsByClassName(className)[0].disabled = true;
};
export const hideElement = (className) => {
  const node = document.getElementsByClassName(className)[0];
  node.className = `${className} hidden`;
};

export const getData = () => {
  const dataJson = localStorage.getItem('data') || '{}';
  return JSON.parse(dataJson);
};

export const setData = (history) => {
  localStorage.setItem('data', JSON.stringify(history));
};
