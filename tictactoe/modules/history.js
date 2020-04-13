import Command from '/modules/command.js';

class History {
  constructor(state) {
    this.history = new Array();
    this.current = -1;
    this.state = state;
    this.gameNow = false;
  }
  startGame() {
    this.gameNow = true;
  }
  finishGame() {
    this.gameNow = false;
  }
  copy(history, State, state, current) {
    const copied = new History(State);
    history.forEach((el) => {
      const com = new Command(copied.state, el.index);
      com.previousCellState = el.previousCellState;
      com.nextCellState = el.nextCellState;
      copied.push(com);
    });
    copied.state = state;
    copied.current = current;
    return copied;
  }

  push(command) {
    this.current === -1 && this.startGame();
    this.canRedo() && this.history.splice(this.current + 1);

    this.current++;
    this.history.push(command);
    command.redo(this.state);
  }

  canUndo() {
    return this.current >= 0;
  }

  canRedo() {
    return this.current < this.history.length - 1;
  }

  undo() {
    if (this.canUndo()) {
      this.history[this.current].undo(this.state);
      this.current--;
    }
  }

  redo() {
    if (this.canRedo()) {
      this.current++;
      this.history[this.current].redo(this.state);
    }
  }

  setDefault(State) {
    this.history = new Array();
    this.current = -1;
    this.state = State;
    this.gameNow = false;
  }
}
export default History;
