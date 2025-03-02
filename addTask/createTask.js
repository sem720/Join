/** ================================
 *          TASK CREATION
 * ================================ */
function createTask(event) {
    event.preventDefault();
    let taskData = getTaskFormData();

    if (!validateTaskData(taskData)) return;

    saveTaskToFirebase(taskData)
        .then(() => handleTaskSuccess())
        .catch(error => console.error("❌ Fehler beim Speichern des Tasks: ", error));
}

function handleTaskCreation(event) {
    event.preventDefault(); 
  
    if (validateForm()) {
      alert("Task created!"); 
    }
  }

function handleTaskSuccess() {
    showTaskPopup();
    setTimeout(() => window.location.href = "/board/board.html", 1500);
}

/** ================================
 *        FORM DATA HANDLING
 * ================================ */
function getTaskFormData() {
    return {
        title: getValue("#task-name"),
        description: getValue("#description"),
        assignedTo: getSelectedContacts(),
        dueDate: getValue("#due-date"),
        priority: getSelectedPriority(),
        category: getSelectedCategory(),
        subtasks: getSubtasks()
    };
}

function getValue(selector) {
    return formatText(document.querySelector(selector)?.value.trim() || "");
}

function clearTask() {
    ["task-name", "description", "subtasks"].forEach(id => document.getElementById(id).value = "");
      
    resetDateInput(document.getElementById("due-date"));
    document.querySelector(".dropdown-btn").innerHTML = `Select task category <span class="icon-container"><img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon"></span>`;
    document.getElementById("selected-contacts-container").innerHTML = "";
  
    document.querySelectorAll(".error-message").forEach((error) => {error.style.display = "none";});
    document.querySelectorAll(".error").forEach((el) => {el.classList.remove("error");});
}
  

/** ================================
 *        TASK VALIDATION
 * ================================ */
function validateTaskData(taskData) {
    console.log("🛠 Validating task data:", taskData);
    let isValid = true;

    !taskData.title.trim() ? (showError("#task-name", "Title is required."), isValid = false) : clearError("#task-name");
    !taskData.dueDate.trim() ? (showError("#due-date", "Due Date is required."), isValid = false) : clearError("#due-date");
    !taskData.category.trim() ? (showError("#selected-category", "Category is required."), isValid = false) : clearError("#selected-category");

    console.log("Category Element Found:", document.getElementById("selected-category"));

    return isValid;
}

/** ================================
 *        TASK PRIORITY
 * ================================ */
function getSelectedPriority() {
    const priorityText = document.querySelector(".btn-switch.active")?.innerText.trim() || "Medium";
    const priorityImages = {
        "Low": "/assets/imgs/low.png",
        "Medium": "/assets/imgs/medium.png",
        "Urgent": "/assets/imgs/urgent.png"
    };

    return {
        text: priorityText,
        image: priorityImages[priorityText] || "/assets/imgs/medium.png"
    };
}

/** ================================
 *      CONTACT SELECTION
 * ================================ */
function getSelectedContacts() {
    return Array.from(document.querySelectorAll(".contact-checkbox:checked"))
        .map(checkbox => {
            const name = checkbox.dataset.contactName;
            const contact = allContacts.get(name);

            if (!contact) {
                console.warn(`⚠️ Kein Kontakt gefunden für ${name}`);
                return null;
            }

            return {
                name,
                avatar: generateAvatar(name, contact.bgcolor)
            };
        })
        .filter(contact => contact !== null);
}

function generateAvatar(name, bgcolor) {
    return {
        initials: getInitials(name),
        bgcolor
    };
}

/** ================================
 *      CATEGORY SELECTION
 * ================================ */
function getSelectedCategory() {
    const selectedInput = document.getElementById("selected-category");

    if (!selectedInput) {
        console.error("❌ Error: Could not find #selected-category input.");
        return "";
    }

    let category = selectedInput.value?.trim(); // Ensure it's a string

    if (!category) {
        console.warn("⚠️ No category selected!");
        return ""; // Prevent `undefined` errors
    }

    console.log("✅ getSelectedCategory() returning:", category);

    return category.replace("_", " ") // Convert "technical_task" → "Technical Task"
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


/** ================================
 *      SUBTASKS HANDLING
 * ================================ */
function getSubtasks() {
    return Array.from(document.querySelectorAll("#subtask-list li")).map(subtask => ({
        text: formatText(subtask.textContent),
        completed: false
    }));
}

/** ================================
 *      FIREBASE INTEGRATION
 * ================================ */
function saveTaskToFirebase(taskData) {
    return firebase.database().ref("tasks").push(taskData)
        .then(() => console.log("✅ Task erfolgreich gespeichert:", taskData))
        .catch(error => console.error("❌ Fehler beim Speichern des Tasks:", error));
}

/** ================================
 *      POPUP NOTIFICATION
 * ================================ */
function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}

  
  
  