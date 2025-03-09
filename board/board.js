async function fetchTasks() {
    try {
        const response = await fetch("https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json");
        const data = await response.json();

        if (!data) {
            console.warn("⚠️ Keine Tasks in der Datenbank gefunden.");
            return;
        }

        const tasks = Object.keys(data).map(taskId => {
            let task = { id: taskId, ...data[taskId] };

            // 🟢 Falls `mainCategory` "to do" ist, ändere es zu "To do"
            if (task.mainCategory && task.mainCategory.toLowerCase() === "to do") {
                console.log(`🛠️ Fix: mainCategory für Task ${task.id} geändert von "to do" zu "To do"`);
                task.mainCategory = "To do";

                // 🟢 Speichere die Korrektur im Backend
                updateMainCategoryInBackend(task.id, "To do");
            }

            return task;
        });

        renderTasks(tasks);
        setupDragAndDrop();

    } catch (error) {
        console.error("❌ Fehler beim Laden der Tasks:", error);
    }
}


async function updateMainCategoryInBackend(taskId, newCategory) {
    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mainCategory: newCategory })
        });

        console.log(`✅ Task ${taskId} erfolgreich im Backend aktualisiert: mainCategory = "${newCategory}"`);

    } catch (error) {
        console.error(`❌ Fehler beim Aktualisieren der mainCategory für Task ${taskId}:`, error);
    }
}



function renderTasks(tasks) {
    const columnMap = {
        "To do": document.querySelector("#to-do .column-body"),
        "In progress": document.querySelector("#in-progress .column-body"),
        "Await feedback": document.querySelector("#awaitFeedback .column-body"),
        "Done": document.querySelector("#done .column-body")
    };

    // ❗ Leere nur Task-Cards, aber lasse das "no-task"-Element bestehen
    Object.values(columnMap).forEach(column => {
        column.querySelectorAll(".task-card").forEach(task => task.remove());
    });

    tasks.forEach(task => {
        let category = task.mainCategory || "To do";
        const column = columnMap[category];
        if (!column) {
            console.warn(`⚠️ Keine passende Spalte für Kategorie: ${category}`);
            return;
        }

        const taskElement = createTaskElement(task);
        column.appendChild(taskElement);
    });

    // ❗ Stelle sicher, dass Drag & Drop-Events neu gesetzt werden
    setupDragAndDrop();

    // ❗ Stelle sicher, dass Klick-Events neu gesetzt werden
    initTaskCardClickEvents();

    // ❗ Update Sichtbarkeit der "No Tasks"-Meldung
    updateNoTaskVisibility();
}


function createTaskElement(task) {
    let categoryColor = task.category === "User Story" ? "#0039fe" : "#1fd7c1";

    // Berechne den Subtask-Fortschritt
    let totalSubtasks = task.subtasks ? task.subtasks.length : 0;
    let completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
    let progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const avatarsHTML = task.assignedTo
        ? task.assignedTo.map(user =>
            `<div class="avatar-board-card" style="background-color: ${user.avatar.bgcolor};">${user.avatar.initials}</div>`
        ).join("")
        : "";

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card");
    taskDiv.setAttribute("data-id", task.id);

    taskDiv.innerHTML = taskCardTemplate(task, categoryColor, progressPercent, completedSubtasks, totalSubtasks, avatarsHTML);

    return taskDiv;
}


function updateNoTaskVisibility() {
    document.querySelectorAll(".column-body").forEach(column => {
        const noTaskDiv = column.querySelector(".no-task");
        const hasTasks = column.querySelector(".task-card") !== null;

        if (hasTasks) {
            noTaskDiv.classList.add("d-none");
        } else {
            noTaskDiv.classList.remove("d-none");
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
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
}


function handleDragLeave(event) {
    event.currentTarget.classList.remove("drag-over");
}


function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");

    if (draggedTask) {
        const newColumn = event.target.closest(".column-body");
        const newColumnId = newColumn.parentElement.id;
        console.log("newColumnId:", newColumnId);
        newColumn.appendChild(draggedTask);
        updateTaskCategory(draggedTask, newColumnId);
        updateNoTaskVisibility();
    }
}


async function updateTaskCategory(taskElement, newColumnId) {
    console.log("Neue Spalten-ID:", newColumnId);

    const taskId = taskElement.dataset.id;
    const newCategory = mapColumnIdToCategory(newColumnId);

    if (!taskId) {
        console.error("❌ Fehler: Keine Task-ID gefunden!");
        return;
    }

    if (!newCategory) {
        console.error(`❌ Fehler: Ungültige Spalte (${newColumnId}) für Task ${taskId}.`);
        return;
    }

    try {
        // Task-Daten aus der Datenbank abrufen
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
        let taskData = await response.json();

        if (!taskData) {
            throw new Error("❌ Keine Task-Daten gefunden!");
        }

        // Falls `mainCategory` nicht existiert, erstellen wir es
        if (!taskData.hasOwnProperty('mainCategory')) {
            taskData.mainCategory = "";
        }

        // Die `mainCategory` aktualisieren
        taskData.mainCategory = newCategory;

        // Änderungen im Backend speichern
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mainCategory: newCategory }) // Nur das Feld `mainCategory` aktualisieren
        });

        console.log(`✅ Task ${taskId} wurde erfolgreich in "${newCategory}" verschoben und gespeichert.`);

    } catch (error) {
        console.error("❌ Fehler beim Aktualisieren der Task-Kategorie:", error);
    }
}


