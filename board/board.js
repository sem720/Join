async function fetchTasks() {
    try {
        const response = await fetch("https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json");
        const data = await response.json();

        if (!data) {
            console.warn("⚠️ Keine Tasks in der Datenbank gefunden.");
            return;
        }

        const tasks = Object.keys(data).map(taskId => ({
            id: taskId, // Verwenden des Firebase-Schlüssels als ID
            ...data[taskId] // Alle anderen Felder übernehmen
        }));

        renderTasks(tasks);
        initTaskCardClickEvents(); // Event-Listener für Klick-Events setzen
        setupDragAndDrop(); // Drag & Drop nach dem Rendern aktivieren

    } catch (error) {
        console.error("❌ Fehler beim Laden der Tasks:", error);
    }
}




function renderTasks(tasks) {
    const columnMap = {
        "To do": document.querySelector("#to-do .column-body"),
        "In progress": document.querySelector("#in-progress .column-body"),
        "Await feedback": document.querySelector("#awaitFeedback .column-body"),
        "Done": document.querySelector("#done .column-body")
    };

    tasks.forEach(task => {
        let category = task.mainCategory || "To do";  // Falls `mainCategory` fehlt, Standardwert setzen
        const column = columnMap[category];
        if (!column) {
            console.warn(`⚠️ Keine passende Spalte für Kategorie: ${category}`);
            return;
        }

        const taskElement = createTaskElement(task);
        column.appendChild(taskElement);
    });

    updateNoTaskVisibility();
    initTaskCardClickEvents(); // Klick-Events für das Overlay registrieren
}



function createTaskTemplate(task) {
    let categoryColor = "";

    if (task.category === "User Story") {
        categoryColor = "#0039fe";
    } else if (task.category === "Technical Task") {
        categoryColor = "#1fd7c1";
    }

    let avatarsHTML = task.assignedTo ? task.assignedTo.map(user =>
        `<div class="avatar-board-card" style="background-color: ${user.avatar.bgcolor};">${user.avatar.initials}</div>`
    ).join('') : "";

    return `
        <div class="task-category" style="background-color: ${categoryColor};">
            ${task.category}
        </div>
        <p class="task-title">${task.title}</p>
        <p class="task-description">${task.description}</p>
        <div class="subtask-bar" id="subtaskBar">
            <div class="subtask-bar-progress" id="subtaskBarProgress">
                <div class="subtask-bar-prog-blue" style="width: 20%;"></div>
            </div>
            <p class ="subtask-checked">
                ${task.subtasks ? task.subtasks.length : 0} Subtasks
            </p>
        </div>
        <div class="task-card-footer">
            <div class="task-card-avatar">${avatarsHTML}</div>
            <img src="${task.priority.image}" alt="${task.priority.text}" class="prio-icon">
        </div>
    `;
}


function createTaskElement(task) {
    let categoryColor = "";

    if (task.category === "User Story") {
        categoryColor = "#0039fe";
    } else if (task.category === "Technical Task") {
        categoryColor = "#1fd7c1";
    }

    const avatarsHTML = task.assignedTo
        ? task.assignedTo.map(user =>
            `<div class="avatar-board-card" style="background-color: ${user.avatar.bgcolor};">${user.avatar.initials}</div>`
        ).join("")
        : "";

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card");
    taskDiv.setAttribute("data-id", task.id); // Task-ID setzen für Drag & Drop und Klick-Events

    taskDiv.innerHTML = `
        <div class="task-category" style="background-color: ${categoryColor};">
            ${task.category || "No Category"}
        </div>
        <h3 class="task-title">${task.title || "No Title"}</h3>
        <p class="task-description">${task.description || "No Description"}</p>
        <div class="task-card-footer">
            <div class="task-card-avatar">${avatarsHTML}</div>
            <img src="${task.priority?.image || ''}" alt="${task.priority?.text || ''}" class="prio-icon">
        </div>
    `;

    return taskDiv;
}




//Funktion zum Hinzufügen in die entsprechende Spalte
function addTaskToBoard(task) {
    const columnId = "todo-column";
    const taskElement = createTaskElement(task);
    document.getElementById(columnId).appendChild(taskElement);
}

