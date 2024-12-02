let tasks = [];

// Function to update task count display
function updateTaskCount() {
    const taskCount = document.getElementById('taskCount');
    taskCount.textContent = `Total Tasks: ${tasks.length} 📋`;
}

// Function to update task progress
function updateTaskProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const taskProgress = document.getElementById('taskProgress');
    taskProgress.textContent = `Completed: ${completedTasks} of ${totalTasks} tasks ✅`;
}

// Function to show toast notifications
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
        updateTaskCount();
        updateTaskProgress();
    }
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const categoryInput = document.getElementById('categoryInput');
    const tagsInput = document.getElementById('tagsInput');
    const noteInput = document.getElementById('noteInput');
    const recurrenceInput = document.getElementById('recurrenceInput');
    const collaboratorsInput = document.getElementById('collaboratorsInput');

    const task = {
        title: taskInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        category: categoryInput.value,
        tags: tagsInput.value.split(',').map(tag => tag.trim()),
        note: noteInput.value,
        recurrence: recurrenceInput.value,
        collaborators: collaboratorsInput.value.split(',').map(collaborator => collaborator.trim()),
        completed: false,
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateTaskCount();
    updateTaskProgress();
    showToast("✅ Task added successfully!");

    // Clear input fields
    taskInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = 'normal';
    categoryInput.value = 'work';
    tagsInput.value = '';
    noteInput.value = '';
    recurrenceInput.value = '';
    collaboratorsInput.value = '';
}

// Function to render tasks
function renderTasks(filter = 'all') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.innerHTML = `
             <strong>${task.title}</strong><br>
    Due: ${task.dueDate}<br>
    Priority: <span class="priority-${task.priority}">${task.priority}</span><br>
    Category: ${task.category}<br>
    Tags: ${task.tags.join(', ')}<br>
    Notes: ${task.note}<br>
    Recurrence: ${task.recurrence}<br>
    Collaborators: ${task.collaborators.join(', ')}
`;

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Undo ⏪' : 'Complete ✅';
        completeButton.onclick = () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            updateTaskCount();
            updateTaskProgress();
            showToast(task.completed ? "🎉 Task completed!" : "🔄 Task marked incomplete!");

            // Animation for completed tasks
            if (task.completed) {
                taskItem.classList.add('completed-animation');
                setTimeout(() => taskItem.classList.remove('completed-animation'), 1000);
            }
        };

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(completeButton);
        taskList.appendChild(taskItem);
    });
}

// Event listeners for buttons
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('showAll').addEventListener('click', () => renderTasks('all'));
document.getElementById('showCompleted').addEventListener('click', () => renderTasks('completed'));
document.getElementById('showIncomplete').addEventListener('click', () => renderTasks('incomplete'));
document.getElementById('sortAlphabetically').addEventListener('click', () => {
    tasks.sort((a, b) => a.title.localeCompare(b.title));
    saveTasks();
    renderTasks();
});
document.getElementById('sortByDueDate').addEventListener('click', () => {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    saveTasks();
    renderTasks();
});
document.getElementById('sortByPriority').addEventListener('click', () => {
    const priorityOrder = { low: 1, medium: 2, normal: 3, high: 4 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    saveTasks();
    renderTasks();
});
document.getElementById('clearCompleted').addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateTaskCount();
    updateTaskProgress();
    showToast("🗑️ Completed tasks cleared!");
});
document.getElementById('importTasks').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            tasks = JSON.parse(e.target.result);
            saveTasks();
            renderTasks();
            updateTaskCount();
            updateTaskProgress();
            showToast("📤 Tasks imported successfully!");
        };
        reader.readAsText(file);
    }
});
document.getElementById('exportTasks').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(tasks)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Load tasks on startup
loadTasks();

// Function to toggle the background visibility
function toggleBackground() {
    const container = document.querySelector('.container');
    const toggleButton = document.getElementById('toggleBackgroundBtn');
    
    if (container.style.backgroundColor) {
        container.style.backgroundColor = ''; // Clear background color to show the background image
        toggleButton.textContent = '🌅 Hide Background'; // Change button text
    } else {
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Set a solid color to obscure the background
        toggleButton.textContent = '🌅 View Background'; // Change button text
    }
}

// Event listener for the toggle button
document.getElementById('toggleBackgroundBtn').addEventListener('click', toggleBackground);

// Music toggle functionality
const musicToggle = document.getElementById('musicToggle');
musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggle.textContent = '🎵 Music On'; // Update button text
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = '🎵 Music Off'; // Update button text
    }
});

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '🌙 Light Mode' : '🌙 Dark Mode'; // Update button text
});
