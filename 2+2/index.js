import { validateData } from './modules/validator.js';
import { sum, insertAfter, isElemExistByID, isElemExistByClassName } from './modules/helpers.js';

const COUNT_INPUTS = 2;

const clearErrors = () => {
  isElemExistByClassName('error-message') &&
    [...document.getElementsByClassName('error-message')].forEach((elem) => {
      elem.remove();
    });
};

const clearResult = () => {
  isElemExistByID('result') && document.getElementById('result').remove();
};

const notValidInputs = (errors) => {
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      const div = document.createElement('div');
      div.className = 'error-message';
      div.innerHTML = errors[key];
      const input = document.getElementById(key);
      insertAfter(div, input);
    }
  }
};

const getInputsValue = () => {
  const input1 = document.getElementById('input1');
  const input2 = document.getElementById('input2');
  return { input1: input1.value, input2: input2.value };
};

const btnListener = () => {
  const { input1, input2 } = getInputsValue();
  const { isValid, errors } = validateData({
    input1,
    input2,
  });

  clearErrors();
  clearResult();

  if (!isValid) {
    notValidInputs(errors);
    return;
  }
  const btn = document.getElementById('btn');
  const result = document.createElement('div');
  result.setAttribute('id', 'result');
  result.innerHTML = sum(input1, input2);
  insertAfter(result, btn);
};
//часть 5. снова все схожее, создать узел, приклеить его к другому узлу
const initInputs = (container) => {
  //по скольку у нас должно быть 2 поля ввода, то мы для удобства проходимся по циклу(цикл это повторение одних и тех же команд с счетчиком, в нашем примере счетчик от 1 до COUNT_INPUTS, то есть до 2х), мы используем цикл для того чтобы избежать написания одинакового куска кода дважды
  for (let i = 1; i <= COUNT_INPUTS; i++) {
    const input = document.createElement('INPUT'); //создаем узел input
    input.setAttribute('id', `input${i}`); //добавляем ему id - input1(для второго будет input2)
    input.setAttribute('type', 'text'); //нам нужно задать тип для наших полей ввода, они бывают разные, самыё известный, это text - обобщенный, для любого текста подходит
    container.appendChild(input); //ну и также приклеиваем наши два узла к узлу div с id - container
  } //теперь структура такая: html -> body-> div->btn
}; //                                            ->input
//                                               ->input
// это значит, что у узла div теперь 3 потомка  И так, пока подытожим, с 2й по 5й части у нас все срабатывало автоматически при загрузке нашей страничке, собственно построилось наше дерево связей и ты можешь увидеть на страничке 2 поля ввода для чисел и кнопку "посчитать", дальше мы будем рассматривать, что будет происходить при взаимодействии с программой(то есть, что происходит при нажатии на кнопку, при нажатии на поле ввода и печатании числа и тд)

//часть 4, так тут все очень похоже как с частью 3, нам нужно создать узел и приклеить его к другому узлу для связей, давай подробнее посмотрим на нашу функцию
const initBtn = (container) => {
  const btn = document.createElement('BUTTON'); //ну тут мы создаем узел button
  btn.setAttribute('id', 'btn'); //задаем уникальный id "btn"
  btn.innerHTML = 'Посчитать'; //смотри, вот эта важная детать, у узла есть свойство(innerHTML) это то ,что будет отображаться непосредственно на страничке, надпись на нашей кнопке
  container.appendChild(btn); //как помнишь в часте 3 мы цепляли узел div c id-container к body, а тут нам нужно прицепить наш узел кнопку к тому самому container, теперь часть дерева выглядить так: html->body->div->button
  btn.onclick = btnListener; //тоже очень важная строка, когда мы мышкой нажимаем на кнопку, должно что-то произойти, технически это называется: на узел button навесить событие onclick, при срабатывании этого события(при нажатии на кнопку) вызывается другая функция btnListener (о ней чуть позже: часть 4.1), смотри пока дальше часть 5
};

//часть 3. так как мы узучили в часте 1, у нас страница состоит из множеста узлов в виде дерева. Одна из главных веток это body как мы поняли. Ниже у нас функция, которая создает еще один узел div и приклеивает, цепляет его к body, теперь связь такая: html -> body -> div, теперь у body есть потомок - div, а у div есть отец - body(они связанные между собой)
const initContainer = () => {
  const container = document.createElement('div'); // создали узел
  container.style.display = 'table-caption'; //применили некоторые стили , в принципе не важные, это строка так меняет часть страницы нашей, что все узлы внутри будут одним столбцом(на скриншоте будет видно)
  container.setAttribute('id', 'container'); //это важная строка, мы нашему новому узлу создаем id(уникальный ключ, для удобства все называют его контейнером)
  document.body.appendChild(container); //ну и как я написал выше нам необходимо прицепить наш новый узел к body, чтобы образовалась связь, переходим к части 4
  return container;
};

//2 часть. тут начинает запускаться наш код, скажем это точка старта когда загружается страничка, для удобства мы написали 3 функции(функция это последовательность исполнения команд в коде, так же как и в жизни, у нас есть функции питания, ходьбы и так далее)
(() => {
  const container = initContainer(); // смотри часть 3
  initInputs(container); //смотри часть 4
  initBtn(container); //смотри часть 5
})();
//1 часть
//и так данная лаб. работа это калькулятор сложения чисел, нам нужно было создать два поля ввода для каждого числа и кнопку - "посчитать", собственно для вычисления результата. если в поля были введены не валидные значения(например буквы или символы такие как .?:;№" и так далее) то под полем ввода долждна появиться надпись -  "это не число" (увидишь на скриншоте). если же все хорошо и были введены числа (ну к примеру 1 и 4.5) то под кнопкой - "Посчитать" при ее нажатии появится результат сложения чисел (5.5)
//теперь немного теории,она важна для понимания программы и преподаватель может что-то из этого спросить, и так смотри, каждая страница в браузере, в интернете состоит из множества узлов (nodes), узлы бывают разные, текстовые (div,h1,h2...h6,p и так далее), кнопки(button), поля ввода(input), бывают и множество других (img для картинок к примеру) мы же рассмотрим те которые использутся в этой лабе(div, button, input)
//так давай подробнее остановимся на этих узлах, что это все же такое? вся твоя страница(любая, этот калькулятор, любой сайт, блог и так далее) состоит из дерева этих узлов, они между собой связные. дерево в прямом смысле ---- у нас есть корень html и от него идут ветки, к примеру одна из веток body, а от body идет еще много веток узлов div,button, input. если посмотришь внутри файлика index.html, то увидишь, что там body пустой и нам нужно было с помощью javascript все узлы создавать ручками(в этом от части суть всех лаб работ, научить студентов работать с этим деревом, его еще называют dom дерево, через код, мы написали много функций для этого)
//
