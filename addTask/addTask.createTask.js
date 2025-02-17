function createTask(event) {
    event.preventDefault();

    let taskData = getTaskFormData();
    console.log("Task Data:", taskData); 

    if (!validateTaskData(taskData)) {
        return;
    }

    saveTaskToFirebase(taskData)
    .then(() => {
        showTaskPopup(); 
        setTimeout(() => {
            window.location.href = "/board/board.html"; // Nach 2 Sekunden zur Board-Seite
        }, 1500);
    })
    .catch(error => {
        console.error("Fehler beim Speichern des Tasks:", error);
    });
}

function getTaskFormData() {
    const assignedContacts = getSelectedContacts();
    return {
        title: getValue("#task-name"),
        description: getValue("#description"),
        assignedTo: assignedContacts, 
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
    const selectedCheckboxes = Array.from(document.querySelectorAll(".contact-checkbox:checked"));

    console.log("🎯 Gefundene Checkboxen:", selectedCheckboxes);

    const selected = selectedCheckboxes.map(checkbox => {
        console.log("📌 Checkbox Data:", checkbox, "dataset.contactId:", checkbox.dataset.contactId);
        return checkbox.dataset.contactId || "FEHLER"; // Falls `undefined`, sehen wir "FEHLER" in der Konsole
    });

    console.log("✅ Ausgewählte Kontakte für Backend:", selected);

    return selected.filter(id => id !== "FEHLER" && id !== undefined && id !== "");
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
        })
        .catch(error => {
            console.error("Fehler beim Speichern des Tasks:", error);
        });
}

function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    
    popup.classList.add("show");

    setTimeout(() => {
        window.location.href = "/board/board.html"; // Pfad anpassen
    }, 1500);
}

document.getElementById("createTaskButton").addEventListener("click", showPopup);