//besonders für drag and drop dann interessant
function getColumnBody(category) {
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
// fetchTasks();


function updateNoTaskVisibility() {
    document.querySelectorAll(".column-body").forEach(column => {
        const noTaskDiv = column.querySelector(".no-task");
        const hasTasks = column.querySelector(".task-card") !== null;

        if (hasTasks) {
            noTaskDiv.classList.add("d-none"); // Verstecke "No Tasks"
        } else {
            noTaskDiv.classList.remove("d-none"); // Zeige "No Tasks" wieder an
        }
    });
}


function setupDragAndDrop() {
    document.querySelectorAll(".task-card").forEach(task => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", handleDragStart);
        task.addEventListener("dragend", handleDragEnd);
    });

    document.querySelectorAll(".column-body").forEach(column => {
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleDrop);
        column.addEventListener("dragleave", handleDragLeave);
    });
}
let draggedTask = null;

function handleDragStart(event) {
    draggedTask = event.target;
    event.target.style.opacity = "0.5";
    event.dataTransfer.effectAllowed = "move";
}

function handleDragEnd(event) {
    event.target.style.opacity = "1";
    draggedTask = null;
}

function handleDragOver(event) {
    event.preventDefault(); // Erlaubt das Ablegen
    event.currentTarget.classList.add("drag-over");
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove("drag-over");
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");

    if (draggedTask) {
        const newColumn = event.currentTarget;
        newColumn.appendChild(draggedTask);

        // Aktualisiere die mainCategory des verschobenen Tasks
        updateTaskCategory(draggedTask, newColumn.id);

        // 🛠 Nach Drag & Drop die "no-task"-Anzeige prüfen
        updateNoTaskVisibility();
    }
}

async function updateTaskCategory(taskElement, newColumnId) {
    const taskId = taskElement.dataset.id; // ID aus Dataset abrufen
    const newCategory = mapColumnIdToCategory(newColumnId);

    if (!taskId || !newCategory) return;

    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mainCategory: newCategory })
        });

        console.log(`✅ Task ${taskId} wurde in "${newCategory}" verschoben.`);
    } catch (error) {
        console.error("❌ Fehler beim Aktualisieren der Task-Kategorie:", error);
    }
}
function mapColumnIdToCategory(columnId) {
    const columnMap = {
        "to-do-body": "To do",
        "in-progress-body": "In progress",
        "awaitFeedback-body": "Await feedback",
        "done-body": "Done"
    };
    return columnMap[columnId] || null;
}
document.addEventListener("DOMContentLoaded", setupDragAndDrop);

















// Öffnet das Task-Detail-Overlay
function openTaskDetail(task) {
    if (!task) {
        console.error("⚠️ Keine Task-Daten vorhanden!");
        return;
    }
    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailContent = document.getElementById("taskDetailContent");
    let categoryColor = "";
    if (task.category === "User Story") {
        categoryColor = "#0039fe";
    } else if (task.category === "Technical Task") {
        categoryColor = "#1fd7c1";
    }

    let subtasksHTML = "";
    if (!task.subtasks || task.subtasks.length === 0) {
        subtasksHTML = `<p>Keine Subtasks vorhanden</p>`;
    } else {
        subtasksHTML = task.subtasks.map(subtask => `
                <div class="subtasks-content">
                    <input type="checkbox" ${subtask.completed ? "checked" : ""} />
                    <label>${subtask.name}</label>
                </div>
            `).join("");
    }

    // HTML für die Task-Details generieren
    taskDetailContent.innerHTML = `
        <div class="task-detail-header">
            <span class="task-detail-category" style="background: ${categoryColor};">
                ${task.category}
            </span>
        </div>
        <h2 class="task-detail-title">${task.title}</h2>
        <p class="task-detail-content">${task.description}</p>
        <p><strong style="padding-right: 16px;">Due date:</strong> ${formatDate(task.dueDate)}</p>
        <p><strong style="padding-right: 16px;">Priority:</strong> ${task.priority.text} <img src="${task.priority?.image || ''}" alt="${task.priority?.text || ''}" class="prio-icon">
        </p>
        <p style="padding-bottom: 0;"><strong>Assigned To:</strong></p>
        <ul>
            ${task.assignedTo.map(user => `
                <li style="display: flex; align-items: center; gap: 8px;">
                    <div class="avatar-board-card" style="background-color: ${user.avatar?.bgcolor || "#ccc"};">
                        ${user.avatar?.initials || "?"}
                    </div>
                    ${user.name}
                </li>
            `).join("")}
        </ul>
        <div class="task-detail-subtasks">
            <p><strong>Subtasks</strong></p>
            ${subtasksHTML}
        </div>
        <div class="task-detail-footer">
            <button onclick="deleteTask('${task.id}')" class="btn-delete">
                <img src="../assets/imgs/delete.svg" alt="" class="delete-icon">
                Delete
            </button>
            <div class="line"></div>
            <button onclick="editTask('${task.id}')" class="btn-edit">
                <img src="../assets/imgs/edit.svg" alt="" class="edit-icon"  style="width: 18px; height: 18px;">
                Edit
            </button>
        </div>
    `;

    // Overlay sichtbar machen
    overlay.classList.add("active");
}

