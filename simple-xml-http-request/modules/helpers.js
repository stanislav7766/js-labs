export const resOK = () => ({
  text: 'OK',
  textStyle: { color: 'green', 'font-weight': 'bold' },
});
export const resFailed = () => ({
  text: 'Failed',
  textStyle: { color: 'red', 'font-weight': 'bold' },
});

export const checkSuccess = ({ status, response }) =>
  status === 200 && JSON.parse(response).status === 'ok';

export const applyStyles = ({ className, text, textStyle }) => {
  const [span] = document.getElementsByClassName(className);
  span.style.color = textStyle.color;
  span.style.fontWeight = textStyle['font-weight'];
  span.innerText = text;
};
