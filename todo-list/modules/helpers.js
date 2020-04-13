export const emptyStr = (value) => value === '';

export const clearUL = () => {
  const ul = document.getElementById('ul');
  ul.innerHTML = '';
  return ul;
};
export const getTasks = () => {
  const taskJson = localStorage.getItem('tasks') || '[]';
  return JSON.parse(taskJson);
};

export const setTasks = (tasks) =>
  localStorage.setItem('tasks', JSON.stringify(tasks));
export const sortTasks = (tasks) =>
  tasks.sort((a, b) => {
    const aa = a.toLowerCase(),
      bb = b.toLowerCase();
    return aa === bb ? 0 : aa > bb ? 1 : -1;
  });
