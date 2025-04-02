
/**
 * Sets the priority button in the edit task modal.
 * @param {Object} priority - The priority object.
 * @param {string} priority.priorityText - The priority level ("urgent", "medium", "low").
 */
function setEditPriority(priority) {
    setTimeout(() => {
        if (!isValidPriority(priority)) return;
        const priorityText = priority.priorityText.toLowerCase().trim();
        resetPriorityButtons();
        activatePriorityButton(priorityText);
    }, 10);
}


/**
 * Checks if the provided priority object is valid.
 * @param {Object} priority - The priority object.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidPriority(priority) {
    if (!priority || !priority.priorityText) {
        console.warn("⚠️ Invalid priority provided.");
        return false;
    }
    return true;
}


/**
 * Resets all priority buttons by removing active state and resetting styles.
 */
function resetPriorityButtons() {
    document.querySelectorAll("#editTaskModal .btn-switch").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "#000";
    });
}


/**
 * Activates the selected priority button and applies styles.
 * @param {string} priorityText - The priority level ("urgent", "medium", "low").
 */
function activatePriorityButton(priorityText) {
    const button = document.getElementById(`edit-${priorityText}`);
    if (!button) return;
    button.classList.add("active");
    button.setAttribute("data-active", "true");
    setPriorityStyle(button, priorityText);
}


/**
 * Sets the appropriate background and text color for the priority button.
 * @param {HTMLElement} button - The priority button element.
 * @param {string} priorityText - The priority level ("urgent", "medium", "low").
 */
function setPriorityStyle(button, priorityText) {
    const styles = {
        urgent: { bg: "#ff3b30", color: "#fff" },
        medium: { bg: "#ffcc00", color: "#000" },
        low: { bg: "#34c759", color: "#fff" }
    };
    button.style.backgroundColor = styles[priorityText]?.bg || "";
    button.style.color = styles[priorityText]?.color || "";
}


/**
 * Retrieves the selected priority or returns the default if none is selected.
 * @returns {{ priorityText: string, priorityImage: string }} The selected or default priority.
 */
function getSelectedPriority() {
    const button = document.querySelector(".btn-switch.active");
    const priorityText = button ? button.innerText.trim() : "Medium";
    return {
        priorityText,
        priorityImage: getPriorityImage(priorityText, !button)
    };
}


/**
 * Maps priority levels to their corresponding images.
 * @param {string} priorityText - The priority level ("Low", "Medium", "Urgent").
 * @param {boolean} isDefault - Whether the default priority is being used.
 * @returns {string} The image path for the given priority.
 */
function getPriorityImage(priorityText, isDefault) {
    if (isDefault) console.warn("⚠️ No active priority button found, using default.");
    return {
        Low: "/assets/imgs/low.png",
        Medium: "/assets/imgs/medium.png",
        Urgent: "/assets/imgs/urgent.png"
    }[priorityText] || "/assets/imgs/medium.png";
}


let subtasksArray = []; // Global variable to store the subtasks
/**
 * Sets the subtask list in the `editTaskModal` with UI updates.
 * @param {Array} subtasks - The list of subtasks.
 */
function setEditSubtasks(subtasks) {
    subtasksArray = subtasks;
    const list = document.getElementById("edit-subtask-list");
    list.innerHTML = subtasks.map((subtask, index) => subtaskTemplate(subtask, index)).join("");
}


/**
 * Retrieves the edited subtasks while preserving their completed status.
 * @returns {Array<Object>} Updated subtask list with correct completion status.
 */
function getEditedSubtasks() {
    return Array.from(document.querySelectorAll("#edit-subtask-list .subtask-item")).map((li) => {
        const textElement = li.querySelector(".subtask-text");
        const text = textElement ? textElement.textContent.replace("• ", "").trim() : "Unnamed Subtask";
        const existingSubtask = subtasksArray.find(sub => sub.text === text);
        return {
            text,
            completed: existingSubtask ? existingSubtask.completed : false
        };
    });
}


/**
 * Adds a new subtask to the UI (not yet in the backend!).
 */
function addNewSubtask() {
    const inputField = document.getElementById("edit-subtasks");
    const subtaskText = inputField.value.trim();
    if (!subtaskText) return;
    subtasksArray.push({ text: subtaskText, completed: false });
    renderSubtasks();
    inputField.value = "";
}


