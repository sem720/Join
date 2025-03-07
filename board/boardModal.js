async function openAddTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("active");
    modal.classList.remove("hidden");

    setTimeout(() => {
        modal.classList.add("show");
    }, 10);

    // ❌ Stoppt das Event, damit Klicks innerhalb des Modals nicht das Overlay schließen
    modal.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    await fetchContacts();
    renderContactsList();
    setupAddSubtaskButton();
    dateInput();
    initialDefaultPriority();
}


function closeModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    modal.classList.remove("show");

    setTimeout(() => {
        modal.classList.add("hidden");
        overlay.classList.remove("active");
    }, 400);
}


document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("addTaskModal");
    console.log("Modal Element:", modal);
    if (modal) {
        console.log("✅ Modal is found, ready to apply classList changes.");
    } else {
        console.error("❌ Modal not found! Check if the script runs too early.");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    fetchTasks();
    initTaskDetailOverlay();
});


function openEditTaskModal() {
    const taskDetailModal = document.getElementById("taskDetailModal");
    const editTaskModal = document.getElementById("editTaskModal");
    const overlay = document.getElementById("taskDetailOverlay");

    // Task-Detail ausblenden, Edit-Modal einblenden
    taskDetailModal.classList.add("hidden");
    editTaskModal.classList.remove("hidden");
    overlay.classList.add("active"); // Overlay bleibt aktiv

    // Klick innerhalb des Modals verhindern, dass es schließt
    editTaskModal.addEventListener("click", (event) => {
        event.stopPropagation();
    });
}


function closeEditTaskModal() {
    const editTaskModal = document.getElementById("editTaskModal");

    // Nur das Edit-Modal schließen
    editTaskModal.classList.add("hidden");

    // Task-Detail bleibt unverändert
}


function closeTaskDetailModal() {
    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailModal = document.getElementById("taskDetailModal");
    const editTaskModal = document.getElementById("editTaskModal");

    // Falls das Edit-Modal geöffnet ist, schließe nur dieses
    if (!editTaskModal.classList.contains("hidden")) {
        closeEditTaskModal();
        return;
    }

    // Falls kein Edit-Modal offen ist, dann schließe alles
    overlay.classList.remove("active");
    taskDetailModal.classList.add("hidden");
}


// Overlay-Event: Entscheidet, ob nur Edit-Modal oder alles geschlossen wird
document.getElementById("taskDetailOverlay").addEventListener("click", (event) => {
    if (event.target === document.getElementById("taskDetailOverlay")) {
        closeTaskDetailModal();
    }
});


// Close-Button für Edit-Modal
document.getElementById("edit-close-modal").addEventListener("click", closeEditTaskModal);


async function saveTaskChanges(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite!

    const taskId = event.target.dataset.taskId; // Falls benötigt

    const updatedTask = {
        title: document.getElementById("edit-task-title").value.trim(),
        description: document.getElementById("edit-task-description").value.trim(),
        dueDate: document.getElementById("edit-due-date").value,
        priority: { text: getSelectedEditPriority() },
        assignedTo: getEditAssignedContacts(),
        subtasks: getEditSubtasks()
    };

    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });

        closeEditModal(); // Modal nach dem Speichern schließen
        updateTaskCard(taskId, updatedTask);
        showEditConfirmation();

    } catch (error) {
        console.error("❌ Fehler beim Speichern der Änderungen:", error);
    }
}


async function editTask(taskId) {
    try {
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
        const task = await response.json();

        if (!task) {
            console.error("❌ Task nicht gefunden!");
            return;
        }

        const overlay = document.getElementById("taskDetailOverlay");
        const taskDetailModal = document.getElementById("taskDetailModal");
        const editTaskModal = document.getElementById("editTaskModal");
        const editModalContent = document.getElementById("edit-modal-content");

        // **Falls eines der Elemente fehlt, versuche es 3-mal neu zu finden**
        if (!taskDetailModal || !editTaskModal || !editModalContent) {
            console.error("❌ `taskDetailModal` oder `editTaskModal` nicht im DOM gefunden. Warte auf DOM-Update...");

            setTimeout(() => {
                const taskDetailModalRetry = document.getElementById("taskDetailModal");
                const editTaskModalRetry = document.getElementById("editTaskModal");
                const editModalContentRetry = document.getElementById("edit-modal-content");

                if (!taskDetailModalRetry || !editTaskModalRetry || !editModalContentRetry) {
                    console.error("❌ Auch nach Wartezeit nicht gefunden. HTML-Fehler?");
                    return;
                }

                // **Erneuter Aufruf nach DOM-Update**
                editTask(taskId);
            }, 200);

            return;
        }

        // **Lade das HTML-Template für die Bearbeitung**
        editModalContent.innerHTML = editTaskTempl();

        setTimeout(() => {
            const titleInput = document.getElementById("edit-task-title");
            const descInput = document.getElementById("edit-task-description");
            const dueDateInput = document.getElementById("edit-due-date");

            if (!titleInput || !descInput || !dueDateInput) {
                console.error("❌ Fehler: Eingabefelder existieren nicht.");
                return;
            }

            titleInput.value = task.title || "";
            descInput.value = task.description || "";
            dueDateInput.value = task.dueDate || "";

            setEditPriority(task.priority?.text || "Medium");
            setEditAssignedContacts(task.assignedTo || []);
            setEditSubtasks(task.subtasks || []);

            document.querySelector(".edit-save-btn").onclick = function (event) {
                event.preventDefault();
                saveTaskChanges(taskId);
            };

            document.getElementById("edit-close-modal").onclick = closeEditModal;

        }, 50);

        taskDetailModal.classList.add("hidden");
        editTaskModal.classList.remove("hidden");

        overlay.classList.add("active");

    } catch (error) {
        console.error("❌ Fehler beim Laden der Task-Daten:", error);
    }
}



