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
    console.log("🔍 Saving selected contacts for task ID:", taskId, updatedTask);
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
        console.log("🔍 Updating task in database:", taskId, updatedTask);
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
    const existingTask = await fetchTaskData(taskId);
    if (!existingTask) return console.error(`❌ Task ${taskId} not found in database.`);
    const updatedTask = {
        ...getUpdatedTaskData(),
        assignedTo: getEditedAssignedContacts().length > 0
            ? getEditedAssignedContacts()
            : existingTask.assignedTo || [],
        subtasks: getEditedSubtasks() || []
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
        assignedTo: getEditedAssignedContacts() || [],
        subtasks: getEditedSubtasks().length ? getEditedSubtasks() : []
    };
}

/**
 * Saves the edited assigned contacts to the backend.
 * @param {Array<Object>} contacts - List of assigned contacts.
 * @returns {Promise<void>} A promise that resolves when the contacts are saved.
 */
async function saveEditedContacts(contacts) {
    const taskId = document.getElementById('task-id').value; 
    try {
        const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}/contacts.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contacts)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error saving edited contacts:', error);
    }
}


/**
 * Saves the edited task, including assigned contacts, to the backend.
 * @returns {Promise<void>} A promise that resolves when the task is saved.
 */
async function saveEditedTask() {
    try {
        await saveEditedContacts(getEditedAssignedContacts());
        const taskId = document.getElementById('task-id').value;
        const taskDetails = getEditedTaskDetails();

        const response = await updateTaskInDatabase(taskId, taskDetails);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        console.log('Task saved successfully.');
        showEditConfirmation();
    } catch (error) {
        console.error('Error saving task:', error);
    }
}


/**
 * Retrieves the edited task details from the input fields.
 * @returns {Object} The task details including title, description, due date, and priority.
 */
function getEditedTaskDetails() {
    return {
        title: document.getElementById('edit-task-title').value,
        description: document.getElementById('edit-task-description').value,
        dueDate: document.getElementById('edit-due-date').value,
        priority: getSelectedPriority().priorityText
    };
}



