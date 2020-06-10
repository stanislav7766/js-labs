// функция для проверки пустая строка или нет
export const emptyStr = (value) => value === '';
// функция для поиска узла по id, зачистке его текста(того что отображается на страничке)
export const clearUL = () => {
  const ul = document.getElementById('ul');
  ul.innerHTML = '';
  return ul;
};
// функция для чтения записей с localStorage (записи в виде одной строчки записаны) и если есть записи,то функция  возвращает расспарсенный(из строки преобразует структуру данных) массив этих записей или же возвращает пустой массив если записей нету
export const getTasks = () => {
  const taskJson = localStorage.getItem('tasks') || '[]';
  return JSON.parse(taskJson);
};
// функция делает запись в localStorage, принимает на вход массив записей , преобразует их в строку и записывает в localStorage
export const setTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));
// функция для сортировки записей со списка дел, в задании было написано, что это необходимо
export const sortTasks = (tasks) =>
  tasks.sort((a, b) => {
    const aa = a.toLowerCase(),
      bb = b.toLowerCase();
    return aa === bb ? 0 : aa > bb ? 1 : -1;
  });
