
function setEditPriority(priority) {
    setTimeout(() => {
        if (!priority || !priority.priorityText) {
            console.warn("⚠️ Keine gültige Priorität gefunden.");
            return;
        }

        const priorityText = priority.priorityText.toLowerCase().trim(); // "urgent", "medium", "low"
        const buttonId = `edit-${priorityText}`; // 🔴 Neue ID: edit-urgent, edit-medium, edit-low

        // Alle Buttons im Modal zurücksetzen
        document.querySelectorAll("#editTaskModal .btn-switch").forEach(btn => {
            btn.classList.remove("active");
            btn.style.backgroundColor = "";
            btn.style.color = "#000";
        });

        // Richtigen Button im Modal finden
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add("active");
            button.setAttribute("data-active", "true");

            // Stile setzen
            switch (priorityText) {
                case "urgent":
                    button.style.backgroundColor = "#ff3b30";
                    button.style.color = "#fff";
                    break;
                case "medium":
                    button.style.backgroundColor = "#ffcc00";
                    button.style.color = "#000";
                    break;
                case "low":
                    button.style.backgroundColor = "#34c759";
                    button.style.color = "#fff";
                    break;
            }
        }
    }, 10);
}



// Example of a function to get the selected priority
function getSelectedPriority() {
    const priorityButton = document.querySelector(".btn-switch.active");
    if (!priorityButton) {
        console.warn("⚠️ No active priority button found, using default.");
        return { priorityText: "Medium", priorityImage: "/assets/imgs/medium.png" };
    }
    const priorityText = priorityButton.innerText.trim();
    const priorityImages = {
        "Low": "/assets/imgs/low.png",
        "Medium": "/assets/imgs/medium.png",
        "Urgent": "/assets/imgs/urgent.png"
    };
    return {
        priorityText,
        priorityImage: priorityImages[priorityText] || "/assets/imgs/medium.png"
    };
}



let subtasksArray = []; // Globale Variable zum Speichern der Subtasks
/**
 * Setzt die Subtask-Liste im `editTaskModal` mit UI-Updates.
 * @param {Array} subtasks - Die Liste der Subtasks.
 */
function setEditSubtasks(subtasks) {
    subtasksArray = subtasks; // 🆕 Subtasks beibehalten!
    const list = document.getElementById("edit-subtask-list");
    list.innerHTML = subtasks.map((subtask, index) => subtaskTemplate(subtask, index)).join("");
}


/**
 * Holt die bearbeiteten Subtasks aus `editTaskModal`.
 * Speichert den richtigen Text für jede Subtask.
 */
function getEditedSubtasks() {
    return Array.from(document.querySelectorAll("#edit-subtask-list .subtask-item")).map(li => {
        const textElement = li.querySelector(".subtask-text");
        return {
            text: textElement ? textElement.textContent.replace("• ", "").trim() : "Unnamed Subtask",
            completed: false // Da es ein neuer Subtask ist, immer `false`
        };
    });
}


/**
 * Fügt eine neue Subtask zur UI hinzu (noch nicht im Backend!).
 */
function addNewSubtask() {
    const inputField = document.getElementById("edit-subtasks");
    const subtaskText = inputField.value.trim();
    if (!subtaskText) return;
    subtasksArray.push({ text: subtaskText, completed: false });
    renderSubtasks(); // UI aktualisieren
    inputField.value = ""; // 🔄 Eingabefeld leeren
}


/**
 * Aktualisiert die UI für die Subtask-Liste im `editTaskModal`.
 */
function renderSubtasks() {
    setEditSubtasks(subtasksArray);
}


/**
 * Bearbeitet eine bestehende Subtask im `editTaskModal` direkt in der Zeile.
 * @param {number} index - Index der Subtask in `subtasksArray`
 */
function editSubtask(index) {
    const subtaskItem = document.querySelector(`#subtask-${index}`);
    if (!subtaskItem) return console.error("❌ Subtask nicht gefunden!");

    const subtaskTextElement = subtaskItem.querySelector(".subtask-text");
    const subtaskText = subtaskTextElement.textContent.replace("• ", "").trim(); // 🔄 Punkt entfernen für Bearbeitung

    // Erstelle ein Eingabefeld anstelle des Textes
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = subtaskText;
    inputField.classList.add("edit-subtask-input");

    // Ersetze den Text mit dem Eingabefeld
    subtaskItem.replaceChild(inputField, subtaskTextElement);
    inputField.focus();

    // ✅ Speichern bei Enter-Taste
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveEditedSubtask(index, inputField.value);
        }
    });

    // ✅ Speichern bei Klick auf ✅
    const saveIcon = subtaskItem.querySelector(".save-subtask-icon");
    saveIcon.classList.remove("hidden");
    saveIcon.addEventListener("click", () => saveEditedSubtask(index, inputField.value));
}


/**
 * Speichert die geänderte Subtask und zeigt den Punkt wieder in der UI.
 * @param {number} index - Index der Subtask
 * @param {string} newText - Der neue Text der Subtask
 */
function saveEditedSubtask(index, newText) {
    if (!newText.trim()) return; // 🚫 Leere Eingabe ignorieren
    subtasksArray[index].text = newText.trim(); // ✅ Text ohne Punkt speichern
    renderSubtasks(); // 🔄 UI neu rendern (statt `setEditSubtasks`)
}


/**
 * Löscht eine Subtask aus `subtasksArray`.
 * @param {number} index - Index der Subtask
 */
function deleteSubtask(index) {
    subtasksArray.splice(index, 1); // Subtask entfernen
    setEditSubtasks(subtasksArray); // UI aktualisieren
}


