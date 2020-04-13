import {
  getTasks,
  setTasks,
  clearUL,
  emptyStr,
  sortTasks,
} from './modules/helpers.js';

const updateList = (tasks) => {
  const ul = clearUL();
  for (let i = 0; i < tasks.length; i++) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(tasks[i]));
    ul.appendChild(li);
  }
};

const btnListener = () => {
  const input = document.getElementById('input');
  const task = input.value;
  if (emptyStr(task)) {
    alert('Добавьте задачу');
    return;
  }
  const tasks = getTasks();
  const sortedTasks = sortTasks([...tasks, task]);
  setTasks(sortedTasks);
  updateList(sortedTasks);
  input.value = '';
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

(() => {
  const container = document.getElementById('container');
  initList(container);
  initInput(container);
  initBtn(container);
  const tasks = getTasks();
  updateList(tasks);
  window.onunload = () => {
    document.getElementById('input').removeEventListener('keyup', () => {});
    return;
  };
})();
