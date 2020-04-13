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

const { setNodes, setCurrentNode, getCurrentNode } = nodesState(null);

const checkBounds = (currentNode) => {
  const text = getInputText('selector');

  currentNode.next && currentNode.next.node.matches(text)
    ? activeBtn('selector-next')
    : disableBtn('selector-next');

  currentNode.prev && currentNode.prev.node.matches(text)
    ? activeBtn('selector-prev')
    : disableBtn('selector-prev');
};
const checkNav = ({ node }) => {
  getFirstChild(node) ? activeBtn('nav-bottom') : disableBtn('nav-bottom');
  getParentNode(node) ? activeBtn('nav-top') : disableBtn('nav-top');
  getNextNode(node) ? activeBtn('nav-right') : disableBtn('nav-right');
  getPrevNode(node) ? activeBtn('nav-left') : disableBtn('nav-left');
};

const updateNode = (objNode) => {
  setCurrentNode(objNode);
  applyStyles(objNode);
  checkBounds(objNode);
  checkNav(objNode);
};

const initInput = () => {
  const [input] = document.getElementsByClassName('selector');
  input.focus();
  input.addEventListener('keyup', (event) => {
    event.keyCode === 13 && btnFind();
  });
};

const initBtn = ({ className, listener }) => {
  const [btn] = document.getElementsByClassName(className);
  btn.onclick = listener;
};

const initButtons = () => {
  buttons.forEach(({ className, listener }) => {
    initBtn({ className, listener });
  });
};

const toDefaultButtons = () => {
  disableBounds();
  disableBtn('nav-bottom');
  disableBtn('nav-top');
  disableBtn('nav-right');
  disableBtn('nav-left');
};

(() => {
  initInput();
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

function applyStyles({ node }) {
  node.style.outline = backlight.outline;
  node.style.backgroundColor = backlight.backgroundColor;
}

function toDefaultStyles({ node }) {
  node.style.outline = '';
  node.style.backgroundColor = '';
}

function btnFind() {
  const currentNode = getCurrentNode();
  currentNode && toDefaultStyles(currentNode);

  const text = getInputText('selector');
  if (emptyStr(text) || !selectorExist(text)) {
    alert('Cелектор не валидный или отсутствует на странице');
    toDefaultButtons();
    return;
  }
  const nodes = document.querySelectorAll(text);
  const mappedNodes = arrLikeList([...nodes]);
  setNodes(mappedNodes);
  updateNode(mappedNodes[0]);
}

function btnTop() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getParentNode(currentNode.node)));
}
function btnBottom() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getFirstChild(currentNode.node)));
}
function btnRight() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getNextNode(currentNode.node)));
}
function btnLeft() {
  disableBounds();
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(wrapNode(getPrevNode(currentNode.node)));
}

function btnNext() {
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(currentNode.next);
}
function btnPrev() {
  const currentNode = getCurrentNode();
  toDefaultStyles(currentNode);
  updateNode(currentNode.prev);
}
