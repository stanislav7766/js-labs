// текущие состояние игры, хода, тут squares - 9 квадратиков\ячеек, каждый либо пустой, либо помечен "О" или "Х".xIsNext - информация о том, какой ход ожидается следующий
export const State = () => ({
  squares: Array(9).fill(''),
  xIsNext: true,
});
//массив с выиграшными комбинациями, и также указан тип линии для зачеркивания выиграшных квадратов для этой комбинации
export const WIN_LINES = [
  { indexes: [0, 1, 2], type: 'horizontal' },
  { indexes: [3, 4, 5], type: 'horizontal' },
  { indexes: [6, 7, 8], type: 'horizontal' },
  { indexes: [0, 3, 6], type: 'vertical' },
  { indexes: [1, 4, 7], type: 'vertical' },
  { indexes: [2, 5, 8], type: 'vertical' },
  { indexes: [0, 4, 8], type: 'diagonal-right' },
  { indexes: [2, 4, 6], type: 'diagonal-left' },
];
