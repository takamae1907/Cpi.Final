document.addEventListener('DOMContentLoaded', () => {
    let tasks = []; // Array para armazenar os objetos de tarefa
    let nextTaskId = 1; // Para gerar IDs únicos para as tarefas

    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const filterPrioritySelect = document.getElementById('filter-priority');

    // Função para adicionar uma nova tarefa
    const addTask = (event) => {
        event.preventDefault(); // Impede o recarregamento da página ao enviar o formulário

        const taskName = taskNameInput.value.trim();
        const taskPriority = taskPrioritySelect.value;

        if (taskName === '') {
            alert('Por favor, digite o nome da tarefa!');
            return;
        }

        const newTask = {
            id: nextTaskId++,
            name: taskName,
            priority: taskPriority,
            status: 'pendente' // 'pendente' ou 'concluida'
        };

        tasks.push(newTask);
        renderTasks(); // Renderiza a lista atualizada
        taskForm.reset(); // Limpa o formulário
    };

    // Função para renderizar as tarefas na tela
    const renderTasks = () => {
        taskList.innerHTML = ''; // Limpa a lista atual antes de renderizar

        const currentFilter = filterPrioritySelect.value;
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'todas') {
                return true;
            }
            return task.priority === currentFilter;
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li class="no-tasks">Nenhuma tarefa para exibir.</li>';
            return;
        }

        filteredTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            if (task.status === 'concluida') {
                listItem.classList.add('completed');
            }
            listItem.setAttribute('data-id', task.id); // Adiciona um atributo de dado para o ID

            listItem.innerHTML = `
                <div class="task-info">
                    <h3>${task.name}</h3>
                    <p>Prioridade: <span class="task-priority-tag priority-${task.priority}">${task.priority.toUpperCase()}</span></p>
                </div>
                <div class="task-actions">
                    <button class="mark-completed-btn" data-id="${task.id}">
                        ${task.status === 'pendente' ? 'Marcar Concluída' : 'Desmarcar'}
                    </button>
                    <button class="edit-btn" data-id="${task.id}">Editar</button>
                    <button class="delete-btn" data-id="${task.id}">Excluir</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    };

    // Função para marcar/desmarcar tarefa como concluída
    const toggleTaskStatus = (id) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex].status = tasks[taskIndex].status === 'pendente' ? 'concluida' : 'pendente';
            renderTasks();
        }
    };

    // Função para remover tarefa
    const deleteTask = (id) => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }
    };

    // Função para editar tarefa (opcionalmente pode ser um modal ou mudar o texto inline)
    const editTask = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newName = prompt('Editar nome da tarefa:', task.name);
            if (newName !== null && newName.trim() !== '') {
                task.name = newName.trim();
                renderTasks();
            }
        }
    };

    // Event Listeners
    taskForm.addEventListener('submit', addTask);

    taskList.addEventListener('click', (event) => {
        const target = event.target;
        const taskId = parseInt(target.dataset.id); // Obtém o ID do atributo data-id

        if (target.classList.contains('mark-completed-btn')) {
            toggleTaskStatus(taskId);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (target.classList.contains('edit-btn')) {
            editTask(taskId);
        }
    });

    filterPrioritySelect.addEventListener('change', renderTasks);

    // Renderiza as tarefas ao carregar a página (caso tenha alguma tarefa inicial ou de local storage, etc.)
    renderTasks();
});