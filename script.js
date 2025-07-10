document.addEventListener('DOMContentLoaded', () => {
    let tasks = []; // Array para armazenar os objetos de tarefa
    let nextTaskId = 1; // Para gerar IDs únicos para as tarefas

    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const filterPrioritySelect = document.getElementById('filter-priority');

    // Funções para LocalStorage (mantidas da versão anterior, são importantes!)
    const saveTasksToLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            // Garante que o nextTaskId continue de onde parou
            const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
            nextTaskId = maxId + 1;
        }
    };

    // Função para adicionar uma nova tarefa
    const addTask = (event) => {
        event.preventDefault();

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
            status: 'pendente'
        };

        tasks.push(newTask);
        saveTasksToLocalStorage();
        renderTasks(); // Renderiza a lista atualizada
        taskForm.reset();
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

        let delay = 0; // Para o efeito cascata
        filteredTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item'); // Começa com opacidade 0 e translateX de -50px pelo CSS
            if (task.status === 'concluida') {
                listItem.classList.add('completed');
            }
            listItem.setAttribute('data-id', task.id);

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

            // Adiciona a classe 'show' após um pequeno atraso para a animação
            // O setTimeout com delay cria o efeito cascata
            setTimeout(() => {
                listItem.classList.add('show');
            }, delay);
            delay += 100; // Incrementa o atraso para o próximo item (100ms de diferença)
        });
    };

    // Função para marcar/desmarcar tarefa como concluída
    const toggleTaskStatus = (id) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex].status = tasks[taskIndex].status === 'pendente' ? 'concluida' : 'pendente';
            saveTasksToLocalStorage();
            // Não é necessário animar aqui, o CSS handleia a mudança de estilo para '.completed'
            // Apenas renderiza para atualizar o texto do botão "Marcar/Desmarcar"
            renderTasks();
        }
    };

    // Função para remover tarefa com animação de saída
    const deleteTask = (id) => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            const itemToRemove = taskList.querySelector(`[data-id="${id}"]`);
            if (itemToRemove) {
                // Adiciona a classe 'hide' para iniciar a animação de saída
                itemToRemove.classList.add('hide');

                // Espera a animação terminar antes de remover o elemento do DOM
                // A duração da transição no CSS é 0.5s, então esperamos um pouco mais
                itemToRemove.addEventListener('transitionend', function handler() {
                    itemToRemove.removeEventListener('transitionend', handler); // Remove o listener para evitar múltiplos disparos
                    tasks = tasks.filter(task => task.id !== id);
                    saveTasksToLocalStorage();
                    renderTasks(); // Renderiza novamente sem o item excluído
                });
            } else { // Caso o item não seja encontrado (por algum motivo), remove diretamente
                tasks = tasks.filter(task => task.id !== id);
                saveTasksToLocalStorage();
                renderTasks();
            }
        }
    };

    // Função para editar tarefa
    const editTask = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newName = prompt('Editar nome da tarefa:', task.name);
            if (newName !== null && newName.trim() !== '') {
                task.name = newName.trim();
                saveTasksToLocalStorage();
                renderTasks();
            }
        }
    };

    // Event Listeners
    taskForm.addEventListener('submit', addTask);

    taskList.addEventListener('click', (event) => {
        const target = event.target;
        const taskId = parseInt(target.dataset.id);

        if (target.classList.contains('mark-completed-btn')) {
            toggleTaskStatus(taskId);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (target.classList.contains('edit-btn')) {
            editTask(taskId);
        }
    });

    filterPrioritySelect.addEventListener('change', renderTasks);

    // Carrega as tarefas do LocalStorage ao iniciar e as renderiza
    loadTasksFromLocalStorage();
    renderTasks();
});
// ... (seu código script.js atual) ...

// Função para renderizar as tarefas na tela
const renderTasks = () => {
    taskList.innerHTML = '';

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

    let delay = 0; // Para o efeito cascata
    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item'); // Começa com opacidade 0 e translateY de -50px pelo CSS
        if (task.status === 'concluida') {
            listItem.classList.add('completed');
        }
        listItem.setAttribute('data-id', task.id);

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

        // Adiciona a classe 'show' após um pequeno atraso para a animação
        // O setTimeout com delay cria o efeito cascata
        setTimeout(() => {
            listItem.classList.add('show');
        }, delay);
        delay += 100; // Incrementa o atraso para o próximo item (100ms de diferença)
    });
};

// ... (resto do seu script.js, incluindo deleteTask com o addEventListener('transitionend')) ...