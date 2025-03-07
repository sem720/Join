async function fetchTasks() {
    try {
        const response = await fetch("https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json");
        const data = await response.json();

        if (!data) {
            console.warn("⚠️ Keine Tasks in der Datenbank gefunden.");
            return;
        }

        const tasks = Object.keys(data).map(taskId => ({
            id: taskId,
            ...data[taskId]
        }));

        renderTasks(tasks);
        initTaskCardClickEvents();
        setupDragAndDrop();

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

    // **Hier wird die Template-Funktion aufgerufen**
    taskDiv.innerHTML = taskCardTemplate(task, categoryColor, progressPercent, completedSubtasks, totalSubtasks, avatarsHTML);

    return taskDiv;
}


function addTaskToBoard(task) {
    const columnId = "todo-column";
    const taskElement = createTaskElement(task);
    document.getElementById(columnId).appendChild(taskElement);
}


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
        const newColumn = event.currentTarget;
        newColumn.appendChild(draggedTask);
        updateTaskCategory(draggedTask, newColumn.id);
        updateNoTaskVisibility();
    }
}


async function updateTaskCategory(taskElement, newColumnId) {
    const taskId = taskElement.dataset.id;
    const newCategory = mapColumnIdToCategory(newColumnId);

    if (!taskId || !newCategory) return;

    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mainCategory: newCategory })
        });

        console.log(`Task ${taskId} wurde in "${newCategory}" verschoben.`);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Task-Kategorie:", error);
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



async function toggleSubtask(taskId, subtaskIndex) {
    try {
        // 📌 Task aus der Datenbank abrufen
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
        const task = await response.json();

        if (!task || !task.subtasks || subtaskIndex >= task.subtasks.length) {
            console.error("❌ Subtask nicht gefunden!");
            return;
        }

        // 📌 Status des Subtasks umkehren (lokal)
        task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;

        // 📌 Task-Card-Snackbar sofort aktualisieren
        updateTaskCard(taskId, task);

        // 📌 Backend mit neuem Status aktualisieren (asynchron)
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subtasks: task.subtasks })
        });

    } catch (error) {
        console.error("❌ Fehler beim Aktualisieren des Subtasks:", error);
    }
}



function updateTaskCard(taskId, task) {
    const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
    if (!taskElement) {
        console.warn(`⚠️ Task-Card für Task ${taskId} nicht gefunden.`);
        return;
    }

    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(st => st.completed).length;
    let progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    // 📌 Fortschrittsbalken aktualisieren
    taskElement.querySelector(".subtask-bar-prog-blue").style.width = `${progressPercent}%`;

    // 📌 Subtask-Text aktualisieren
    taskElement.querySelector(".subtask-checked").textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
}


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
            priority: taskData.priority || { text: "Keine Priorität", image: "" },
            assignedTo: Array.isArray(taskData.assignedTo)
                ? taskData.assignedTo.map(user => ({
                    name: user.name || "Unbekannter Benutzer",
                    avatar: user.avatar || { bgcolor: "#ccc", initials: "?" }
                }))
                : [],
            subtasks: Array.isArray(taskData.subtasks)
                ? taskData.subtasks.map(subtask => ({
                    text: subtask.text || subtask, // Falls es als String gespeichert ist
                    completed: subtask.completed || false
                }))
                : []
        };
    } catch (error) {
        console.error("❌ Fehler beim Laden der Task:", error);
        return null;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    initTaskDetailOverlay();
    initTaskCardClickEvents();
});


function formatDate(dueDate) {
    if (!dueDate) return "Kein Datum";

    const date = new Date(dueDate);
    if (isNaN(date.getTime())) return "Ungültiges Datum";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


async function deleteTask(taskId) {
    try {
        // 📌 Task aus der Datenbank löschen
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "DELETE"
        });

        // 📌 Task-Card aus dem Board entfernen
        const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        }

        // 📌 Task-Detail-Modal schließen
        closeTaskDetail();

        // 📌 Bestätigung anzeigen
        showDeleteConfirmation();

    } catch (error) {
        console.error("❌ Fehler beim Löschen der Task:", error);
    }
}


function showDeleteConfirmation() {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.classList.add("task-delete-confirmation");
    confirmationDiv.innerText = "Task successfully deleted";

    document.body.appendChild(confirmationDiv);

    // 📌 Animation starten (von unten nach oben)
    setTimeout(() => {
        confirmationDiv.classList.add("show");
    }, 10);

    // 📌 Nach 2 Sekunden ausblenden & entfernen
    setTimeout(() => {
        confirmationDiv.classList.remove("show");
        setTimeout(() => {
            confirmationDiv.remove();
        }, 500); // Warte, bis die Animation abgeschlossen ist
    }, 2000);
}

























function setEditPriority(priority) {
    document.querySelectorAll(".btn-switch").forEach(button => {
        button.classList.remove("active");
    });
    document.getElementById(priority.toLowerCase()).classList.add("active");
}



function setEditAssignedContacts(contacts) {
    const container = document.getElementById("edit-selected-contacts-container");
    container.innerHTML = contacts.map(contact =>
        `<div class="avatar-board-card" style="background-color: ${contact.avatar.bgcolor};">${contact.avatar.initials}</div>`
    ).join("");
}