/**
 * Updates the UI for the subtask list in the `editTaskModal`.
 */
function renderSubtasks() {
    setEditSubtasks(subtasksArray);
}


/**
 * Edits an existing subtask in the `editTaskModal` by replacing the text with an input field.
 * @param {number} index - Index of the subtask in `subtasksArray`
 */
function editSubtaskInEditModal(index) {
    const subtaskItem = document.querySelector(`#subtask-${index}`);
    if (!subtaskItem) return console.error("❌ Subtask not found!");
    const inputField = createSubtaskInput(subtaskItem);
    const saveIcon = subtaskItem.querySelector(".save-subtask-icon");
    saveIcon.classList.remove("hidden");
    saveIcon.addEventListener("click", () => saveEditedSubtask(index, inputField.value));
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const currentValue = event.target.value?.trim();
            if (currentValue) saveEditedSubtask(index, currentValue);
        }
    });
}


/**
 * Creates an input field for editing a subtask and replaces the existing text.
 * @param {HTMLElement} subtaskItem - The subtask element to be edited.
 * @returns {HTMLInputElement} The created input field.
 */
function createSubtaskInput(subtaskItem) {
    const subtaskTextElement = subtaskItem.querySelector(".subtask-text");
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = subtaskTextElement.textContent.replace("• ", "").trim();
    inputField.classList.add("edit-subtask-input");
    subtaskItem.replaceChild(inputField, subtaskTextElement);
    inputField.focus();
    return inputField;
}


/**
 * Saves the changed subtask and shows the point again in the UI.
 * @param {number} index - Index of the Subtask
 * @param {string} newText - The new text of the subtask
 */
function saveEditedSubtask(index, newText) {
    if (typeof newText !== "string" || !newText.trim()) return;
    subtasksArray[index].text = newText.trim();
    renderSubtasks();
}


/**
 * Deletes a subtask from `subtasksArray`.
 * @param {number} index - Index of the Subtask
 */
function deleteSubtaskInEditModal(index) {
    subtasksArray.splice(index, 1);
    setEditSubtasks(subtasksArray);
}


/**
 * Updates the assigned contacts display in the edit task modal.
 * @param {Array<Object>} contacts - List of assigned contacts.
 * @param {string} contacts[].name - Full name of the contact.
 * @param {Object} contacts[].avatar - Avatar details of the contact.
 * @param {string} contacts[].avatar.bgcolor - Background color of the avatar.
 * @param {string} contacts[].avatar.initials - Initials of the contact.
 */
function setEditAssignedContacts(contacts) {
    const container = document.getElementById("edit-selected-contacts-container");
    container.innerHTML = '';
    const content = contacts.map(contact => {
        return `<div class="avatar avatar-board-card" 
                style="background-color: ${contact.avatar.bgcolor};" 
                data-name="${contact.name}"> 
                    ${contact.avatar.initials}
                </div>`;
    }).join("");
   
    container.innerHTML = content;

    
}


/**
 * Retrieves the edited assigned contacts from the edit task modal.
 * @returns {Array<Object>} List of assigned contacts with name and avatar details.
 */
function getEditedAssignedContacts() {
    const container = document.querySelector("#edit-selected-contacts-container");
    if (!container) {
        console.error("❌ Container not found!");
        return [];
    }

    const contactElements = container.querySelectorAll(".avatar-board-card");
    if (contactElements.length === 0) console.warn("⚠️ No contact elements found in the container.");
    
    const contacts = Array.from(contactElements).map(parseContactElement);
    return contacts;
}

/**
 * Extracts contact details from a contact element.
 * @param {HTMLElement} contactElement - The contact element in the UI.
 * @returns {Object} Contact details including name and avatar.
 */
function parseContactElement(contactElement) {
    const initials = contactElement.textContent.trim();
    const bgcolor = contactElement.style.backgroundColor.startsWith("rgb")
        ? rgbToHex(contactElement.style.backgroundColor)
        : contactElement.style.backgroundColor;
    const name = contactElement.getAttribute("data-name") || findContactName(initials);
    return { avatar: { bgcolor, initials }, name };
}


