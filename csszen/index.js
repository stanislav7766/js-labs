import { arrLikeList } from './modules/list.js';
import {
  backlight,
  emptyStr,
  activeBtn,
  disableBtn,
  getInputText,
  selectorExist,
  getFirstChild,
  getNextNode,
  getParentNode,
  getPrevNode,
} from './modules/helpers.js';

// предисловие
// и так, зачем эта лаб работа? чтобы студенты могли продемонстрировать свои знания в структуре dom дерева (как помнишь я тебе уже рассказывал про то что все страницы браузера состоят из связанных между собой узлов) мы расматривали типу таких связей html ->body -> div -> input
//                                                                                                             -> btn
//                                                                                                             -> p
// что мы видим из такой ветки, что у узла div есть 3 наследника(детей): input- 1й наслденик, p - последний, btn - тоже наследник div. Ну и input, btn,p имеют одного родителя div. Повторю мысль, все эти узлы так связанные, что имея ссылку на один узел, с помощью методов взаимодействия с dom на джаваскрипте(описаны в файле helpers.js), можно добраться до любого связного узла, имея ссылкку на body можно добраться до p и наоборот.
// задание: на страничке браузера в правом, верхнем углу есть небольшая система навигации, нам нужно обеспечить ее работу при поиске элемента по селектору, что такое селектор? это такой шаблон, паттерн, по которому можно найти совпадающие узлы[node,node...], селекторов много, тут можно глянуть основные https://www.w3schools.com/cssref/css_selectors.asp

// так же стоит заметить, что в файле index.html уде прописаны все узлы кнопки с classNames и мы новые не создаем, только обеспечиваем функциональность уже объявленным. По этому можно не удивляться откуда в коде берется 'selector-find','selector-next','selector-prev' и тд. Они все в index.html)

// для удобства мы разместили все кнопки навигации в массив , по нему будем проходится при загрузке страницы, чтобы инициализировать каждую кнопку и навесить соответствующий слушатель listener
const buttons = [
  {
    className: 'selector-find',
    listener: btnFind,
  },
  {
    className: 'selector-next',
    listener: btnNext,
  },
  {
    className: 'selector-prev',
    listener: btnPrev,
  },
  {
    className: 'nav-top',
    listener: btnTop,
  },
  {
    className: 'nav-bottom',
    listener: btnBottom,
  },
  {
    className: 'nav-left',
    listener: btnLeft,
  },
  {
    className: 'nav-right',
    listener: btnRight,
  },
];

const disableBounds = () => {
  disableBtn('selector-prev');
  disableBtn('selector-next');
};

const wrapNode = (node) => ({ prev: null, next: null, node });

//вот тут часть основной логики, мы решили использовать подход состояния для узлов. при нажатии поиска узлов по селектору, у нас все совпадения добавятся в состояние узлов и по getCurrentNode можно будет получить текущую позицию узла
const { setNodes, setCurrentNode, getCurrentNode } = nodesState(null);

const checkBounds = (currentNode) => {
  //эта функция для того чтобы, у текущего узла проверить наличие или отстутсвие next и prev узлов, в зависимости от этого соответствующая кнопка станет активна или не активна
  const text = getInputText('selector');

  currentNode.next && currentNode.next.node.matches(text) ? activeBtn('selector-next') : disableBtn('selector-next');
  currentNode.prev && currentNode.prev.node.matches(text) ? activeBtn('selector-prev') : disableBtn('selector-prev');
};
//одна из основных функций. У узла проверяются все возможные связи(родитель, соседи, наследники) и если связь есть, то копка соответсвующая будет активна, если нет, то не активна
const checkNav = ({ node }) => {
  getFirstChild(node) ? activeBtn('nav-bottom') : disableBtn('nav-bottom');
  getParentNode(node) ? activeBtn('nav-top') : disableBtn('nav-top');
  getNextNode(node) ? activeBtn('nav-right') : disableBtn('nav-right');
  getPrevNode(node) ? activeBtn('nav-left') : disableBtn('nav-left');
};
//так же важная функция, вызывается в слушателе каждой кнопки навигации
const updateNode = (objNode) => {
  setCurrentNode(objNode); //тут мы помечаем, что узел в нашем состоянии текущий
  applyStyles(objNode); //вызываем функцию для выделения узла на страничке
  checkBounds(objNode);
  checkNav(objNode);
};

