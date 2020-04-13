class Command {
  constructor(state, index) {
    this.index = index;
    this.previousCellState = state.squares[index];
    this.nextCellState = state.xIsNext ? 'X' : 'O';
  }

  undo(state) {
    state.squares[this.index] = this.previousCellState;
    state.xIsNext = !state.xIsNext;
  }

  redo(state) {
    state.squares[this.index] = this.nextCellState;
    state.xIsNext = !state.xIsNext;
  }
}
export default Command;
