import { getTasks, setTasks, clearUL, emptyStr, sortTasks } from './modules/helpers.js';
// часть 2. обновление списка дел на станичке браузера, на вход у нас список дел с localStorage
const updateList = (tasks) => {
  // часть связи узлов такая:  ... ->ul->li
  //                                   ->li
  //                                   ->li
  //                                    ...
  const ul = clearUL(); //зачистили предыдущий список
  for (let i = 0; i < tasks.length; i++) {
    //циклом проходимся по новому полученому списку,на каждом элементе со списка создаем новый узел, заполняем текстом и приклеиваем его к ul, для связей дерева
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(tasks[i]));
    ul.appendChild(li);
  }
};
//часть 3, btnListener вызывается когда пользователь нажимает на кнопку "Добавить", тут все просто , но лучше пройдемся построчно
const btnListener = () => {
  const input = document.getElementById('input'); //нашли поле ввода по id
  const task = input.value; //получили введеный текст с поля ввода
  if (emptyStr(task)) {
    //проверка пустой текст или нет, если пусто , то в список ничего не добавится и пользователю покажется сообщение "Добавьте задачу"
    alert('Добавьте задачу');
    return;
  }
  // если же текст не путой то идем дальше
  const tasks = getTasks(); //считаем те задачи, что уже есть в хранилище
  const sortedTasks = sortTasks([...tasks, task]); // отсортируем предыдущие задачи уже с новой
  setTasks(sortedTasks); //обновим все задачи в хранилище
  updateList(sortedTasks); //и обновим их на страничке (часть2)
  input.value = ''; //так же затрем текст поля ввода, чтобы можно было добавлять новое дело
};

const initList = (container) => {
  const list = document.createElement('div');
  const ul = document.createElement('div');
  list.setAttribute('id', 'list');
  ul.setAttribute('id', 'ul');
  list.appendChild(ul);
  container.appendChild(list);
};
const initInput = (container) => {
  const input = document.createElement('INPUT');
  input.setAttribute('id', 'input');
  input.setAttribute('type', 'text');
  container.appendChild(input);
  input.focus();
  input.addEventListener('keyup', (event) => {
    event.keyCode === 13 && btnListener();
  });
};

const initBtn = (container) => {
  const btn = document.createElement('BUTTON');
  btn.innerHTML = 'Добавить';
  container.appendChild(btn);
  btn.onclick = btnListener;
};
// часть 1. как открывается\перезагружается страничка мы попадаем в код ниже. суть лабораторки - показать умения работать с localStorage(нужно почитать https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage) это как база данных,хранилище, только оно находится в браузере, а не где то удаленно, то есть есть ли мы добавили что-то в список и перезагрузили страничку или через время снова зашли на страничку, то дело так и останется на страничке, не нужно будет его снова добавлять
// мноние вещи схожи с предыдущими лабораторками, каждую строчку пояснять не буду
(() => {
  const container = document.getElementById('container');
  initList(container);
  initInput(container);
  initBtn(container);
  const tasks = getTasks(); //тут мы проверяем в нашем localStorage есть ли записи
  updateList(tasks); //и обновляем их на страничке(часть 2)
  window.onunload = () => {
    document.getElementById('input').removeEventListener('keyup', () => {});
    return;
  };
})();
