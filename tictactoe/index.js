import Command from './modules/command.js';
import History from './modules/history.js';
import { State, WIN_LINES } from './modules/data.js';
import { hideElement, getData, setData, activeBtn, disableBtn } from './modules/helpers.js';
//для синхроницации между вкладками мы используем BroadcastChannel. логика похожа с кнопками узлами, как помнишь мы на кнопку навешивали событие, что при нажатии на кнопку будет вызываться функция. тут также, мы открыли канал, ниже в коде мы навесим событие onmessage и когда нужно сможем отправлять сообщения, и во всех вкладках, где открыта игра, будут приходить эти сообщения
const Share = new BroadcastChannel('test_channel');
// предисловие
// и так давай крестики нолики, основные требования: синхронизация между вкладками, при перезагрузки страницы незавершенная игра продолжается, начать новую игру без перезвгрузки стр, возможность делать шаг назад и вперед во время игры
// все стили уже прописаны до нас(в файлике style.css)мы лишь обеспечиваем функциональность, то есть в нужный момент мы у узла будем менять\добавлять classNames

//для обеспечения хода назад и вперед у нас будет история игры с состоянием хода. это значит, что в процессе игры мы точно будем знать, какой ход был предыдущий, что следующий ход будет крестик, если предыдущий нолик и тд
let history = new History(State());
// мы написали такую вот функцию MakeSync для синхронизации игры. как помнишь в списке дел мы использовали хранилище localStorage) тут тоже, но там мы хранили записи списка дел, а тут храним всю историю ходов(соответсвенно каждый ход мы обновляем историю в хранилище)
// хорошо, что по коду
const MakeSync = (type) => {
  setData(history); //записываем всю историю ходов в хранилище
  Share.postMessage(type); //и отправляем сообщение по нашему каналу, отправляем переданный тип, о типах чуть позже, но суть в том, что под определенный тип - свой сценарий событий
};

const statusGame = () => {
  if (calculateWinner(history.state.squares)) return 1;
  else if (history.current == 8) return 2;
  else return 0;
};
// statusGame, checkEndGame - две не сильно важные функции, но написаны для удобства, их задача по текущему состоянию хода (history state) проверить статус игры, завершенная игра или нет

const checkEndGame = (status = statusGame()) => status === 1 || status === 2;

//важная функция для понимания логики в целом, вызывается практически везде,в обработчике каждой кнопки, при старте игры, при синхронизации между вкладками. У нас в истории ходов в состоянии текущего хода хранится массив из 9 элеметов - наши квадратики(как и пустые, помеченные крестом и ноликом)
// и вот логика такая, что когда нужно отобразить изменения, то мы проходимся по этим квадратикам в нашей истории, и в зависимости от содержимого, меняем у узла на страничке его className,(а как мы помним когда мы меняем его то применяются разные стили)
// еще раз, цепочка событий такая: мы нажали на пустой квадратик или кнопку любую->изменилась история игры->в состоянии пометился конкретно тот квадратик крестиком или ноликом->вызвался render и вот только в этот момент на страничке произошли визуальные изменения и наш ход отобразился в игре
// какой className меняется написано в задании
const render = () => {
  history.state.squares.forEach((val, i) => {
    const node = document.querySelector(`[data-id="${i}"]`);
    val === '' ? (node.className = 'cell') : (node.className = `cell ${val === 'X' ? 'ch' : 'r'}`);
  });
  checkButtons();
  checkEndGame() && endGame(); //так же проверка в каждом рендере, если последний сделанный ход был завершающим, то вызовем endGame(глянь описание его)
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

const endGame = () => {
  const node = document.getElementsByClassName('won-title')[0];
  node.className = 'won-title';
  const textNode = document.getElementsByClassName('won-message')[0];
  const status = statusGame();
  textNode.innerHTML = status === 2 ? `It's a draw!` : history.state.xIsNext ? `Toes won!` : `Crosses won!`;

  if (status === 1) {
    const line = calculateWinner(history.state.squares);
    line.indexes.forEach((index) => {
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
    const _history = history.copy(Data.history, State(), Data.state, Data.current);
    history = _history;
    render();
  }
};

(() => {
  initStart();
  initListeners();

  Share.onmessage = ({ data }) => {
    const Data = getData();
    const _history = history.copy(Data.history, State(), Data.state, Data.current);
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
