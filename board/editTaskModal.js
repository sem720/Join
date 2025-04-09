/**
 * Handles the submission of the edit task form.
 * Prevents the page from reloading, updates assigned contacts, and saves task changes.
 * @param {Event} event - The form submission event.
 */
async function handleEditTaskSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const taskId = form.getAttribute("data-task-id");
    if (!taskId) return;
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
        throw error;
    }
}


/**
 * Saves the task changes and updates the UI.
 * @param {string} taskId - The unique ID of the task.
 * @returns {Promise<void>}
 */
async function saveTaskChangesAndUpdateUI(taskId) {
    const existingTask = await fetchTaskData(taskId);
    if (!existingTask) return;
    const assignedContacts = getEditedAssignedContacts();
    const updatedTask = {
        ...getUpdatedTaskData(),
        assignedTo: assignedContacts.length > 0 ? assignedContacts : existingTask.assignedTo || [],
        subtasks: getEditedSubtasks()
    };
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
    if (!taskId) return;
    try {
        await saveTaskChangesAndUpdateUI(taskId);
        showEditConfirmation();
    } catch (error) {
        throw error;
    }
}


/**
 * Displays the Edit Task modal and initializes all required input components.
 * Sets up contact selection, subtasks, and resets the contact state.
 * @param {Object} task - The task object containing assignedTo, subtasks, etc.
 */
function showEditTaskModal(task) {
    const modal = document.getElementById("editTaskModal");
    modal.classList.remove("hidden");
    initEditTaskContacts("edit-contacts-list");
    selectedContacts.clear();
    if (Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach(contact => selectedContacts.add(contact));
    }
    updateSelectedContactsDisplay("edit-selected-contacts-container");
    setupAddSubtaskButton();
    setupEditSubtaskInput();
    resetSelectedContacts();
    setupEditContactOutsideClickHandler();
}


/**
 * Sets up a global click handler to close the contact dropdown
 * in the edit modal when a user clicks outside the contact area.
 */
function setupEditContactOutsideClickHandler() {
    document.addEventListener("click", function (event) {
        const container = document.getElementById("edit-contacts-container");
        const toggleBtn = document.getElementById("toggle-contacts-btn");
        if (!container || !toggleBtn) return;
        const clickedInside = container.contains(event.target);
        const clickedToggle = toggleBtn.contains(event.target);
        if (!clickedInside && !clickedToggle) {
            container.classList.add("hidden");
            container.classList.remove("visible");
        }
    });
}