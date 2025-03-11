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


function formatDate(dueDate) {
    if (!dueDate) return "Kein Datum";

    // Prüfen, ob das Datum im Format TT/MM/YYYY (Backend) vorliegt
    const dateParts = dueDate.split("/"); // Teilt das Datum in [TT, MM, YYYY]

    if (dateParts.length !== 3) return "Ungültiges Datum";

    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];

    return `${day}/${month}/${year}`; // TT/MM/YYYY Format beibehalten
}


function openTaskDetailModal(task) {
    if (!task) {
        console.error("Keine Task-Daten vorhanden!");
        return;
    }

    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailContent = document.getElementById("taskDetailContent");

    let subtasksHTML = generateSubtasks(task);

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

        // 🟢 Sicherstellen, dass die Elemente existieren
        setTimeout(() => {
            const titleField = document.getElementById("edit-task-title");
            const descField = document.getElementById("edit-task-description");
            const dateField = document.getElementById("edit-due-date");

            if (!titleField || !descField || !dateField) {
                throw new Error("❌ Edit Task Modal Elemente fehlen im HTML!");
            }

            // 🟢 Felder mit Task-Daten befüllen
            titleField.value = taskData.title || "";
            descField.value = taskData.description || "";
            dateField.value = formatDateForInput(taskData.dueDate);

            // 🟢 Priorität setzen (richtigen Button aktivieren & stylen)
            setEditPriority(taskData.priority); // Hier wird die Priorität gesetzt

            // 🟢 Kontakte & Subtasks setzen
            setEditAssignedContacts(taskData.assignedTo || []);
            setEditSubtasks(taskData.subtasks || []);

            initEditTaskFlatpickr();
          
        }, 10); // ⏳ Warten, bis das HTML geladen ist

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


// editTask.js - Eigene Funktion für das Edit-Modal
function toggleEditButtons(clickedButton) {
    // Nur Buttons im EDIT-Modal zurücksetzen
    const buttons = document.querySelectorAll("#editTaskModal .btn-switch");
    buttons.forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "#000";
    });

    // Aktivierten Button stylen
    clickedButton.classList.add("active");
    const priority = clickedButton.id.replace("edit-", ""); // "urgent", "medium", "low"

    switch (priority) {
        case "urgent":
            clickedButton.style.backgroundColor = "#ff3b30";
            clickedButton.style.color = "#fff";
            break;
        case "medium":
            clickedButton.style.backgroundColor = "#ffcc00";
            clickedButton.style.color = "#000";
            break;
        case "low":
            clickedButton.style.backgroundColor = "#34c759";
            clickedButton.style.color = "#fff";
            break;
    }
}