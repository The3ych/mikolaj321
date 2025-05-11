class TaskView {
    constructor() {
        this.taskList = document.getElementById('taskList');
        this.taskForm = document.getElementById('addTaskForm');
        this.taskTitleInput = document.getElementById('taskTitle');
        this.taskDescriptionInput = document.getElementById('taskDescription');
        this.taskDueDateInput = document.getElementById('taskDueDate');

        this.exportButton = document.getElementById('exportData');
        this.importFileLabel = document.querySelector('label[for="importFile"]');
        this.importFileInput = document.getElementById('importFile');

        this.filterStatusSelect = document.getElementById('filterStatus');
        this.filterTitleInput = document.getElementById('filterTitle');
    }

    displayTasks(tasks) {
        while (this.taskList.firstChild) {
            this.taskList.removeChild(this.taskList.firstChild);
        }

        if (tasks.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Brak zadań do wyświetlenia.';
            this.taskList.appendChild(p);
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.id = `task-${task.id}`;
            li.className = task.completed ? 'completed' : '';

            const taskDetails = document.createElement('div');
            taskDetails.className = 'task-details';

            const title = document.createElement('h3');
            title.textContent = task.title;

            const description = document.createElement('p');
            description.textContent = task.description || 'Brak opisu.';

            const dueDate = document.createElement('p');
            dueDate.textContent = task.dueDate ? `Termin: ${new Date(task.dueDate).toLocaleDateString()}` : 'Brak terminu.';
            
            const createdAt = document.createElement('p');
            createdAt.textContent = `Utworzono: ${new Date(task.createdAt).toLocaleString()}`;
            createdAt.style.fontSize = '0.8em';
            createdAt.style.color = '#777';


            taskDetails.appendChild(title);
            taskDetails.appendChild(description);
            taskDetails.appendChild(dueDate);
            taskDetails.appendChild(createdAt);


            const actions = document.createElement('div');
            actions.className = 'actions';

            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Oznacz jako nieukończone' : 'Oznacz jako ukończone';
            completeButton.dataset.id = task.id;
            completeButton.className = 'complete-btn';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edytuj';
            editButton.dataset.id = task.id;
            editButton.className = 'edit-btn';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Usuń';
            deleteButton.dataset.id = task.id;
            deleteButton.className = 'delete-btn';

            actions.appendChild(completeButton);
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            li.appendChild(taskDetails);
            li.appendChild(actions);
            this.taskList.appendChild(li);
        });
    }

    getTaskInput() {
        return {
            title: this.taskTitleInput.value,
            description: this.taskDescriptionInput.value,
            dueDate: this.taskDueDateInput.value
        };
    }

    resetTaskInput() {
        this.taskTitleInput.value = '';
        this.taskDescriptionInput.value = '';
        this.taskDueDateInput.value = '';
    }

    getFilterCriteria() {
        return {
            status: this.filterStatusSelect.value,
            title: this.filterTitleInput.value
        };
    }

    bindAddTask(handler) {
        this.taskForm.addEventListener('submit', event => {
            event.preventDefault();
            const taskData = this.getTaskInput();
            if (taskData.title) {
                handler(taskData);
                this.resetTaskInput();
            }
        });
    }

    bindDeleteTask(handler) {
        this.taskList.addEventListener('click', event => {
            if (event.target.classList.contains('delete-btn')) {
                const id = event.target.dataset.id;
                handler(id);
            }
        });
    }

    bindToggleTask(handler) {
        this.taskList.addEventListener('click', event => {
            if (event.target.classList.contains('complete-btn')) {
                const id = event.target.dataset.id;
                handler(id);
            }
        });
    }
    
    bindEditTask(handler) {
        this.taskList.addEventListener('click', event => {
            if (event.target.classList.contains('edit-btn')) {
                const id = event.target.dataset.id;
                alert(`Funkcjonalność edycji dla zadania ${id} do zaimplementowania.`);
            }
        });
    }

    bindFilterChange(handler) {
        this.filterStatusSelect.addEventListener('change', () => handler(this.getFilterCriteria()));
        this.filterTitleInput.addEventListener('input', () => handler(this.getFilterCriteria()));
    }

    bindExportData(handler) {
        this.exportButton.addEventListener('click', () => {
            handler();
        });
    }

    bindImportData(handler) {
        this.importFileInput.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) {
                handler(file);
                event.target.value = null;
            }
        });
    }

    triggerDownload(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}