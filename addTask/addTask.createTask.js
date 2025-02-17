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
    let selectedValue = document.getElementById("selected-category")?.value || "";
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

console.log("Selected category input:", categoryInput);
console.log("Selected category value:", selectedValue);


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

    !taskData.title.trim() ? (showError("#task-name", "Title is required."), isValid = false) : clearError("#task-name");
    !taskData.dueDate.trim() ? (showError("#due-date", "Due Date is required."), isValid = false) : clearError("#due-date");
    !taskData.category.trim() ? (showError("#selected-category", "Category is required."), isValid = false) : clearError("#selected-category");

    return isValid;
}

// Zeigt eine Fehlermeldung an
function showError(selector, message) {
    let field = document.querySelector(selector);
    if (!field) return;

    let errorMsg = field.nextElementSibling; // Die Fehlermeldung kommt direkt nach dem Eingabefeld
    errorMsg?.classList.contains("error-message") && (errorMsg.textContent = message, errorMsg.style.display = "block");
 
    const elementToHighlight = selector === "#selected-category" ? document.querySelector("#category-container") : field;

    elementToHighlight.classList.add("error");
}

// Versteckt eine Fehlermeldung
function clearError(selector) {
    let field = document.querySelector(selector);
    if (!field) return;

    let errorMsg = field.nextElementSibling; // Die Fehlermeldung kommt direkt nach dem Eingabefeld

    errorMsg?.classList.contains("error-message") && (errorMsg.style.display = "none");

    (selector === "#selected-category" ? document.querySelector("#category-container") : field).classList.remove("error");
}

function saveTaskToFirebase(taskData) {
    return firebase.database().ref("tasks").push(taskData)
        .then(() => {
            console.log("Task erfolgreich gespeichert:", taskData);
            showSuccessToast("Task wurde erfolgreich zum Board hinzugefügt!");
        })
        .catch(error => {
            console.error("Fehler beim Speichern des Tasks:", error);
            alert("Fehler beim Speichern des Tasks. Bitte versuchen Sie es erneut.");
        });
}