/**
 * Finds a contact name in allContacts by matching initials.
 * @param {string} initials - The initials to match.
 * @returns {string} The full name or "Unknown User" if not found.
 */
function findContactName(initials) {
    if (!allContacts.size) return console.warn("⚠️ `allContacts` is empty."), "Unknown User";
    const contact = [...allContacts.values()].find(c => getInitials(c.name) === initials);
    return contact ? contact.name : "Unknown User";
}


/**
 * Converts an RGB color to HEX.
 * @param {string} rgb -The RGB color in the format "rgb(r, g, b)".
 * @returns {string} The HEX color in the format "#RRGGBB".
 */
function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return "#CCCCCC";
    return `#${match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}


/**
 * Displays a confirmation message when a task is successfully updated.
 * The message appears temporarily and fades out after a short duration.
 */
function showEditConfirmation() {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.classList.add("task-edit-confirmation");
    confirmationDiv.innerText = "Task successfully updated";
    document.body.appendChild(confirmationDiv);
    setTimeout(() => {
        confirmationDiv.classList.add("show");
    }, 10);
    setTimeout(() => {
        confirmationDiv.classList.remove("show");
        setTimeout(() => {
            confirmationDiv.remove();
        }, 500);
    }, 2000);
}


/**
 * Formats a given date string into the "DD/MM/YYYY" format.
 * If the input is already in "DD/MM/YYYY", it is returned as is.
 * If the input is an invalid date, an empty string is returned.
 * @param {string} dueDate - The date string to be formatted.
 * @returns {string} The formatted date in "DD/MM/YYYY" format or an empty string if invalid.
 */
function formatDateForInput(dueDate) {
    if (!dueDate) return ""; // Falls kein Datum vorhanden ist
    const dateParts = dueDate.split("/"); // Falls TT/MM/YYYY aus Backend kommt
    if (dateParts.length === 3) {
        return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`; // Falls bereits TT/MM/YYYY ist
    }
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) return ""; // Falls ungültiges Datum
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


//attaching click to calendar icon
// function setupEditCalendarIcon() {
//     const dateInput = document.getElementById("edit-due-date");
//     const calendarIcon = document.getElementById("edit-calendar-icon");

//     if (!dateInput || !calendarIcon) return console.error("Edit date input or calendar icon not found.");

//     calendarIcon.addEventListener("click", function () {
//         if (!dateInput._flatpickr) return console.error("Flatpickr is not initialized on #edit-due-date.");

//         // ✅ Toggle calendar: If open, close it; if closed, open it
//         dateInput._flatpickr.isOpen ? dateInput._flatpickr.close() : dateInput._flatpickr.open();
//     });
// }


/**
 * Sets up the reset functionality for the edit due date input.
 * When the calendar icon is clicked, the selected date is cleared.
 */
function setupEditDateReset() {
    const dateInput = document.getElementById("edit-due-date");
    const calendarIcon = document.getElementById("edit-calendar-icon");
    if (!dateInput || !dateInput._flatpickr) return console.error("Edit date input or Flatpickr instance not found.");
    calendarIcon.addEventListener("click", function () {
        dateInput._flatpickr.clear();  // ✅ Clears the date
    });
}


/**
 * Sets up the reset functionality for the edit due date input.
 * When the calendar icon is clicked, the selected date is cleared.
 */
function handleEditCalendarClick() {
    const calendarIcon = document.getElementById("edit-calendar-icon");
    const dateInput = document.getElementById("edit-due-date");
    if (!calendarIcon || !dateInput || !dateInput._flatpickr) return console.error("❌ Flatpickr or elements not initialized properly.");
    calendarIcon.addEventListener("click", () => {
        console.log("Calendar icon clicked!");
        dateInput._flatpickr.isOpen ? dateInput._flatpickr.close() : dateInput._flatpickr.open();
    });
}


/**
 * Initializes the Flatpickr date picker for the edit task modal.
 * Configures the date format, enables manual input, and sets up event listeners.
 */
function initEditTaskFlatpickr() {
    console.log("Initializing Flatpickr for edit modal...");
    flatpickr("#edit-due-date", {
        dateFormat: "d/m/Y",
        allowInput: true,
        placeholder: "dd/mm/yyyy"
    });
    handleEditCalendarClick();
    setupEditDateReset();
}


