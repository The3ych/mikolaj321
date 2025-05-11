document.addEventListener('DOMContentLoaded', () => {
    const app = new TaskController(new TaskModel(), new TaskView());
});