const API_URL = 'http://localhost:3000';

const todoListEl = document.querySelector('.todo-list');
const inputEl = document.querySelector('.input-group__input');
const addButtonEl = document.querySelector('.input-group__add-button');


let count = 0;
let todos = [
  {
    title: 'React 공부',
    complete: false
  }
] // 이것을 제이슨서버로 데이터를 만들고 업뎃하고 지우고 해볼거야

// 할 일 추가 (엔터키를 눌렀을 때)
inputEl.addEventListener('keypress', async e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    await addTodo(inputEl.textContent);
    inputEl.textContent = '';
    refreshTodoList();
  }
});

// 할 일 추가 (`+` 버튼을 클릭했을 때)
addButtonEl.addEventListener('click', async e => {
  await addTodo(inputEl.textContent);
  inputEl.textContent = '';
  refreshTodoList();
});

//추가
async function addTodo(title) {
  todos.push({
    id: count++,
    title,
    complete: false
  });
  //return 1;
  //return Promise.resolve(1); .then()콜백과 동일하게 작동함
  return fetch(`${API_URL}/todos`, {
    method: "post",
    body: JSON.stringify({
      title, //title: title
      complete: false
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

//삭제
async function removeTodo(todoId) { //todoId: todos의 식별자
  todos = todos.filter(t => t.id !== todoId);
  return fetch(`${API_URL}/todos/${todoId}`,{
    method: 'delete'
  });
}

//수정
async function updateTodo(todoId, complete) {
  return fetch(`${API_URL}/todos/${todoId}`,{
    method: 'PATCH',
    body: JSON.stringify({
      "complete":complete
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

async function refreshTodoList() {
  //REST API에서 할 일 목록 가져오기
  const res = await fetch(`${API_URL}/todos`);
  const todos = await res.json();

  // 현재 화면의 할 일 목록 삭제
  todoListEl.innerHTML = '';

  // 할 일 목록 새로 표시하기
  for (let {id, title, complete} of todos) { //restAPI에서 받아온 값에서 순회함
    const todoEl = document.createElement('div');
    todoEl.classList.add('todo-list__item');

    const todoTitleEl = document.createElement('div');
    todoTitleEl.classList.add('todo-list__title');
    todoTitleEl.textContent = title;
    if (complete) {
      todoTitleEl.classList.add('todo-list__title--complete');
    }
    todoTitleEl.addEventListener('click', async e => {
      await updateTodo(id, !complete);
      return refreshTodoList();
    });
    todoEl.appendChild(todoTitleEl);

    const todoRemoveEl = document.createElement('div');
    todoRemoveEl.classList.add('todo-list__remove-button');
    todoRemoveEl.addEventListener('click', async e => {
      await removeTodo(id);
      return refreshTodoList();
    })
    todoEl.appendChild(todoRemoveEl);

    todoListEl.appendChild(todoEl);
  }
}

refreshTodoList();
