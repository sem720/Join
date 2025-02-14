function createTask(event) {
    event.preventDefault();

    let taskData = getTaskFormData();
    console.log("Task Data:", taskData); 

    if (!validateTaskData(taskData)) {
        return;
    }

    saveTaskToFirebase(taskData).then(() => {
        window.location.href = "board.html";
    }).catch(error => {
        console.error("Fehler beim Speichern des Tasks:", error);
        alert("Es gab ein Problem beim Speichern des Tasks. Bitte versuchen Sie es erneut.");
    });
}

function getTaskFormData() {
    return {
        title: getValue("#task-name"),
        description: getValue("#description"),
        assignedTo: getSelectedContacts(),
        dueDate: getValue("#due-date"),
        priority: getSelectedPriority(),
        category: getValue("#selected-category"),
        subtasks: getSubtasks()
    };
}

function getValue(selector) {
    return document.querySelector(selector)?.value.trim() || "";
}

function getSelectedPriority() {
    return document.querySelector(".btn-switch.active")?.innerText.trim() || "Medium";
}

function getSelectedContacts() {
    return Array.from(document.querySelectorAll("#contacts-list .selected"))
                .map(contact => contact.dataset.contactId);
}

function getSubtasks() {
    return Array.from(document.querySelectorAll(".subtask-text"))
                .map(subtask => subtask.innerText.trim());
}

function validateTaskData(taskData) {
    let isValid = true;

    if (!taskData.title.trim()) {
        showError("#task-name", "Title is required.");
        isValid = false;
    } else {
        clearError("#task-name");
    }

    if (!taskData.dueDate.trim()) {
        showError("#due-date", "Due Date is required.");
        isValid = false;
    } else {
        clearError("#due-date");
    }

    if (!taskData.category.trim()) {
        showError("#selected-category", "Category is required.");
        isValid = false;
    } else {
        clearError("#selected-category");
    }

    return isValid;
}

function showError(selector, message) {
    let field = document.querySelector(selector);
    if (!field) return;

    let container; 

    if (selector === "#selected-category") {
        container = field.previousElementSibling; // Spezifisch für das Dropdown
    } else {
        container = field.closest(".input-container") || field.parentElement;
    }

    if (container && container.classList.contains("dropdown-container")) {
        container.classList.add("error");
    } else {
        field.classList.add("error");
    }

    let errorMsg = container.querySelector(".error-message");
    if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.classList.add("error-message");
        container.insertAdjacentElement("afterend", errorMsg);
    }

    errorMsg.textContent = message;
    errorMsg.style.display = "block";
}


function clearError(selector) {
    let field = document.querySelector(selector);
    field.classList.remove("error");

    let errorMsg = field.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains("error-message")) {
        errorMsg.remove();
    }
}

    