function mapColumnIdToCategory(columnId) {
    const columnMap = {
        "to-do": "To do",
        "to-do-body": "To do",
        "in-progress": "In progress",
        "in-progress-body": "In progress",
        "awaitFeedback": "Await feedback",
        "awaitFeedback-body": "Await feedback",
        "done": "Done",
        "done-body": "Done"
    };

    if (!columnMap[columnId]) {
        console.warn(`⚠️ Unbekannte Spalten-ID: ${columnId}. Standardwert "To do" wird gesetzt.`);
    }

    return columnMap[columnId] || "To do";  // Fallback auf "To do"
}


document.addEventListener("DOMContentLoaded", setupDragAndDrop);


function generateSubtasks(task) {
    if (!task.subtasks || task.subtasks.length === 0) {
        return `<p>No subtasks available</p>`;
    }

    return generateSubtasksTemplate(task);
}



async function toggleSubtask(taskId, subtaskIndex) {
    try {
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
        const task = await response.json();

        if (!task?.subtasks || subtaskIndex >= task.subtasks.length) return;

        // Status umkehren
        task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;

        // 🔴 Fortschrittsdaten direkt berechnen
        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter(st => st.completed).length;
        const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

        // 🔴 DOM-Elemente direkt aktualisieren
        const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.querySelector(".subtask-bar-prog-blue").style.width = `${progressPercent}%`;
            taskElement.querySelector(".subtask-checked").textContent =
                `${completedSubtasks}/${totalSubtasks} Subtasks`;
        }

        // Backend aktualisieren
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subtasks: task.subtasks })
        });

    } catch (error) {
        console.error("Fehler beim Aktualisieren des Subtasks:", error);
    }
}


function updateTaskCard(taskId, task) {
    const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
    if (!taskElement) {
        console.warn(`⚠️ Task-Card für Task ${taskId} nicht gefunden.`);
        return;
    }

    // 🟢 Titel & Beschreibung aktualisieren
    taskElement.querySelector(".task-title").textContent = task.title;
    taskElement.querySelector(".task-description").textContent = task.description;

    // 🟢 Subtask-Fortschritt berechnen & aktualisieren
    const totalSubtasks = task.subtasks.length;
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    // 🟢 Fortschrittsbalken aktualisieren
    const progressBar = taskElement.querySelector(".subtask-bar-prog-blue");
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }

    // 🟢 Subtask-Text aktualisieren
    const subtaskText = taskElement.querySelector(".subtask-checked");
    if (subtaskText) {
        subtaskText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}


function initTaskCardClickEvents() {
    document.querySelectorAll(".task-card").forEach(taskCard => {
        taskCard.addEventListener("click", async function () {
            const taskId = this.dataset.id;
            console.log(taskId);
            if (!taskId) {
                console.error("⚠️ Task ID fehlt!");
                return;
            }

            const task = await fetchTaskById(taskId);
            if (task) {
                openTaskDetailModal(task);
            }
        });
    });
}


async function fetchTaskById(taskId) {
    try {
        // 📌 Task aus der Datenbank abrufen
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
        const taskData = await response.json();
        // console.log("Task-Daten:", taskData);

        if (!taskData) {
            throw new Error("Keine Task-Daten gefunden");
        }

        const task = {
            id: taskId,
            title: taskData.title || "Kein Titel",
            description: taskData.description || "Keine Beschreibung",
            category: taskData.category || "General",
            categoryColor: taskData.categoryColor || "#ccc",
            dueDate: taskData.dueDate || "Kein Datum",
            priority: taskData.priority || { text: "Keine Priorität", image: "" },
            assignedTo: Array.isArray(taskData.assignedTo)
                ? taskData.assignedTo.map(user => ({
                    name: user.name || "Unbekannter Benutzer",
                    avatar: user.avatar || { bgcolor: "#ccc", initials: "?" }
                }))
                : [],
            subtasks: Array.isArray(taskData.subtasks)
                ? taskData.subtasks.map(subtask => ({
                    text: subtask.text || subtask,
                    completed: subtask.completed || false
                }))
                : []
        };

        // Hier wird die Funktion openTaskDetailModal aufgerufen, nachdem die Daten geladen sind
        openTaskDetailModal(task);

    } catch (error) {
        console.error("❌ Fehler beim Laden der Task:", error);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    fetchTasks();
    initTaskDetailOverlay();
    initTaskCardClickEvents();
});


document.getElementById("taskDetailOverlay").addEventListener("click", (event) => {
    if (event.target === document.getElementById("taskDetailOverlay")) {
        closeEditTaskModal();
    }
});
