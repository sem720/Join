
function setEditPriority(priority) {
    setTimeout(() => { // 🕒 Warten, bis das Modal vollständig geladen ist
        if (!priority || !priority.text) {
            console.warn("⚠️ Keine gültige Priorität gefunden. Kein Button wird gesetzt.");
            return;
        }

        let priorityText = priority.text.toLowerCase().trim(); // "urgent", "medium", "low"

        console.log(`🔄 Setze Priorität: ${priorityText}`); // Debugging

        // Alle Buttons zurücksetzen
        document.querySelectorAll(".btn-switch").forEach(btn => {
            btn.classList.remove("active");
            btn.style.backgroundColor = ""; // Standard-Hintergrundfarbe entfernen
            btn.style.color = "#000"; // Standard-Textfarbe setzen
        });

        // Finde den passenden Button
        const button = document.getElementById(priorityText);
        if (button) {
            console.log(`✅ Button "${priorityText}" gefunden, setze active-Klasse.`);

            button.classList.add("active"); // Setzt den Button als aktiv
            button.setAttribute("data-active", "true"); // Sicherstellen, dass kein anderes Skript es entfernt

            // 🟢 Hintergrundfarbe & Textfarbe setzen
            switch (priorityText) {
                case "urgent":
                    button.style.backgroundColor = "#ff3b30"; // Rot für Urgent
                    button.style.color = "#fff"; // Weiße Schrift
                    break;
                case "medium":
                    button.style.backgroundColor = "#ffcc00"; // Gelb für Medium
                    button.style.color = "#000"; // Schwarze Schrift
                    break;
                case "low":
                    button.style.backgroundColor = "#34c759"; // Grün für Low
                    button.style.color = "#fff"; // Weiße Schrift
                    break;
                default:
                    console.warn(`⚠️ Unbekannte Priorität: ${priorityText}`);
            }

            // 💡 Sicherstellen, dass die Klasse nicht verloren geht
            setTimeout(() => {
                if (!button.classList.contains("active")) {
                    console.warn(`⚠️ Klasse 'active' wurde entfernt! Erneutes Setzen für ${priorityText}.`);
                    button.classList.add("active");
                }
            }, 200);
        } else {
            console.warn(`⚠️ Kein Button für Priorität "${priorityText}" gefunden.`);
        }

        // 🔹 Prüfen, ob `.active` gesetzt wurde
        console.log("🔎 CSS-Klasse `active` vorhanden:", button?.classList.contains("active"));
        console.log("🔎 Button-Styles:", button?.style.backgroundColor, button?.style.color);
    }, 100); // ⏳ 100ms Warten, damit das HTML sicher geladen ist
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
function closeEditTaskModal() {
    // Logic to close the edit task modal can be added here
    console.log("✅ Edit-Modal geschlossen.");
}

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
