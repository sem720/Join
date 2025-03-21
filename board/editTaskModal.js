/**
 * Handles the submission of the edit task form.
 * Prevents the page from reloading, updates assigned contacts, and saves task changes.
 * @param {Event} event - The form submission event.
 */
async function handleEditTaskSubmit(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    const form = event.target;
    const taskId = form.getAttribute("data-task-id");
    if (!taskId) {
        console.error("❌ Fehler: Keine Task-ID gefunden!");
        return;
    }
    await saveSelectedContactsToBackend(taskId); // Speichert die ausgewählten Kontakte
    await saveTaskChangesAndUpdateUI(event); // Speichert alle anderen Task-Änderungen
    closeContacts("edit-contacts-container", "edit-contacts-list"); // Dropdown schließen
}


/**
 * Saves the selected contacts to the backend for a given task.
 * @param {string} taskId - The unique ID of the task.
 * @returns {Promise<void>}
 */
async function saveSelectedContactsToBackend(taskId) {
    if (!taskId) return console.error("❌ No Task ID found!");
    const updatedTask = { assignedTo: getEditedAssignedContacts() || [] };
    await updateTaskInDatabase(taskId, updatedTask, false); // ❌ KEINE Bestätigung hier
}


/**
 * Updates the assigned contacts in the Firebase database.
 * @param {string} taskId - The unique ID of the task.
 * @param {Object} updatedTask - The task data to update.
 * @returns {Promise<void>}
 */
async function updateTaskInDatabase(taskId, updatedTask, showConfirmation = false) {
    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });// console.log(`✅ Task ${taskId} updated successfully.`);
        await fetchTasks();
        closeEditTaskModal();
        closeTaskDetailModal();
        if (showConfirmation) showEditConfirmation();
    } catch (error) {
        console.error("❌ Error saving task changes:", error);
    }
}


/**
 * Saves the task changes and updates the UI.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function saveTaskChangesAndUpdateUI(event) {
    event.preventDefault();
    const taskId = event.target.getAttribute("data-task-id");
    if (!taskId) return console.error("❌ No Task ID found!");
    const updatedTask = {
        ...getUpdatedTaskData(),
        assignedTo: getEditedAssignedContacts() || [] // Kontakte direkt hinzufügen
    };
    await updateTaskInDatabase(taskId, updatedTask, true); // ✅ Hier wird die Bestätigung ausgeführt
}


/**
 * Retrieves updated task data from the form inputs.
 * @returns {Object} The updated task object.
 */
function getUpdatedTaskData() {
    return {
        title: document.getElementById("edit-task-title").value,
        description: document.getElementById("edit-task-description").value,
        dueDate: document.getElementById("edit-due-date").value,
        priority: getSelectedPriority(),
        assignedTo: getEditedAssignedContacts() || [],
        subtasks: getEditedSubtasks().length ? getEditedSubtasks() : []
    };
}