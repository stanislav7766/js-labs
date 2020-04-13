const Nodes = () => {
  const _list = [];
  let index = 0;

  const push = (node) => {
    const element = {
      node,
      prev: index === 0 ? null : _list[index - 1],
      next: null,
    };
    element.prev && (element.prev.next = element);
    _list.push(element);
    index++;
  };
  const getList = () => _list;

  return {
    getList,
    push,
  };
};

export const arrLikeList = (arr, N = arr.length) => {
  const list = Nodes();
  for (let i = 0; i < N; i++) list.push(arr[i]);
  return list.getList();
};
