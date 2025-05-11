class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.currentFilterCriteria = this.view.getFilterCriteria();

        this.refreshTaskList();

        this.view.bindAddTask(this.handleAddTask.bind(this));
        this.view.bindDeleteTask(this.handleDeleteTask.bind(this));
        this.view.bindToggleTask(this.handleToggleTask.bind(this));
        this.view.bindEditTask(this.handleEditTask.bind(this));

        this.view.bindExportData(this.handleExportData.bind(this));
        this.view.bindImportData(this.handleImportData.bind(this));
        this.view.bindFilterChange(this.handleFilterChange.bind(this));
    }

    refreshTaskList() {
        const tasks = this.model.getTasks(this.currentFilterCriteria);
        this.view.displayTasks(tasks);
    }

    handleFilterChange(criteria) {
        this.currentFilterCriteria = criteria;
        this.refreshTaskList();
    }

    handleAddTask(taskData) {
        this.model.addTask(taskData);
        this.refreshTaskList();
    }

    handleDeleteTask(id) {
        this.model.deleteTask(id);
        this.refreshTaskList();
    }

    handleToggleTask(id) {
        this.model.toggleTaskCompletion(id);
        this.refreshTaskList();
    }
    
    handleEditTask(id) {
        const task = this.model.getTaskById(id);
        if (task) {
            const newTitle = prompt("Wprowadź nowy tytuł:", task.title);
            const newDescription = prompt("Wprowadź nowy opis:", task.description);
            if (newTitle !== null) {
                this.model.updateTask(id, { title: newTitle, description: newDescription || task.description });
                this.refreshTaskList();
            }
        }
    }

    handleExportData() {
        const jsonData = this.model.exportData();
        this.view.triggerDownload('tasks.json', jsonData);
    }

    handleImportData(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const jsonData = event.target.result;
            if (this.model.importData(jsonData)) {
                this.currentFilterCriteria = { status: 'all', title: '' };
                this.view.filterStatusSelect.value = 'all';
                this.view.filterTitleInput.value = '';
                this.refreshTaskList();
                alert('Dane zaimportowano pomyślnie!');
            } else {
                alert('Błąd podczas importu danych. Sprawdź format pliku JSON.');
            }
        };
        reader.readAsText(file);
    }
}