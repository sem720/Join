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

        // console.log("📌 Debugging: Geladene Tasks:", tasks); 

        renderTasks(tasks);
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



// function updateTaskCard(taskId, task) {
//     const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
//     if (!taskElement) {
//         console.warn(`⚠️ Task-Card für Task ${taskId} nicht gefunden.`);
//         return;
//     }

//     let totalSubtasks = task.subtasks.length;
//     let completedSubtasks = task.subtasks.filter(st => st.completed).length;
//     let progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

//     // 📌 Fortschrittsbalken aktualisieren
//     taskElement.querySelector(".subtask-bar-prog-blue").style.width = `${progressPercent}%`;

//     // 📌 Subtask-Text aktualisieren
//     taskElement.querySelector(".subtask-checked").textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
// }
function updateTaskCard(taskId, task) {
    const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
    if (!taskElement) {
        console.warn(`⚠️ Task-Card für Task ${taskId} nicht gefunden.`);
        return;
    }

    taskElement.querySelector(".task-title").textContent = task.title;
    taskElement.querySelector(".task-description").textContent = task.description;
    taskElement.querySelector(".subtask-checked").textContent =
        `${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length} Subtasks`;
}


function initTaskDetailOverlay() {
    const overlay = document.getElementById("taskDetailOverlay");
    const closeBtn = document.getElementById("closeTaskDetail");

    if (closeBtn) {
        closeBtn.addEventListener("click", closeTaskDetailModal);
    }

    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeTaskDetailModal();
            }
        });
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
        closeTaskDetailModal();

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
    document.querySelectorAll(".btn-switch").forEach(btn => {
        btn.classList.remove("active");
    });

    if (!priority || !priority.text) {
        console.warn("⚠️ Keine gültige Priorität gefunden. Standardwert wird gesetzt.");
        return;
    }

    let priorityText = priority.text.toLowerCase(); // Sicherstellen, dass `priority.text` ein String ist

    const button = document.getElementById(priorityText);
    if (button) {
        button.classList.add("active");
    } else {
        console.warn(`⚠️ Unbekannte Priorität: ${priorityText}`);
    }
}



// function toggleButtons(button) {
//     // Alle Buttons zurücksetzen
//     document.querySelectorAll(".btn-switch").forEach(btn => {
//         btn.classList.remove("active");
//         btn.style.backgroundColor = ""; // Hintergrundfarbe zurücksetzen
//         btn.style.color = "#000000"; // Standard-Textfarbe Schwarz
//     });

//     // Gewählten Button aktivieren
//     button.classList.add("active");

//     // 🔹 Hintergrundfarbe setzen
//     let priority = button.id;
//     switch (priority) {
//         case "urgent":
//             button.style.backgroundColor = "#ff3b30"; // Rot
//             break;
//         case "medium":
//             button.style.backgroundColor = "#ffcc00"; // Gelb
//             break;
//         case "low":
//             button.style.backgroundColor = "#34c759"; // Grün
//             break;
//         default:
//             console.warn("⚠️ Unbekannte Priorität:", priority);
//     }

//     // 🔹 Textfarbe auf Weiß setzen (nur für den aktiven Button)
//     button.style.color = "#ffffff";
// }


function setEditAssignedContacts(contacts) {
    const container = document.getElementById("edit-selected-contacts-container");
    container.innerHTML = contacts.map(contact =>
        `<div class="avatar-board-card" style="background-color: ${contact.avatar.bgcolor};">${contact.avatar.initials}</div>`
    ).join("");
}


function setEditSubtasks(subtasks) {
    const list = document.getElementById("edit-subtask-list");
    list.innerHTML = subtasks.map((subtask, index) =>
        `<li>
            <input type="checkbox" id="edit-subtask-${index}" ${subtask.completed ? "checked" : ""}>
            <label for="edit-subtask-${index}">${subtask.text}</label>
        </li>`
    ).join("");
}


function getEditedAssignedContacts() {
    return Array.from(document.querySelectorAll("#edit-selected-contacts-container .avatar-board-card")).map(contact => ({
        name: contact.textContent,
        avatar: { bgcolor: contact.style.backgroundColor, initials: contact.textContent }
    }));
}


