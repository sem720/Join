async function fetchTasks() {
    try {
        const response = await fetch("https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"); // Replace with your actual API URL);
        const data = await response.json();
        if (!data) {
            console.warn("No tasks found in database.");
            return;
        }

        const tasks = Object.values(data);
        renderTasks(tasks)

    } catch (error) {
            console.error("Error fetching tasks:", error);
    }
}

function renderTasks(tasks) {
    const columnBody = document.querySelector(".column-body"); // ✅ Directly get "To Do" column

    if (!columnBody) {
        console.error("Error: 'To Do' column not found in the DOM.");
        return;
    }

    tasks.forEach(task => {
        console.log("Rendering task:", task);
        const taskElement = createTaskElement(task);
        columnBody.appendChild(taskElement);
    });
}


function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-card');

    let avatarsHTML = task.assignedTo ? task.assignedTo.map(user => 
        `<div class="avatar" style="background-color: ${user.avatar.bgcolor};">${user.avatar.initials}</div>`
    ).join('') : "";
    
    taskDiv.innerHTML = `
        <div class="task-category">${task.category}</div>
        <p class="task-title">${task.title}</p>
        <p class="task-description">${task.description}</p>
        <p class ="subtask-checked">${task.subtasks ? task.subtasks.length : 0} Subtasks</p>
        <div class="task-card-bottom">
            <div class="task-card-avatar">${avatarsHTML}</div>
            <img src="${task.priority.image}" alt="${task.priority.text}" class="prio-icon">
        </div>
    `;

    return taskDiv;
}

//Funktion zum Hinzufügen in die entsprechende Spalte, 
function addTaskToBoard(task) {
    const columnId = "todo-column";
    const taskElement = createTaskElement(task);
    document.getElementById(columnId).appendChild(taskElement);
}

//besonders für drag and drop dann interessant
function getColumnBody(category ) {
    const columnMap = {
        "To do": "todo-column",
        "In progress": "in-progress-column",
        "Await feedback": "await-feedback-column",
        "Done": "done-column"
    };

    const columnId = columnMap[category];
    if (!columnId) {
        console.warn(`No column mapping found for category: ${category}`);
        return null;
    }

    return document.getElementById(columnMap[category]);
}



// Call fetchTasks when the board loads
fetchTasks();

function findTask() {

}

function initBoard() {
    
}
