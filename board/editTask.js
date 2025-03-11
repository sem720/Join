
// editTask.js - setEditPriority()
function setEditPriority(priority) {
    setTimeout(() => {
        if (!priority || !priority.text) {
            console.warn("⚠️ Keine gültige Priorität gefunden.");
            return;
        }

        const priorityText = priority.text.toLowerCase().trim(); // "urgent", "medium", "low"
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










function setEditSubtasks(subtasks) {
    const list = document.getElementById("edit-subtask-list");
    list.innerHTML = subtasks.map((subtask, index) =>
        `<li>
            <label for="edit-subtask-${index}">${subtask.text}</label>
        </li>`
    ).join("");
}


function setEditAssignedContacts(contacts) {
    const container = document.getElementById("edit-selected-contacts-container");
    container.innerHTML = contacts.map(contact =>
        `<div class="avatar-board-card" style="background-color: ${contact.avatar.bgcolor};">${contact.avatar.initials}</div>`
    ).join("");
}


function getEditedAssignedContacts() {
    return Array.from(document.querySelectorAll("#edit-selected-contacts-container .avatar-board-card")).map(contact => ({
        name: contact.textContent,
        avatar: { bgcolor: contact.style.backgroundColor, initials: contact.textContent }
    }));
}


function getEditedSubtasks() {
    return Array.from(document.querySelectorAll("#edit-subtask-list li")).map(li => ({
        text: li.querySelector("label").textContent,
        completed: li.querySelector("input").checked
    }));
}


function setAssignedContacts(contacts) {
    const container = document.getElementById("selected-contacts-container");
    container.innerHTML = contacts.map(contact =>
        `<div class="avatar-board-card" style="background-color: ${contact.avatar.bgcolor};">${contact.avatar.initials}</div>`
    ).join("");
}
// No selected code provided, so I'll generate a code snippet that can be inserted at the cursor position.

// Example of a function to handle errors in a more robust way
function handleError(error) {
    console.error("❌ Fehler:", error);
    // Additional error handling logic can be added here
}

// Example of a function to update the task card
function updateTaskCard(taskId, updatedTask) {
    // Logic to update the task card can be added here
    console.log(`✅ Task ${taskId} wurde erfolgreich aktualisiert.`);
}

// Example of a function to close the edit task modal
// function closeEditTaskModal() {
//     // Logic to close the edit task modal can be added here
//     console.log("✅ Edit-Modal geschlossen.");
// }

// Example of a function to get the selected priority
function getSelectedPriority() {
    // Logic to get the selected priority can be added here
    const priority = document.querySelector(".btn-switch.active");
    return priority ? priority.id : null;
}

function showEditConfirmation() {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.classList.add("task-edit-confirmation");
    confirmationDiv.innerText = "Task successfully updated";

    document.body.appendChild(confirmationDiv);

    // 📌 Animation starten
    setTimeout(() => {
        confirmationDiv.classList.add("show");
    }, 10);

    // 📌 Nach 2 Sekunden ausblenden
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

    // TT/MM/YYYY für Anzeige
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


//Please remove, if you don't need it, it just handles that the input stays black and not takes placeholder color
function editDateInput() {
    const dateInput = document.getElementById("edit-due-date");
    const calendarIcon = document.getElementById("edit-calendar-icon");
  
    if (!dateInput || !calendarIcon) return console.error("Edit date input or calendar icon not found.");
      
    dateInput.addEventListener("input", function () {
      if (dateInput.value) {
        dateInput.classList.add("has-value"); 
      } else {
        dateInput.classList.remove("has-value"); 
      }
    });
}


//attaching click to calendar icon
function setupEditCalendarIcon() {
    const dateInput = document.getElementById("edit-due-date");
    const calendarIcon = document.getElementById("edit-calendar-icon");
  
    if (!dateInput || !calendarIcon) return console.error("Edit date input or calendar icon not found.");
  
    calendarIcon.addEventListener("click", function () {
      if (!dateInput._flatpickr) return console.error("Flatpickr is not initialized on #edit-due-date.");
        
      // ✅ Toggle calendar: If open, close it; if closed, open it
      dateInput._flatpickr.isOpen ? dateInput._flatpickr.close() : dateInput._flatpickr.open();
    });
}
  

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
    
    // Initialize Flatpickr for edit due date
    flatpickr("#edit-due-date", {
        dateFormat: "d/m/Y",
        allowInput: true,
        placeholder: "dd/mm/yyyy"
    });

    handleEditCalendarClick();
    setupEditDateReset();
}












async function saveTaskChanges(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    const taskId = document.getElementById("edit-task-id")?.value;
    if (!taskId) {
        console.error("❌ Fehler: Keine Task-ID gefunden!");
        return;
    }

    const updatedTask = {
        title: document.getElementById("edit-task-title").value,
        description: document.getElementById("edit-task-description").value,
        dueDate: document.getElementById("edit-due-date").value,
        priority: getSelectedPriority(), // Priorität auslesen
        assignedTo: getEditedAssignedContacts(), // Kontakte auslesen
        subtasks: getEditedSubtasks() // Subtasks auslesen
    };

    try {
        // 🔹 Änderungen im Backend speichern
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });

        // 🔹 Änderungen auf der Task-Card sofort aktualisieren
        updateTaskCard(taskId, updatedTask);

        // 🔹 Edit-Modal schließen
        closeEditTaskModal();

        console.log(`✅ Task ${taskId} wurde erfolgreich aktualisiert.`);
    } catch (error) {
        console.error("❌ Fehler beim Speichern der Änderungen:", error);
    }
}


