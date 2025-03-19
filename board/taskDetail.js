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
    const taskDetailModal = document.getElementById("taskDetailModal");
    const editTaskModal = document.getElementById("editTaskModal");
    if (!editTaskModal.classList.contains("hidden")) return closeEditTaskModal();
    overlay.classList.remove("active");
    taskDetailModal.classList.add("hidden");
    ensureTaskDetailVisibility(overlay, taskDetailModal);
}


/**
 * Ensures the task detail modal visibility after closing.
 * @param {HTMLElement} overlay - The task detail overlay element.
 * @param {HTMLElement} taskDetailModal - The task detail modal element.
 */
function ensureTaskDetailVisibility(overlay, taskDetailModal) {
    setTimeout(() => {
        if (!overlay.classList.contains("active")) {
            taskDetailModal.classList.remove("hidden");
        }
    }, 300);
}


/**
 * Opens the edit task modal by fetching task data and populating the fields.
 * @param {string} taskId - The ID of the task to edit.
 */
async function openEditTaskModal(taskId) {
    try {
        const taskData = await fetchTaskData(taskId);
        if (!taskData) throw new Error("❌ No task data found!");

        hideTaskDetailModal();
        loadEditTaskTemplate();

        // Wait until the modal exists in the DOM
        await new Promise((resolve) => {
            const checkExist = setInterval(() => {
                const modal = document.getElementById("editTaskModal");
                if (modal) {
                    clearInterval(checkExist);
                    resolve();
                }
            }, 50);
        });

        populateEditTaskFields(taskData);
        document.getElementById("editTaskModal").classList.remove("hidden");

        initEditTaskContacts("edit-contacts-list");
        updateSelectedContactsDisplay("edit-selected-contacts-container"); // Show them
        setupAddSubtaskButton();
        
    } catch (error) {
        console.error("❌ Error loading task data:", error);
    }
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
    document.getElementById("taskDetailModal").classList.add("hidden");
}


/**
 * Loads the edit task template into the modal.
 */
function loadEditTaskTemplate() {
    document.getElementById("edit-modal-content").innerHTML = editTaskTempl();
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
        if (!titleField || !descField || !dateField) {
            throw new Error("❌ Edit Task Modal elements missing in HTML!");
        }
        titleField.value = taskData.title || "";
        descField.value = taskData.description || "";
        dateField.value = formatDateForInput(taskData.dueDate);
        setEditPriority(taskData.priority);
        setEditAssignedContacts(taskData.assignedTo || []);
        setEditSubtasks(taskData.subtasks || []);
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
    if (taskDetailModal && !taskDetailModal.classList.contains("hidden")) {
        taskDetailModal.classList.remove("hidden");
    } else {
        overlay.classList.remove("active");
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
    if (priorityColors[priority]) {
        [clickedButton.style.backgroundColor, clickedButton.style.color] = priorityColors[priority];
    }
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


function initEditTaskContacts() {
    console.log("🎯 Initializing Edit Modal Contacts");

    // Get elements specific to the Edit Modal
    const editAssignmentButton = document.getElementById("toggle-contacts-btn");
    const editContactsContainer = document.getElementById("edit-contacts-container");
    const editContactsList = document.getElementById("edit-contacts-list");
    const editSelectedContainer = document.getElementById("edit-selected-contacts-container");

    if (!editAssignmentButton || !editContactsContainer || !editContactsList || !editSelectedContainer) {
        console.error("❌ Missing elements in Edit Modal contact section.");
        return;
    }

    // Fetch and render contacts for the Edit Modal
    fetchAndRenderContacts("edit-contacts-list");

    // Add click event listener to toggle contacts
    editAssignmentButton.addEventListener("click", (event) => {
        toggleContacts(event, "edit-contacts-container", "edit-contacts-list", "edit-selected-contacts-container");
    });

    // Listen for outside clicks
    document.addEventListener("click", (event) => {
        handleOutsideClick(event, editContactsContainer, ".assignment-btn");
    });

    console.log("✅ Edit Modal Contacts Initialized");
}


function getPreselectedContacts() {
    const container = document.getElementById("edit-selected-contacts-container");
    if (!container) {
        console.warn("⚠️ getPreselectedContacts: Edit modal is not open. Skipping.");
        return [];
    }

    const avatars = container.querySelectorAll(".avatar-board-card"); // 🔄 Use querySelectorAll()
    const initialsList = Array.from(avatars).map(avatar => avatar.textContent.trim());

    console.log("🔎 Extracted Preselected Initials:", initialsList);
    return initialsList;
}



function removePreselectedContact(contactItem) {
    const name = contactItem.querySelector(".contact-name").textContent.trim();
    const container = document.getElementById("edit-selected-contacts-container");
    const avatars = Array.from(container.getElementsByClassName("avatar-board-card"));

    const matchedAvatar = avatars.find(avatar => avatar.textContent.trim() === getInitials(name));

    if (matchedAvatar) {
        console.log(`❌ Removing preselected contact: ${name}`);
        matchedAvatar.remove();

        // Re-enable selection in the list
        renderContactsList("edit-contacts-list");
    }
}