const initInput = () => {
  const [input] = document.getElementsByClassName('selector'); //получили наш узел поле ввода по className - selector
  input.focus(); //сразу же как грузится страница акцент\фокус будет на поле ввода
  input.addEventListener('keyup', (event) => {
    //этот слушатель схож с нажатием на кнопку, только вот навешивается слушатель на ввод с клавиатуры и идет проверка на кнопку Энтер, мол если нажали то будет вызов той же функцию , что и для кнопки "Найти"
    event.keyCode === 13 && btnFind();
  });
};

const initBtn = ({ className, listener }) => {
  const [btn] = document.getElementsByClassName(className);
  btn.onclick = listener;
};

const initButtons = () => {
  buttons.forEach(({ className, listener }) => {
    //вот тут мы проходимся по buttons, как упоминалось в начале файла
    initBtn({ className, listener });
  });
};
//отключение всех кнопок навигации
const toDefaultButtons = () => {
  disableBounds();
  disableBtn('nav-bottom');
  disableBtn('nav-top');
  disableBtn('nav-right');
  disableBtn('nav-left');
};
//точка входа в программу, при загрузки\перезагрузки страницы
(() => {
  initInput(); //часть 1
  initButtons();
})();

function nodesState(initVal) {
  let _currentNode = initVal;
  let _nodes = [];
  const setNodes = (nodes) => {
    _nodes.length = 0;
    _nodes = [...nodes];
  };
  const setCurrentNode = (node) => (_currentNode = node);
  const getCurrentNode = () => _currentNode;
  return { setNodes, setCurrentNode, getCurrentNode };
}
//применяем к узлу стили выделения совпадения
function applyStyles({ node }) {
  node.style.outline = backlight.outline;
  node.style.backgroundColor = backlight.backgroundColor;
}
//сбрасываем у узла стили выделения совпадения
function toDefaultStyles({ node }) {
  node.style.outline = '';
  node.style.backgroundColor = '';
}

// ниже многие вещи будут повторяться по этому не везде буду расписывать одно и тоже..

//функция слушаатель, вызывается при нажатии кнопки "Найти"
function btnFind() {
  const currentNode = getCurrentNode(); //мы получили текущий узел с нашего состояния
  currentNode && toDefaultStyles(currentNode); //если он существует, то мы сбросим стили выделения на дефолтные(на тот случай когда повторно нажимаешь кнопку "найти")

  const text = getInputText('selector'); // получили с поля ввода текст, наш селектор, шаблон по которому ищется совпадающие узлы
  if (emptyStr(text) || !selectorExist(text)) {
    //если что-то не ок, поле ввода пустое или такого селектора не существует или нет на странице(выше есть ссылка с селекторами), то пользователю выскочит соответствщие сообщение
    alert('Cелектор не валидный или отсутствует на странице');
    toDefaultButtons();
    return;
  }
  //если все ок идем дальше
  const nodes = document.querySelectorAll(text); //ищем множество узлов по селектору
  const mappedNodes = arrLikeList([...nodes]); //преобразовуем найденные узлы в список (файл list.js)
  setNodes(mappedNodes); //обновляем наше состояние с узлами
  updateNode(mappedNodes[0]); //обновляем на страничке первое совпадение
}

//disableBounds();в задании было описано, что если была нажата кнопка из нижней части навигации, то кнопки "следующий" и "предыдущий" будут отключаться

//функция слушаатель, вызывается при нажатии кнопки "Родитель"
function btnTop() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getParentNode(currentNode.node))); //обновляем на страничке выделенный узел родитель от текущего
}
//функция слушаатель, вызывается при нажатии кнопки "Первый ребенок"
function btnBottom() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getFirstChild(currentNode.node))); //обновляем на страничке выделенный узел первый наследник от текущего
}
//функция слушаатель, вызывается при нажатии кнопки "сл сосед"
function btnRight() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getNextNode(currentNode.node))); //обновляем на страничке выделенный узел сл сосед от текущего
}
//функция слушаатель, вызывается при нажатии кнопки "пред сосед"
function btnLeft() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getPrevNode(currentNode.node))); //обновляем на страничке выделенный узел пред сосед от текущего
}
//функция слушаатель, вызывается при нажатии кнопки "следующий"
function btnNext() {
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(currentNode.next); //обновляем на страничке выделенный узел следующий от текущего
}
//функция слушаатель, вызывается при нажатии кнопки "предыдущий"
function btnPrev() {
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(currentNode.prev); //обновляем на страничке выделенный узел предыдущий от текущего
}
