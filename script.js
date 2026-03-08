document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Initialize tasks from localStorage or empty array
    let tasks = JSON.parse(localStorage.getItem('studentTasks')) || [];

    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('studentTasks', JSON.stringify(tasks));
    };

    // Render tasks
    const renderTasks = () => {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <p>No tasks yet. Add a task to get started!</p>
                </div>
            `;
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-checkbox-container">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                </div>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <button class="delete-btn" aria-label="Delete Task" data-index="${index}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            taskList.appendChild(li);
        });
    };

    // Helper to escape HTML to prevent XSS
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // Add new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        
        if (text) {
            tasks.push({
                text,
                completed: false,
                id: Date.now()
            });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    });

    // Handle complete and delete actions
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        
        // Handle Delete
        const deleteBtn = target.closest('.delete-btn');
        if (deleteBtn) {
            const index = parseInt(deleteBtn.getAttribute('data-index'), 10);
            
            // Add fade out animation logic
            const taskItem = deleteBtn.closest('.task-item');
            taskItem.style.opacity = '0';
            taskItem.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }, 300); // Wait for transition
            return;
        }

        // Handle Checkbox
        if (target.classList.contains('task-checkbox')) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            tasks[index].completed = target.checked;
            saveTasks();
            renderTasks();
        }
    });

    // Initial render
    renderTasks();
});
