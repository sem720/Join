/** ================================
 *          TASK CREATION
 * ================================ */
/**
 * Creates a new task by gathering form data, validating it, and saving it to Firebase.
 * @param {Event} event - The form submission event.
 */
function createTask(event) {
    event.preventDefault();
    
    const taskData = getTaskFormData();
    saveTaskToFirebase(taskData);
    showTaskPopup();
}


/**
 * Retrieves and formats assigned contacts for the task.
 * @returns {Array<Object>} - List of assigned users with name, background color, and initials.
 */
function getSafeAssignedContacts() {
    return Array.from(selectedContacts).map(user => ({
        name: user.name || "Unknown",
        avatar: {
            bgcolor: user.bgcolor || "#ccc",
            initials: getInitials(user.name || "?")
        }
    }));
}


/**
 * Handles the task creation event and provides user feedback.
 * @param {Event} event - The form submission event.
 */
function handleTaskCreation(event) {
    event.preventDefault();

    if (validateForm()) {
        alert("Task created!");
    }
}


/**
 * Handles the success state after a task is successfully created.
 * Shows a popup and redirects to the board page.
 */
function handleTaskSuccess() {
    showTaskPopup();

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}


/** ================================
 *        FORM DATA HANDLING
 * ================================ */

/**
 * Retrieves task form data and returns it as an object.
 * @returns {Object} The task data object.
 */
function getTaskFormData() {
    return {
        title: getValue("#task-name"),
        description: getValue("#description"),
        assignedTo: getSelectedContacts(),
        dueDate: getValue("#due-date"),
        priority: getSelectedPriority(),
        category: getSelectedCategory(),
        subtasks: getTaskSubtasks(),
        mainCategory: getMainCategory()
    };
}


/**
 * Returns the main category of the task.
 * @returns {string} The default category "To do".
 */
function getMainCategory() {
    return "To do";
}


/**
 * Retrieves and formats the value of an input field.
 * @param {string} selector - The CSS selector for the input element.
 * @returns {string} The formatted input value.
 */
function getValue(selector) {
    return formatText(document.querySelector(selector)?.value.trim() || "");
}


/**
 * Clears the task form fields and resets validation states.
 */
function clearTask() {
    const selectedContacts = new Set();

    ["task-name", "description", "subtasks"].forEach(id => document.getElementById(id).value = "");
    resetDateInput(document.getElementById("due-date"));

    document.querySelector(".dropdown-btn").innerHTML = `Select task category <span class="icon-container"><img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon"></span>`;
    document.getElementById("selected-contacts-container").innerHTML = "";
    selectedContacts.clear();

    document.querySelectorAll(".error-message").forEach((error) => { error.style.display = "none"; });
    document.querySelectorAll(".error").forEach((el) => { el.classList.remove("error"); });

    checkFormValidity();
}


/** ================================
 *        TASK VALIDATION
 * ================================ */

/**
 * Validates the task data before submission.
 * @param {Object} taskData - The task data object.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateTaskData(taskData) {
    let isValid = true;

    !taskData.title.trim() ? (showError("#task-name", "Title is required."), isValid = false) : clearError("#task-name");
    !taskData.dueDate.trim() ? (showError("#due-date", "Due Date is required."), isValid = false) : clearError("#due-date");
    !taskData.category.trim() ? (showError("#selected-category", "Category is required."), isValid = false) : clearError("#selected-category");

    return isValid;
}


/** ================================
 *        TASK PRIORITY
 * ================================ */

/**
 * Retrieves the selected priority of the task.
 * @returns {{priorityText: string, priorityImage: string}} The priority object.
 */
function getSelectedPriority() {
    if (!activeButton) {
        console.warn("⚠️ No active button found, returning default priority.");
        return { priorityText: "Medium", priorityImage: "/assets/imgs/medium.png" };
    }

    const priority = {
        priorityText: activeButton.innerText.trim(),
        priorityImage: getPriorityImage(activeButton.id)
    };

    return priority;
}


/**
 * Retrieves the image URL for a given priority level.
 * @param {string} priority - The priority level ("low", "medium", "urgent").
 * @returns {string} The corresponding image URL.
 */
function getPriorityImage(priority) {
    const priorityImages = {
        "low": "/assets/imgs/low.png",
        "medium": "/assets/imgs/medium.png",
        "urgent": "/assets/imgs/urgent.png"
    };
    return priorityImages[priority] || "/assets/imgs/medium.png";
}


/** ================================
 *      CONTACT SELECTION
 * ================================ */

/**
 * Retrieves the selected contacts from the form.
 * @returns {Array<{name: string, avatar: Object}>} An array of selected contacts.
 */
function getSelectedContacts() {
    return Array.from(document.querySelectorAll(".contact-checkbox:checked"))
        .map(checkbox => {
            const name = checkbox.dataset.contactName;
            const contact = allContacts.get(name);
            return contact ? { name, avatar: generateAvatar(name, contact.bgcolor) } : (console.warn(`⚠️ Kein Kontakt gefunden für ${name}`), null);
        })
        .filter(contact => contact);
}



/**
 * Generates an avatar object for a contact.
 * @param {string} name - The contact's name.
 * @param {string} bgcolor - The background color for the avatar.
 * @returns {{initials: string, bgcolor: string}} The avatar object.
 */
function generateAvatar(name, bgcolor) {
    return {
        initials: getInitials(name),
        bgcolor
    };
}


/** ================================
 *      CATEGORY SELECTION
 * ================================ */

/**
 * Retrieves the selected category from the form.
 * @returns {string} The formatted category name.
 */
function getSelectedCategory() {
    const selectedInput = document.getElementById("selected-category");
    if (!selectedInput) return console.error("❌ Error: Could not find #selected-category input.") || "";

    let category = selectedInput.value?.trim();

    if (!category) return console.log("⚠️ No category selected!") || "";

    return category.replace("_", " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


/** ================================
 *      SUBTASKS HANDLING
 * ================================ */

/**
 * Retrieves the subtasks from the form.
 * @returns {Array<{text: string, completed: boolean}>} An array of subtasks.
 */
function getTaskSubtasks() {
    const subtasks = Array.from(document.querySelectorAll(".subtask-item")).map(subtask => ({
        text: formatText(subtask.textContent),
        completed: false
    }));

    return subtasks;
}


/** ================================
 *      FIREBASE INTEGRATION
 * ================================ */

/**
 * Saves the task data to Firebase.
 * @param {Object} taskData - The task data object.
 * @returns {Promise<void>} A promise that resolves when the task is saved.
 */
async function saveTaskToFirebase(taskData) {
    try {
        await firebase.database().ref("tasks").push(taskData);
    } catch (error) {
        console.error("❌ Fehler beim Speichern des Tasks:", error);
    }
}


/** ================================
 *      POPUP NOTIFICATION
 * ================================ */

/**
 * Displays a task-added notification popup.
 */
function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}