function setEditAssignedContacts(contacts) {
    const container = document.getElementById("edit-selected-contacts-container");
    container.innerHTML = contacts.map(contact => {
        console.log(`🛠️ Setze Kontakt: ${contact.name} (${contact.avatar.initials})`);
        return `<div class="avatar-board-card" 
                style="background-color: ${contact.avatar.bgcolor};" 
                data-name="${contact.name}"> 
                    ${contact.avatar.initials}
                </div>`;
    }).join("");
    console.log("✅ Vorab ausgewählte Kontakte mit Namen:", contacts);
}


function getEditedAssignedContacts() {
    return Array.from(document.querySelectorAll("#edit-selected-contacts-container .avatar-board-card")).map(contactElement => {
        let initials = contactElement.textContent.trim();
        let bgcolor = contactElement.style.backgroundColor.startsWith("rgb")
            ? rgbToHex(contactElement.style.backgroundColor)
            : contactElement.style.backgroundColor;

        // 🔹 1. Versuche, den vollständigen Namen aus `data-name` zu holen
        let name = contactElement.getAttribute("data-name") || null;

        // 🔹 2. Falls der Name nicht gefunden wurde, in `allContacts` suchen
        if (!name || name.trim() === "") {
            if (allContacts.size > 0) {
                const foundContact = [...allContacts.values()].find(c => getInitials(c.name) === initials);
                name = foundContact ? foundContact.name : null;
            } else {
                console.warn("⚠️ `allContacts` ist leer. Kontakte wurden möglicherweise noch nicht geladen.");
            }
        }

        // 🔹 3. Falls kein Name gefunden wurde, Standardwert setzen
        if (!name) {
            name = "Unbekannter Nutzer";
            console.warn(`⚠️ Name für "${initials}" konnte nicht gefunden werden. Fallback: "${name}"`);
        }

        return {
            avatar: {
                bgcolor: bgcolor,
                initials: initials
            },
            name: name
        };
    });
}


/**
 * Wandelt eine RGB-Farbe in HEX um.
 * @param {string} rgb - Die RGB-Farbe im Format "rgb(r, g, b)".
 * @returns {string} Die HEX-Farbe im Format "#RRGGBB".
 */
function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return "#CCCCCC"; // Fallback-Farbe
    return `#${match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}


async function handleEditTaskSubmit(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    const form = event.target;
    const taskId = form.getAttribute("data-task-id");
    if (!taskId) {
        console.error("❌ Fehler: Keine Task-ID gefunden!");
        return;
    }
    await saveSelectedContactsToBackend(taskId); // Speichert die ausgewählten Kontakte
    await saveTaskChangesAndUpdateUI(event); // Speichert alle anderen Task-Änderungen
    closeContacts("edit-contacts-container", "edit-contacts-list"); // Dropdown schließen
}


async function saveSelectedContactsToBackend(taskId) {
    if (!taskId) {
        console.error("❌ Fehler: Keine Task-ID gefunden!");
        return;
    }
    const selectedContactsArray = getEditedAssignedContacts();
    const updatedTask = { assignedTo: selectedContactsArray.length > 0 ? selectedContactsArray : [] };
    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });
        console.log(`✅ Kontakte für Task ${taskId} erfolgreich gespeichert.`);
        await fetchTasks(); // UI aktualisieren
    } catch (error) {
        console.error("❌ Fehler beim Speichern der Kontakte:", error);
    }
}


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


//resetting the date by click on calendar-icon
function setupEditDateReset() {
    const dateInput = document.getElementById("edit-due-date");
    const calendarIcon = document.getElementById("edit-calendar-icon");
    if (!dateInput || !dateInput._flatpickr) return console.error("Edit date input or Flatpickr instance not found.");
    calendarIcon.addEventListener("click", function () {
        dateInput._flatpickr.clear();  // ✅ Clears the date
    });
}


function handleEditCalendarClick() {
    const calendarIcon = document.getElementById("edit-calendar-icon");
    const dateInput = document.getElementById("edit-due-date");
    if (!calendarIcon || !dateInput || !dateInput._flatpickr) return console.error("❌ Flatpickr or elements not initialized properly.");
    calendarIcon.addEventListener("click", () => {
        console.log("Calendar icon clicked!");
        dateInput._flatpickr.isOpen ? dateInput._flatpickr.close() : dateInput._flatpickr.open();
    });
}


//to set up flatpickr and its functionality
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


async function saveTaskChangesAndUpdateUI(event) {
    event.preventDefault();
    const form = event.target;
    const taskId = form.getAttribute("data-task-id");

    if (!taskId) {
        console.error("❌ Fehler: Keine Task-ID gefunden!");
        return;
    }

    // Daten aus UI holen
    const updatedTask = {
        title: document.getElementById("edit-task-title").value,
        description: document.getElementById("edit-task-description").value,
        dueDate: document.getElementById("edit-due-date").value,
        priority: getSelectedPriority(),
        assignedTo: getEditedAssignedContacts(), // Falls leer, soll ein leeres Array gespeichert werden
        subtasks: getEditedSubtasks().length > 0 ? getEditedSubtasks() : []
    };

    // 🔹 Falls `assignedTo` nicht existiert, erstelle es als leeres Array
    if (!updatedTask.assignedTo || updatedTask.assignedTo.length === 0) {
        updatedTask.assignedTo = [];
    }

    try {
        // 🔹 Änderungen in der Datenbank speichern
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });

        console.log(`✅ Aufgabe ${taskId} wurde erfolgreich aktualisiert.`);
        await fetchTasks();
        // 🔄 UI aktualisieren und Modal schließen
        await fetchTasks();
        closeEditTaskModal();
        closeTaskDetailModal();
        showEditConfirmation();
    } catch (error) {
        console.error("❌ Fehler beim Speichern der Änderungen:", error);
    }
}