// Schließt das Task-Detail-Overlay
function closeTaskDetail() {
    const overlay = document.getElementById("taskDetailOverlay");
    overlay.classList.remove("active");
}

// Initialisiert die Event-Listener für das Overlay
function initTaskDetailOverlay() {
    const overlay = document.getElementById("taskDetailOverlay");
    const closeBtn = document.getElementById("closeTaskDetail");

    if (closeBtn) {
        closeBtn.addEventListener("click", closeTaskDetail);
    }

    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeTaskDetail();
            }
        });
    }
}

// Setzt die Event-Listener für Task-Cards
function initTaskCardClickEvents() {
    document.querySelectorAll(".task-card").forEach(taskCard => {
        taskCard.addEventListener("click", async function () {
            const taskId = this.dataset.id;
            if (!taskId) {
                console.error("⚠️ Task ID fehlt!");
                return;
            }

            const task = await fetchTaskById(taskId);
            if (task) {
                openTaskDetail(task);
            }
        });
    });
}


async function fetchTaskById(taskId) {
    try {
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
        if (!response.ok) {
            throw new Error("Fehler beim Laden der Task-Daten");
        }

        const taskData = await response.json();
        if (!taskData) {
            throw new Error("Keine Task-Daten gefunden");
        }

        return {
            id: taskId,
            title: taskData.title || "Kein Titel",
            description: taskData.description || "Keine Beschreibung",
            category: taskData.category || "General",
            categoryColor: taskData.categoryColor || "#ccc",
            dueDate: taskData.dueDate || "Kein Datum",
            priority: taskData.priority || { text: "Keine Priorität", image: "" }, // Sicherstellen, dass es ein Objekt ist
            assignedTo: Array.isArray(taskData.assignedTo)
                ? taskData.assignedTo.map(user => ({
                    name: user.name || "Unbekannter Benutzer",
                    avatar: user.avatar || { bgcolor: "#ccc", initials: "?" } // Falls `avatar` fehlt, Standardwerte setzen
                }))
                : [],
            subtasks: taskData.subtasks || []
        };
    } catch (error) {
        console.error("❌ Fehler beim Laden der Task:", error);
        return null;
    }
}




// Initialisiert das Task-Overlay nach dem Laden der Seite
document.addEventListener("DOMContentLoaded", function () {
    initTaskDetailOverlay();
    initTaskCardClickEvents();
});

function formatDate(dueDate) {
    if (!dueDate) return "Kein Datum"; // Falls kein Datum vorhanden ist

    const date = new Date(dueDate);
    if (isNaN(date.getTime())) return "Ungültiges Datum"; // Falls das Datum ungültig ist

    const day = String(date.getDate()).padStart(2, "0"); // Tag zweistellig
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Monat zweistellig (Monate beginnen bei 0)
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


// fetch("https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json")
//     .then(response => response.json())
//     .then(data => console.log(Object.values(data)));