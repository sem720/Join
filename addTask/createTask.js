/** ================================
 *          TASK CREATION
 * ================================ */
function createTask(event) {
    event.preventDefault();
    let taskData = getTaskFormData();

    console.log("📤 Task Data Before Saving:", taskData); // Check full object
    console.log("🟡 Task Priority:", taskData?.priority?.priorityText); // Check priority safely

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
        priority: getValidPriority(), // ✅ Moved logic to a separate function
        category: getSelectedCategory(),
        subtasks: getTaskSubtasks(),
        mainCategory: getMainCategory()
    };
}

// ✅ This function ensures priority is always an object
function getValidPriority() {
    let priority = getSelectedPriority();

    if (typeof priority !== "object") {
        console.error("🚨 Priority was converted to a string! Fixing...");
        priority = { priorityText: priority, priorityImage: "/assets/imgs/medium.png" };
    }

    console.log("🟡 Final Priority Object:", priority); // ✅ Debugging
    return priority;
}


function getMainCategory() {
    return "To do";
}


function getValue(selector) {
    return formatText(document.querySelector(selector)?.value.trim() || "");
}


function clearTask() {
    const selectedContacts = new Set();

    ["task-name", "description", "subtasks"].forEach(id => document.getElementById(id).value = "");
    resetDateInput(document.getElementById("due-date"));

    document.querySelector(".dropdown-btn").innerHTML = `Select task category <span class="icon-container"><img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon"></span>`;
    document.getElementById("selected-contacts-container").innerHTML = "";
    selectedContacts.clear();
    
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

    return isValid;
}

/** ================================
 *        TASK PRIORITY
 * ================================ */
function getSelectedPriority() {
    console.log("🔍 activeButton:", activeButton);

    if (!activeButton) {
        console.warn("⚠️ No active button found, returning default priority.");
        return { priorityText: "Medium", priorityImage: "/assets/imgs/medium.png" };
    }

    const priority = {
        priorityText: activeButton.innerText.trim(), 
        priorityImage: getPriorityImage(activeButton.id) 
    };

    console.log("✅ getSelectedPriority() returning:", priority); // Check what it returns
    return priority;
}


function getPriorityImage(priority) {
    const priorityImages = {
        "low": "/assets/imgs/low.png",
        "medium": "/assets/imgs/medium.png",
        "urgent": "/assets/imgs/urgent.png"
    };
    return priorityImages[priority] || "/assets/imgs/medium.png";
}


/** ================================
 *      CONTACT SELECTION
 * ================================ */
function getSelectedContacts() {
    return Array.from(document.querySelectorAll(".contact-checkbox:checked"))
        .map(checkbox => {
            const name = checkbox.dataset.contactName;
            const contact = allContacts.get(name);
            return contact ? { name, avatar: generateAvatar(name, contact.bgcolor) } : (console.warn(`⚠️ Kein Kontakt gefunden für ${name}`), null);
        })
        .filter(contact => contact);
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
    if (!selectedInput) return console.error("❌ Error: Could not find #selected-category input.") || "";
       
    let category = selectedInput.value?.trim(); 

    if (!category) return console.log("⚠️ No category selected!") || "";
    
    console.log("✅ getSelectedCategory() returning:", category);

    return category.replace("_", " ") // Convert "technical_task" → "Technical Task"
                   .split(" ")
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                   .join(" ");
}


/** ================================
 *      SUBTASKS HANDLING
 * ================================ */
function getTaskSubtasks() {
    console.log("Gefundene Subtasks:", document.querySelectorAll("#subtask-list li"));

    return Array.from(document.querySelectorAll(".subtask-item")).map(subtask => ({
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


  
  