function setEditSubtasks(subtasks) {
    const list = document.getElementById("edit-subtask-list");
    list.innerHTML = subtasks.map(subtask =>
        `<li><input type="checkbox" ${subtask.completed ? "checked" : ""}> ${subtask.text}</li>`
    ).join("");
}







function closeEditModal() {
    const overlay = document.getElementById("edit-task-overlay");
    const modal = document.getElementById("editTaskModal");

    overlay.classList.remove("active");
    modal.classList.add("hidden");
}



function setPriority(priority) {
    document.querySelectorAll(".btn-switch").forEach(button => {
        button.classList.remove("active");
    });
    document.getElementById(priority.toLowerCase()).classList.add("active");
}


function getSelectedPriority() {
    return document.querySelector(".btn-switch.active")?.id || "Medium";
}


function getSelectedEditPriority() {
    return document.querySelector(".btn-switch.active")?.id || "Medium";
}



function setAssignedContacts(contacts) {
    const container = document.getElementById("selected-contacts-container");
    container.innerHTML = contacts.map(contact =>
        `<div class="avatar-board-card" style="background-color: ${contact.avatar.bgcolor};">${contact.avatar.initials}</div>`
    ).join("");
}


function setSubtasks(subtasks) {
    const list = document.getElementById("subtask-list");
    list.innerHTML = subtasks.map(subtask =>
        `<li><input type="checkbox" ${subtask.completed ? "checked" : ""}> ${subtask.text}</li>`
    ).join("");
}


function getSubtasks() {
    const subtaskElements = document.querySelectorAll("#subtask-list input[type='checkbox']");

    if (!subtaskElements || subtaskElements.length === 0) {
        console.warn("⚠️ Keine Subtasks gefunden. Rückgabe: []");
        return []; // Falls keine Subtasks vorhanden sind, leere Liste zurückgeben
    }

    return Array.from(subtaskElements).map((checkbox) => ({
        text: checkbox.nextElementSibling ? checkbox.nextElementSibling.innerText.trim() : "Unbenannte Subtask",
        checked: checkbox.checked
    }));
}



function showEditConfirmation() {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.classList.add("task-edit-confirmation");
    confirmationDiv.innerText = "Task successfully updated";

    document.body.appendChild(confirmationDiv);

    // 📌 Animation starten
    setTimeout(() => {
        confirmationDiv.classList.add("show");
    }, 10);

    // 📌 Nach 2 Sekunden ausblenden
    setTimeout(() => {
        confirmationDiv.classList.remove("show");
        setTimeout(() => {
            confirmationDiv.remove();
        }, 500);
    }, 2000);
}


document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.getElementById("edit-close-modal");
    if (closeButton) {
        closeButton.addEventListener("click", closeEditModal);
    }
});






function openTaskDetail(task) {
    if (!task) {
        console.error("Keine Task-Daten vorhanden!");
        return;
    }

    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailContent = document.getElementById("taskDetailContent");

    let subtasksHTML = task.subtasks && task.subtasks.length > 0
        ? task.subtasks.map((subtask, index) => `
            <div class="subtasks-content">
                <input type="checkbox" id="subtask-${task.id}-${index}" 
                    ${subtask.completed ? "checked" : ""} 
                    onchange="toggleSubtask('${task.id}', ${index})">
                <label for="subtask-${task.id}-${index}">${subtask.text}</label>
            </div>
        `).join("")
        : `<p>No subtasks available</p>`;

    // **Hier wird die Template-Funktion aufgerufen**
    taskDetailContent.innerHTML = taskDetailTemplate(task, subtasksHTML);

    overlay.classList.add("active");
}



function closeTaskDetail() {
    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailModal = document.getElementById("taskDetailModal");
    const editTaskModal = document.getElementById("editTaskModal");

    // Falls das Edit-Modal offen ist, schließe nur dieses
    if (!editTaskModal.classList.contains("hidden")) {
        closeEditTaskModal();
        return;
    }

    // Overlay und Task-Detail schließen
    overlay.classList.remove("active");
    taskDetailModal.classList.add("hidden");

    // WICHTIG: Nach dem Schließen sicherstellen, dass `taskDetailModal` wieder sichtbar ist, falls Overlay nicht aktiv ist
    setTimeout(() => {
        if (!overlay.classList.contains("active")) {
            taskDetailModal.classList.remove("hidden");
        }
    }, 300);
}

function closeEditTaskModal() {
    const editTaskModal = document.getElementById("editTaskModal");

    // Nur das Edit-Modal schließen
    editTaskModal.classList.add("hidden");

    // Prüfen, ob Overlay nicht mehr aktiv ist -> `taskDetailModal` wieder sichtbar machen
    setTimeout(() => {
        const overlay = document.getElementById("taskDetailOverlay");
        const taskDetailModal = document.getElementById("taskDetailModal");
        if (!overlay.classList.contains("active")) {
            taskDetailModal.classList.remove("hidden");
        }
    }, 300);
}

// **Event-Handling für das Overlay**
document.getElementById("taskDetailOverlay").addEventListener("click", (event) => {
    if (event.target === document.getElementById("taskDetailOverlay")) {
        closeTaskDetail();
    }
});

// **Sicherstellen, dass der Close-Button `taskDetailModal` richtig schließt**
document.getElementById("closeTaskDetail").addEventListener("click", closeTaskDetail);
