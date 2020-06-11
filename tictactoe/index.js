import Command from './modules/command.js';
import History from './modules/history.js';
import { State, WIN_LINES } from './modules/data.js';
import {
  hideElement,
  getData,
  setData,
  activeBtn,
  disableBtn,
} from './modules/helpers.js';

const Share = new BroadcastChannel('test_channel');

let history = new History(State());

const MakeSync = (type) => {
  setData(history);
  Share.postMessage(type);
};

const statusGame = () => {
  if (calculateWinner(history.state.squares)) return 1;
  else if (history.current == 8) return 2;
  else return 0;
};

const checkEndGame = (status = statusGame()) => status === 1 || status === 2;

const render = () => {
  history.state.squares.forEach((val, i) => {
    const node = document.querySelector(`[data-id="${i}"]`);
    val === ''
      ? (node.className = 'cell')
      : (node.className = `cell ${val === 'X' ? 'ch' : 'r'}`);
  });
  checkButtons();
  checkEndGame() && endGame();
};

const checkButtons = () => {
  history.canUndo() ? activeBtn('undo-btn') : disableBtn('undo-btn');
  history.canRedo() ? activeBtn('redo-btn') : disableBtn('redo-btn');
};

const undoBtnListener = () => {
  checkEndGame() && hideElement('won-title');
  history.undo();
  MakeSync('step');
  render();
};
const redoBtnListener = () => {
  history.redo();
  MakeSync('step');
  render();
  checkEndGame() && endGame();
};

const restartBtnListener = () => {
  checkEndGame() && hideElement('won-title');
  history.finishGame();
  history.setDefault(State());
  MakeSync('restart');
  render();
};
//вызов этой функции отобразит на странице браузера завершение игры(выигранные квадратики перечеркнуться линией, появитться кнопка рестарт и надпись победителя

const endGame = () => {
  const node = document.getElementsByClassName('won-title')[0];//поиск узла на странице, который всю игру был спрятян(присутствовал className hidden)
  node.className = 'won-title';//и заменем className на won-title и соответственно hidden пропадет и на странице появится верхняя панелька с рестартом игры и надписью победителя игры 
  const textNode = document.getElementsByClassName('won-message')[0];//поиск узла, что отвечает за надпись победителя
  const status = statusGame(); //проверяем статус игры
  textNode.innerHTML =
    status === 2
      ? `It's a draw!`
      : history.state.xIsNext
      ? `Toes won!`
      : `Crosses won!`;//и в зависимости от того чей был послелний победный ход(ну или ничья ), отобразим на странице сооветствующую надпись

  if (status === 1) {//если игра закончилась победой, а не ничьей, то мы по истории определяем тип линии для зачеркивания квадратов(диагональ, горизонтальная или вертикальная)
    const line = calculateWinner(history.state.squares);
    line.indexes.forEach((index) => {//ну и проходимся по нашим выиграшных квадратиках меняя у нужного узла className, добавляя как раз ту самую линию, и сразу же изменения отображаются на страничке
      const node = document.querySelector(`[data-id="${index}"]`);
      node.className = `${node.className} win ${line.type}`;
    });
  }
};

const cellListener = (e) => {
  if (checkEndGame()) return;
  const { srcElement } = e;
  const i = srcElement.getAttribute('data-id');
  const com = new Command(history.state, i);
  history.push(com);
  MakeSync('render');
  render();
};

const initListeners = () => {
  const cells = document.getElementsByClassName('cell');
  [...cells].forEach((cell) => {
    cell.addEventListener('click', cellListener);
  });
  const undoBtn = document.getElementsByClassName('undo-btn')[0];
  undoBtn.onclick = undoBtnListener;
  const redoBtn = document.getElementsByClassName('redo-btn')[0];
  redoBtn.onclick = redoBtnListener;
  const restartBtn = document.getElementsByClassName('restart-btn')[0];
  restartBtn.onclick = restartBtnListener;
};
const initStart = () => {
  const Data = getData();
  if (Data.gameNow) {
    const _history = history.copy(
      Data.history,
      State(),
      Data.state,
      Data.current
    );
    history = _history;
    render();
  }
};

(() => {
  initStart();
  initListeners();

  Share.onmessage = ({ data }) => {
    const Data = getData();
    const _history = history.copy(
      Data.history,
      State(),
      Data.state,
      Data.current
    );
    history = _history;
    (data === 'restart' || data === 'step') && hideElement('won-title');
    render();
  };
})();

function calculateWinner(squares) {
  const lines = [...WIN_LINES];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i].indexes;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
