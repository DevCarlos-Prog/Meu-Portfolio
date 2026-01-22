const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const allBtn = document.getElementById('all-btn');
const completedBtn = document.getElementById('completed-btn');
const incompleteBtn = document.getElementById('incomplete-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Função para renderizar as tarefas
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) {
      li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remover';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Função para adicionar uma nova tarefa
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
});

// Função para salvar as tarefas no localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funções para filtrar as tarefas
allBtn.addEventListener('click', () => {
  setActiveFilter('all');
  renderTasks('all');
});

completedBtn.addEventListener('click', () => {
  setActiveFilter('completed');
  renderTasks('completed');
});

incompleteBtn.addEventListener('click', () => {
  setActiveFilter('incomplete');
  renderTasks('incomplete');
});

// Função para definir o filtro ativo
function setActiveFilter(filter) {
  document.querySelectorAll('.filters button').forEach((btn) => {
    btn.classList.remove('active');
  });
  document.getElementById(`${filter}-btn`).classList.add('active');
}

// Renderizar as tarefas ao carregar a página
renderTasks();