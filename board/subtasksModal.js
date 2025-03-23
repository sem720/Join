/**
 * Initializes event listeners for editing subtasks.
 */
function setupEditSubtaskInput() {
    const inputField = document.getElementById("edit-subtasks");
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");

    if (addSubtaskBtn) addSubtaskBtn.addEventListener("click", handleEditSubtaskClick);
    if (inputField) {
        inputField.addEventListener("keydown", handleEditSubtaskKeydown);
        inputField.addEventListener("input", handleEditSubtaskInput);
    }
}


/**
 * Shows or hides the "Add Subtask" button based on the input field content.
 */
function handleEditSubtaskInput() {
    const inputField = document.getElementById("edit-subtasks");
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");

    if (inputField.value.trim()) {
        addSubtaskBtn.style.display = "none";
        showEditSubtaskActions();
    } else {
        addSubtaskBtn.style.setProperty("display", "block", "important");

    }
}


/**
 * Saves a new subtask if the input field is not empty.
 */
function handleEditSubtaskClick() {
    const inputField = document.getElementById("edit-subtasks");
    if (inputField.value.trim()) {
        saveEditSubtask();
    }
}


/**
 * Creates and displays subtask action icons (save/delete) if they do not already exist.
 */
function showEditSubtaskActions() {
    if (document.querySelector("#edit-subtask-wrapper .subtask-action")) return;

    const inputField = document.getElementById("edit-subtasks");
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("subtask-action");

    iconContainer.append(
        createIcon("/assets/imgs/clear-subtask.png", "Clear Icon", "clear-icon", clearEditSubtask),
        document.createElement("div").classList.add("divider"),
        createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", saveEditSubtask)
    );

    inputField.parentElement.appendChild(iconContainer);
}


/**
 * Removes subtask action icons and restores the "Add Subtask" button.
 */
function removeEditSubtaskActions() {
    document.querySelector(".subtask-action")?.remove();
    
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");
    if (addSubtaskBtn) {
        addSubtaskBtn.style.display = "flex"; 
        addSubtaskBtn.src = "/assets/imgs/add-subtask.png"; 
    } 
}


/**
 * Saves the entered subtask to the list and clears the input field.
 */
function saveEditSubtask() {
    const inputField = document.getElementById("edit-subtasks");
    const subtaskList = document.getElementById("edit-subtask-list");

    if (inputField.value.trim()) {
        const li = createSubtaskElement(inputField.value);
        subtaskList.appendChild(li);
    }

    inputField.value = "";
    removeEditSubtaskActions();
}


/**
 * Clears the input field and restores the "Add Subtask" button.
 */
function clearEditSubtask() {
    const inputField = document.getElementById("edit-subtasks");
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");

    inputField.value = "";
    addSubtaskBtn.src = "/assets/imgs/add-subtask.png"; 
    addSubtaskBtn.style.display = "block";
}


/**
 * Saves the subtask when the user presses the Enter key.
 * @param {KeyboardEvent} event - The keydown event.
 */
function handleEditSubtaskKeydown(event) {
    const inputField = document.getElementById("edit-subtasks");

    if (event.key === "Enter") {
        event.preventDefault();

        if (inputField.value.trim()) {
            showEditSubtaskActions();
            saveEditSubtask();
        }
    }
}