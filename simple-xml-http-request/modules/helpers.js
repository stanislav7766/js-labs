// часть 4 . все функции тут написано только для удобства и чтобы не писать одинаковый код(где будет отличаться одна строка) по несколько раз(такие разделения хороший тон для програмирования)
//  для удобства написана функция , что возвращает для удачного ответа, при запросе на сервер, объект с свойствами text - ok и textStyle - стили
export const resOK = () => ({
  text: 'OK',
  textStyle: { color: 'green', 'font-weight': 'bold' },
});
//  для удобства написана функция , что возвращает для не удачного ответа, при запросе на сервер, объект с свойствами text - failed и textStyle - стили
export const resFailed = () => ({
  text: 'Failed',
  textStyle: { color: 'red', 'font-weight': 'bold' },
});
// функция для проверки успешный мы отправили запрос или нет
export const checkSuccess = ({ status, response }) => status === 200 && JSON.parse(response).status === 'ok';
// функция для применения нужных стилей для определенного узла, на вход у функции идут className(по нему мы будет искать узел в дереве),text(текст который мы заменим в соответствии с результатом запроса, тот текст что сменится с pending на ok или failed) и часть стилей, которые мы применим к нашему узлу, чтобы изменить вид его текста на страничке, они объявлены выше
export const applyStyles = ({ className, text, textStyle }) => {
  const [span] = document.getElementsByClassName(className);
  span.style.color = textStyle.color;
  span.style.fontWeight = textStyle['font-weight'];
  span.innerText = text;
};