function getEditedSubtasks() {
    return Array.from(document.querySelectorAll("#edit-subtask-list li")).map(li => ({
        text: li.querySelector("label").textContent,
        completed: li.querySelector("input").checked
    }));
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


function openTaskDetailModal(task) {
    if (!task) {
        console.error("Keine Task-Daten vorhanden!");
        return;
    }

    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailContent = document.getElementById("taskDetailContent");

    let subtasksHTML = generateSubtasksTemplate(task);

    taskDetailContent.innerHTML = taskDetailTemplate(task, subtasksHTML);

    overlay.classList.add("active");
}


function closeTaskDetailModal() {
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


async function openEditTaskModal(taskId) {
    try {
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
        const taskData = await response.json();

        if (!taskData) {
            throw new Error("❌ Keine Task-Daten gefunden!");
        }

        // 🟢 TaskDetailModal verstecken
        document.getElementById("taskDetailModal").classList.add("hidden");

        // 🟢 Lade das Template in das Modal
        const modalContent = document.getElementById("edit-modal-content");
        modalContent.innerHTML = editTaskTempl();

        // 🟢 Sicherstellen, dass jetzt die Elemente existieren
        const titleField = document.getElementById("edit-task-title");
        const descField = document.getElementById("edit-task-description");
        const dateField = document.getElementById("edit-due-date");

        if (!titleField || !descField || !dateField) {
            throw new Error("❌ Edit Task Modal Elemente fehlen im HTML!");
        }

        // 🟢 Felder mit Task-Daten befüllen
        titleField.value = taskData.title || "";
        descField.value = taskData.description || "";
        dateField.value = taskData.dueDate || "";

        // 🟢 Priorität, Kontakte und Subtasks setzen
        setEditPriority(taskData.priority);
        setEditAssignedContacts(taskData.assignedTo || []);
        setEditSubtasks(taskData.subtasks || []);

        // 🟢 Edit Task Modal anzeigen
        document.getElementById("editTaskModal").classList.remove("hidden");

    } catch (error) {
        console.error("❌ Fehler beim Laden der Task-Daten:", error);
    }
}



function closeEditTaskModal() {
    const editTaskModal = document.getElementById("editTaskModal");
    const taskDetailModal = document.getElementById("taskDetailModal");
    const overlay = document.getElementById("taskDetailOverlay");

    // ❗ Falls das Edit-Modal noch offen ist, schließe NUR das Edit-Modal
    if (!editTaskModal.classList.contains("hidden")) {
        editTaskModal.classList.add("hidden");

        // 🟢 Prüfe, ob das TaskDetailModal zuvor sichtbar war
        if (taskDetailModal && !taskDetailModal.classList.contains("hidden")) {
            taskDetailModal.classList.remove("hidden"); // Task-Detail wieder anzeigen
        } else {
            overlay.classList.remove("active"); // Falls TaskDetailModal auch zu ist → Overlay schließen
        }

        return; // ⛔ Stoppe die Funktion hier, damit das Overlay nicht sofort verschwindet
    }

    // ❗ Falls das Edit-Modal bereits geschlossen ist, dann schließe das Overlay und das Task-Detail-Modal
    overlay.classList.remove("active");
    taskDetailModal.classList.add("hidden");
}



async function saveTaskChanges(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    const taskId = document.getElementById("edit-task-id")?.value;
    if (!taskId) {
        console.error("❌ Fehler: Keine Task-ID gefunden!");
        return;
    }

    const updatedTask = {
        title: document.getElementById("edit-task-title").value,
        description: document.getElementById("edit-task-description").value,
        dueDate: document.getElementById("edit-due-date").value,
        priority: getSelectedPriority(), // Priorität auslesen
        assignedTo: getEditedAssignedContacts(), // Kontakte auslesen
        subtasks: getEditedSubtasks() // Subtasks auslesen
    };

    try {
        // 🔹 Änderungen im Backend speichern
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });

        // 🔹 Änderungen auf der Task-Card sofort aktualisieren
        updateTaskCard(taskId, updatedTask);

        // 🔹 Edit-Modal schließen
        closeEditTaskModal();

        console.log(`✅ Task ${taskId} wurde erfolgreich aktualisiert.`);
    } catch (error) {
        console.error("❌ Fehler beim Speichern der Änderungen:", error);
    }
}



document.getElementById("taskDetailOverlay").addEventListener("click", (event) => {
    if (event.target === document.getElementById("taskDetailOverlay")) {
        closeEditTaskModal();
    }
});




