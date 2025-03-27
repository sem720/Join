/**
 * Initializes the task detail overlay and close button event listeners.
 */
function initTaskDetailOverlay() {
    const overlay = document.getElementById("taskDetailOverlay");
    const closeBtn = document.getElementById("closeTaskDetail");
    closeBtn?.addEventListener("click", closeTaskDetailModal);
    overlay?.addEventListener("click", (e) => e.target === overlay && closeTaskDetailModal());
}


/**
 * Formats a date string to ensure it follows the DD/MM/YYYY format.
 * @param {string} dueDate - The due date string to format.
 * @returns {string} The formatted date string or an error message if invalid.
 */
function formatDate(dueDate) {
    if (!dueDate) return "No date";
    const dateParts = dueDate.split("/"); // Splits the date into [DD, MM, YYYY]
    if (dateParts.length !== 3) return "Invalid date";
    return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`; // Keeps DD/MM/YYYY format
}


/**
 * Opens the task detail modal and displays task information.
 * @param {Object} task - The task object containing details.
 */
function openTaskDetailModal(task) {
    if (!task) {
        console.error("No task data available!");
        return;
    }
    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailContent = document.getElementById("taskDetailContent");
    let subtasksHTML = generateSubtasks(task);
    taskDetailContent.innerHTML = taskDetailTemplate(task, subtasksHTML);
    overlay.classList.add("active");
}


/**
 * Closes the task detail modal or the edit task modal if open.
 */
function closeTaskDetailModal() {
    const overlay = document.getElementById("taskDetailOverlay");
    overlay.classList.remove("active");
}


/**
 * Opens the edit task modal by fetching task data and ensuring the modal is ready.
 * @param {string} taskId - The ID of the task to edit.
 * @returns {Promise<void>}
 */
async function openEditTaskModal(taskId) {
    try {
        const taskData = await fetchTaskData(taskId);
        if (!taskData) throw new Error("❌ No task data found!");

        hideTaskDetailModal();
        loadEditTaskTemplate(taskId);
        await waitForModal("editTaskModal");
        populateEditTaskFields(taskData);
        showEditTaskModal();
    } catch (error) {
        console.error("❌ Error loading task data:", error);
    }
}


/**
 * Waits until the edit task modal is available in the DOM.
 * @param {string} modalId - The ID of the modal element.
 * @returns {Promise<void>}
 */
async function waitForModal(modalId) {
    return new Promise(resolve => {
        const checkExist = setInterval(() => {
            if (document.getElementById(modalId)) {
                clearInterval(checkExist);
                resolve();
            }
        }, 50);
    });
}


/**
 * Displays the edit task modal and initializes contact & subtask inputs.
 */
function showEditTaskModal() {
    document.getElementById("editTaskModal").classList.remove("hidden");
    initEditTaskContacts("edit-contacts-list");
    updateSelectedContactsDisplay("edit-selected-contacts-container");
    setupAddSubtaskButton();
}



/**
 * Fetches task data from the database.
 * @param {string} taskId - The ID of the task.
 * @returns {Promise<Object>} The fetched task data.
 */
async function fetchTaskData(taskId) {
    const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
    return response.json();
}


/**
 * Hides the task detail modal.
 */
function hideTaskDetailModal() {
    const taskDetailModal = document.getElementById("taskDetailModal");
    taskDetailModal.classList.add("hidden");
    taskDetailModal.style.display = "none";
}


/**
 * Loads the edit task template into the modal.
 */
function loadEditTaskTemplate(taskId) {
    document.getElementById("edit-modal-content").innerHTML = editTaskTempl(taskId);
}


/**
 * Populates the edit task modal fields with task data.
 * @param {Object} taskData - The task data to populate.
 */
function populateEditTaskFields(taskData) {
    setTimeout(() => {
        const titleField = document.getElementById("edit-task-title");
        const descField = document.getElementById("edit-task-description");
        const dateField = document.getElementById("edit-due-date");
        if (!titleField || !descField || !dateField) throw new Error("❌ Edit Task Modal elements missing!");
        titleField.value = taskData.title || "";
        descField.value = taskData.description || "";
        dateField.value = formatDateForInput(taskData.dueDate);
        setEditPriority(taskData.priority);
        setEditAssignedContacts(taskData.assignedTo || []);
        subtasksArray = taskData.subtasks || [];
        setEditSubtasks(subtasksArray);
        initEditTaskFlatpickr();
    }, 10);
}


/**
 * Closes the edit task modal and ensures proper visibility of other modals.
 */
function closeEditTaskModal() {
    const editTaskModal = document.getElementById("editTaskModal");
    if (!editTaskModal.classList.contains("hidden")) {
        editTaskModal.classList.add("hidden");
        restoreTaskDetailModal();
        return;
    }
    closeOverlayAndDetailModal();
}


/**
 * Restores the visibility of the task detail modal if it was previously open.
 */
function restoreTaskDetailModal() {
    const taskDetailModal = document.getElementById("taskDetailModal");
    const overlay = document.getElementById("taskDetailOverlay");
    if (taskDetailModal.classList.contains("hidden")) {
        taskDetailModal.classList.remove("hidden");
        taskDetailModal.style.display = "block";
    }
    if (!overlay.classList.contains("active")) {
        overlay.classList.add("active");
    }
}


/**
 * Closes the overlay and the task detail modal.
 */
function closeOverlayAndDetailModal() {
    document.getElementById("taskDetailOverlay").classList.remove("active");
    document.getElementById("taskDetailModal").classList.add("hidden");
}


/**
 * Deletes a task from the database and updates the UI.
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTask(taskId) {
    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, { method: "DELETE" });
        document.querySelector(`.task-card[data-id="${taskId}"]`)?.remove();
        updateNoTaskVisibility();
        closeTaskDetailModal();
        showDeleteConfirmation();
    } catch (error) {
        console.error("❌ Error deleting task:", error);
    }
}


/**
 * Displays a delete confirmation message with a fade-out effect.
 */
function showDeleteConfirmation() {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.classList.add("task-delete-confirmation");
    confirmationDiv.innerText = "Task successfully deleted";
    document.body.appendChild(confirmationDiv);
    setTimeout(() => confirmationDiv.classList.add("show"), 10);
    setTimeout(() => {
        confirmationDiv.classList.remove("show");
        setTimeout(() => confirmationDiv.remove(), 500);
    }, 2000);
}


/**
 * Retrieves all subtasks from the task modal.
 * @returns {Array<Object>} An array of subtasks with their text and checked status.
 */
function getSubtasks() {
    const subtaskElements = document.querySelectorAll("#subtask-list input[type='checkbox']");
    if (!subtaskElements.length) return console.warn("⚠️ No subtasks found. Returning []"), [];
    return Array.from(subtaskElements).map(checkbox => ({
        text: checkbox.nextElementSibling?.innerText.trim() || "Unnamed Subtask",
        checked: checkbox.checked
    }));
}


/**
 * Toggles edit buttons in the edit task modal and updates their styles.
 * @param {HTMLElement} clickedButton - The button that was clicked.
 */
function toggleEditButtons(clickedButton) {
    document.querySelectorAll("#editTaskModal .btn-switch").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "#000";
    });
    clickedButton.classList.add("active");
    const priorityColors = {
        urgent: ["#ff3b30", "#fff"],
        medium: ["#ffcc00", "#000"],
        low: ["#34c759", "#fff"]
    };
    const priority = clickedButton.id.replace("edit-", "");
    if (priorityColors[priority]) [clickedButton.style.backgroundColor, clickedButton.style.color] = priorityColors[priority];
}


/**
 * Handles click events on the task detail overlay.
 * Closes the task edit modal if the overlay itself is clicked.
 */
function handleTaskDetailOverlayClick() {
    const overlay = document.getElementById("taskDetailOverlay");
    if (overlay) {
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                closeEditTaskModal();
            }
        });
    }
}


/**
 * Sets up the edit assignment button to open the contact selection modal.
 */
function setupEditAssignmentButton() {
    const editAssignmentBtn = document.getElementById("toggle-contacts-btn");
    if (!editAssignmentBtn) return console.error("❌ Edit Assignment Button not found!");
    editAssignmentBtn.addEventListener("click", (event) => {
        console.log("✅ Edit Assignment Button Clicked!", event.target);
        const containerId = editAssignmentBtn.getAttribute("data-container-id");
        const listId = editAssignmentBtn.getAttribute("data-list-id");
        const selectedContainerId = editAssignmentBtn.getAttribute("data-selected-id");
        if (!listId) return console.error("❌ listId is undefined! Check button data attributes.");
        toggleContacts(event, containerId, listId, selectedContainerId);
    });
}


/**
 * Initializes the edit task contact selection functionality.
 * Retrieves required elements, initializes contacts, and sets up event listeners.
 */
function initEditTaskContacts() {
    const elements = getEditModalElements();
    if (!elements) return;
    const { editAssignmentButton, editContactsContainer, editContactsList } = elements;
    initializeEditContacts();
    setupEditTaskEventListeners(editAssignmentButton, editContactsContainer, editContactsList);
}


/**
 * Sets up event listeners for the edit task contacts.
 * Handles assignment button clicks and outside clicks to toggle the contact selection modal.
 * @param {HTMLElement} editAssignmentButton - The button to open the contact selection.
 * @param {HTMLElement} editContactsContainer - The container holding the contact list.
 * @param {HTMLElement} editContactsList - The list of selectable contacts.
 */
function setupEditTaskEventListeners(editAssignmentButton, editContactsContainer, editContactsList) {
    editAssignmentButton.addEventListener("click", (event) => {
        toggleContacts(event, editContactsContainer.id, editContactsList.id, "edit-selected-contacts-container");
    });
    document.addEventListener("click", (event) => {
        handleOutsideClick(event, editContactsContainer, ".assignment-btn");
    });
}


/**
 * Initializes the edit task contacts by fetching and rendering the contact list.
 * Also resets the selected contacts in the edit task modal.
 */
function initializeEditContacts() {
    fetchAndRenderContacts("edit-contacts-list");
    resetSelectedContacts();
}


/**
 * Retrieves essential elements from the edit task modal for contact management.
 * @returns {Object|null} An object containing the required elements, or null if any element is missing.
 * @property {HTMLElement} editAssignmentButton - The button to open the contact selection.
 * @property {HTMLElement} editContactsContainer - The container holding the contact list.
 * @property {HTMLElement} editContactsList - The list of selectable contacts.
 * @property {HTMLElement} editSelectedContainer - The container displaying selected contacts.
 */
function getEditModalElements() {
    const editAssignmentButton = document.getElementById("toggle-contacts-btn");
    const editContactsContainer = document.getElementById("edit-contacts-container");
    const editContactsList = document.getElementById("edit-contacts-list");
    const editSelectedContainer = document.getElementById("edit-selected-contacts-container");
    if (!editAssignmentButton || !editContactsContainer || !editContactsList || !editSelectedContainer) {
        console.error("❌ Missing elements in Edit Modal contact section.");
        return null;
    }
    return { editAssignmentButton, editContactsContainer, editContactsList, editSelectedContainer };
}


/**
 * Retrieves the initials of preselected contacts from the edit task modal.
 * @returns {Array<string>} An array of initials representing the preselected contacts.
 */
function getPreselectedContacts() {
    const container = document.getElementById("edit-selected-contacts-container");
    if (!container) return [];
    const avatars = container.querySelectorAll(".avatar-board-card"); // 🔄 Use querySelectorAll()
    const initialsList = Array.from(avatars).map(avatar => avatar.textContent.trim());
    console.log("🔎 Extracted Preselected Initials:", initialsList);
    return initialsList;
}


/**
 * Removes a preselected contact from the edit task modal.
 * 
 * @param {HTMLElement} contactItem - The contact element to be removed.
 */
function removePreselectedContact(contactItem) {
    const name = contactItem.querySelector(".contact-name").textContent.trim();
    const container = document.getElementById("edit-selected-contacts-container");
    const avatars = Array.from(container.getElementsByClassName("avatar-board-card"));
    const matchedAvatar = avatars.find(avatar => avatar.textContent.trim() === getInitials(name));
    if (matchedAvatar) {
        console.log(`❌ Removing preselected contact: ${name}`);
        matchedAvatar.remove();
        renderContactsList("edit-contacts-list");
    }
}


/**
 * Closes the edit task modal when clicking outside of it and restores the task detail modal.
 * Ensures that the task detail modal remains visible after closing the edit modal.
 */
document.getElementById("taskDetailOverlay").addEventListener("click", function (event) {
    if (event.target === this) {
        closeEditTaskModal();
        restoreTaskDetailModal(); // Stellt sicher, dass Task Detail sichtbar bleibt
    }
});