/**
 * Handles the submission of the edit task form.
 * Prevents the page from reloading, updates assigned contacts, and saves task changes.
 * @param {Event} event - The form submission event.
 */
async function handleEditTaskSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const taskId = form.getAttribute("data-task-id");
    if (!taskId) return console.error("❌ Fehler: Keine Task-ID gefunden!");
        
    await saveSelectedContactsToBackend(taskId);
    await saveTaskChangesAndUpdateUI(taskId);
    closeContacts("edit-contacts-container", "edit-contacts-list");
}


/**
 * Saves the selected contacts to the backend for a given task.
 * @param {string} taskId - The unique ID of the task.
 * @returns {Promise<void>}
 */
async function saveSelectedContactsToBackend(taskId) {
    const assignedContacts = getEditedAssignedContacts();
    console.log("🔍 Saving selected contacts for task ID:", taskId, { assignedTo: assignedContacts });
    await updateTaskInDatabase(taskId, { assignedTo: assignedContacts }, false);
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
        });

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
 * @param {string} taskId - The unique ID of the task.
 * @returns {Promise<void>}
 */
async function saveTaskChangesAndUpdateUI(taskId) {
    const existingTask = await fetchTaskData(taskId);
    if (!existingTask) return console.error(`❌ Task ${taskId} not found in database.`);

    const assignedContacts = getEditedAssignedContacts();
    const updatedTask = {
        ...getUpdatedTaskData(),
        assignedTo: assignedContacts.length > 0 ? assignedContacts : existingTask.assignedTo || [],
        subtasks: getEditedSubtasks()
    };

    console.log("🔍 Saving task changes for task ID:", taskId, updatedTask);
    await updateTaskInDatabase(taskId, updatedTask, true);
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
        subtasks: getEditedSubtasks()
    };
}


/**
 * Saves the edited task, including assigned contacts, to the backend.
 * @returns {Promise<void>} A promise that resolves when the task is saved.
 */
async function saveEditedTask() {
    if (!taskId) return console.error("❌ Task ID not found!");

    try {
        await saveTaskChangesAndUpdateUI(taskId);
        showEditConfirmation();
    } catch (error) {
        console.error("❌ Error saving task:", error);
    }
}


