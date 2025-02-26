function createTask(event) {
    event.preventDefault();
    let taskData = getTaskFormData();

    if (!validateTaskData(taskData)) return;
    
    saveTaskToFirebase(taskData)
        .then(() => handleTaskSuccess())
        .catch(error => console.error("Fehler beim Speichern des Tasks: ", error));
}
    
function handleTaskSuccess() {
    showTaskPopup();
    setTimeout(() => window.location.href = "/board/board.html", 1500);
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
    let value = document.querySelector(selector)?.value.trim() || "";
    return formatText(value);
}

function getSelectedPriority() {
    const priorityText = document.querySelector(".btn-switch.active")?.innerText.trim() || "Medium";
    const priorityImages = {
        "Low": "/assets/imgs/low.png",
        "Medium": "/assets/imgs/medium.png",
        "Urgent": "/assets/imgs/urgent.png"
    };

    return {
        text: priorityText,
        image: priorityImages[priorityText] || "/assets/img/medium.png" // Default to "Medium"
    };
}

function getSelectedContacts() {
    const selectedCheckboxes = Array.from(document.querySelectorAll(".contact-checkbox:checked"));
    
    return selectedCheckboxes.map(checkbox => {
        const name = checkbox.dataset.contactName;
        const contact = allContacts.get(name); // 🔹 Kontakt-Objekt holen

        if (!contact) {
            console.warn(`Kein Kontakt gefunden für ${name}`); // 🔥 Debugging
            return null; // Falls der Kontakt nicht existiert, abbrechen
        }

        return {
            name: name,
            avatar: generateAvatar(name, contact.bgcolor) // ✅ bgcolor direkt von allContacts!
        };
    }).filter(contact => contact !== null); // Entfernt ungültige Einträge
}

console.log("All Contacts Map:", allContacts); // 🔥 Alle Kontakte aus dem Backend
console.log("Selected Contacts:", getSelectedContacts()); // 🔥 Ausgewählte Kontakte checken

function getInitials(name) {
    if (!name) return "??";  // ✅ Return placeholder initials if undefined

    const parts = name.split(" ");
    return parts.map(part => part[0]).join("").toUpperCase();
}

function generateAvatar(name, bgcolor) {
    let initials = getInitials(name);
    return {
        initials: initials,
        bgcolor: bgcolor
    };
}

function getSelectedCategory() {
    const category = document.querySelector("#selected-category")?.value.trim().toLowerCase();

    if (category === "technical task" || category === "user story") {
        return category
            .split(" ") 
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
            .join(" "); 
    }
}

function getSubtasks() {
    return Array.from(document.querySelectorAll("#subtask-list li"))
        .map(subtask => formatText(subtask.innerText.trim()));
}

function formatText(text) {
    return text
        .replace(/_/g, " ")
        .split(" ") 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(" "); 
}

function validateTaskData(taskData) {
    let isValid = true;

    !taskData.title.trim() ? (showError("#task-name", "Title is required."), isValid = false) : clearError("#task-name");
    !taskData.dueDate.trim() ? (showError("#due-date", "Due Date is required."), isValid = false) : clearError("#due-date");
    !taskData.category.trim() ? (showError("#selected-category", "Category is required."), isValid = false) : clearError("#selected-category");

    return isValid;
}

function showError(selector, message) {
    let field = document.querySelector(selector);
    if (!field) return;

    let errorMsg = field.nextElementSibling; // Die Fehlermeldung kommt direkt nach dem Eingabefeld
    errorMsg?.classList.contains("error-message") && (errorMsg.textContent = message, errorMsg.style.display = "block");
 
    const elementToHighlight = selector === "#selected-category" ? document.querySelector("#category-container") : field;
    elementToHighlight.classList.add("error");
}

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
        window.location.href = "/board/board.html"; 
    }, 1500);
}


