class TaskModel {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    _commit(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTask(taskData) {
        const task = {
            id: Date.now().toString(),
            title: taskData.title,
            description: taskData.description || '',
            dueDate: taskData.dueDate || null,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        this.tasks.push(task);
        this._commit(this.tasks);
        return task;
    }

    getAllTasks() {
        return this.tasks;
    }

    getTasks(filters = { status: 'all', title: '' }) {
        let filteredTasks = [...this.tasks]; 

        // Filtracja po statusie
        if (filters.status && filters.status !== 'all') {
            filteredTasks = filteredTasks.filter(task =>
                filters.status === 'completed' ? task.completed : !task.completed
            );
        }

        if (filters.title) {
            const searchTerm = filters.title.toLowerCase();
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm)
            );
        }
        return filteredTasks;
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    updateTask(id, updatedData) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, ...updatedData, updatedAt: new Date().toISOString() } : task
        );
        this._commit(this.tasks);
        return this.getTaskById(id);
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this._commit(this.tasks);
    }

    toggleTaskCompletion(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.completed = !task.completed;
            this.updateTask(id, { completed: task.completed });
        }
        return task;
    }

    exportData() {
        return JSON.stringify(this.tasks, null, 2);
    }

    importData(jsonData) {
        try {
            const importedTasks = JSON.parse(jsonData);
            if (Array.isArray(importedTasks) && importedTasks.every(task => task.id && task.title)) {
                this.tasks = importedTasks;
                this._commit(this.tasks);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Błąd podczas importu danych:", error);
            return false;
        }
    }
}