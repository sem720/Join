document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector(".close-btn");
    const overlay = document.querySelector(".overlay");

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.getElementById("category-container").addEventListener("click", function (event) {
        if (event.target.id === "dropdown-btn") {
            event.stopPropagation(); // Prevent modal from closing
            console.log("Category button clicked, modal should stay open.");
        }
    });
});

function openAddTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");
  
    overlay.classList.remove("hidden");
    modal.classList.remove("show");    
    modal.classList.remove("hidden");  
  
    void modal.offsetHeight; // or modal.offsetWidth
  
    modal.classList.add("show");
  
    fetchAddTaskContent();
}
  
function closeModal(event) {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    if (modal.contains(event.target) && !event.target.classList.contains('close-btn')) {
        return;
    }
  
    overlay.classList.add("hidden");
    modal.classList.remove("show");
  
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 400); 
}

function fetchAddTaskContent() {
    fetch("/addTask/addTaskContent.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("modal-body").innerHTML = data;

            const tempElement = document.createElement('div');
            tempElement.innerHTML = data;

            const scripts = tempElement.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            });
        })
        .catch(error => console.error('Error fetching addTaskContent.html:', error));
}

function toggleButtons(button) {
    const buttons = document.querySelectorAll('.btn-switch');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

function clearTask() {
    // Implement the clear task functionality
    console.log("Clear task function called");
}

function createTask(event) {
    event.preventDefault();
    // Implement the create task functionality
    console.log("Create task function called");
}
function findTask() {

}

function initBoard() {
    
}

async function fetchTasks() {
    try {
        const response = await fetch("https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"); // Replace with your actual API URL);
        const data = await response.json();
        if (!data) return;

        const tasks = Object.values(data);
        renderTasks(tasks)

        console.log("Fetched tasks:", tasks);

    } catch (error) {
            console.error("Error fetching tasks:", error);
    }
}

function renderTasks(tasks) {
    clearTaskContainers();

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        const columnBody = getColumnBody(task.category);
        if (columnBody) columnBody.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-card');
    taskDiv.innerHTML = `
        <span class="task-category">${task.category}</span>
        <p class="task-title">${task.title}</p>
        <p class="task-description">${task.description}</p>
        <p class ="subtask-checked">${task.subtask}</p>
        <div class="task-card-bottom>
            <div class="task-card-avatar"></div>
            <img src="" alt="">
        </div>
        `;
    return taskDiv;
}

function getColumnBody(category) {
    const columnMap = {
        "technical_task": document.querySelector("#to-do .column-body"),
        "in_progress": document.querySelector("#in-progress .column-body"),
        "await_feedback": document.querySelector("#await-feedback .column-body"),
        "done": document.querySelector("#done .column-body"),
    };
    return columnMap[category] || null;
}

function clearTaskContainers() {
    document.querySelectorAll(".column-body").forEach(body => body.innerHTML = "");
}

// Call fetchTasks when the board loads
fetchTasks();