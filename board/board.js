/**
 * Fetches tasks from the backend and processes them.
 * If tasks exist, it renders them and sets up drag-and-drop functionality.
 * Logs a warning if no tasks are found.
 * Logs an error if fetching fails.
 */
async function fetchTasks() {
    try {
        const data = await fetchTasksFromBackend();
        if (!data) return console.warn("⚠️ Keine Tasks in der Datenbank gefunden.");

        const tasks = processTasks(data);
        renderTasks(tasks);
        setupDragAndDrop();
    } catch (error) {
        console.error("❌ Fehler beim Laden der Tasks:", error);
    }
}


/**
 * Fetches task data from the backend.
 * @returns {Promise<Object>} A promise resolving to the task data.
 */
async function fetchTasksFromBackend() {
    const response = await fetch("https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks.json");
    return await response.json();
}


/**
 * Processes task data by converting it into an array of task objects.
 * Fixes `mainCategory` if it is incorrectly formatted.
 * @param {Object} data - The raw task data from the backend.
 * @returns {Array<Object>} An array of processed task objects.
 */
function processTasks(data) {
    return Object.keys(data).map(taskId => {
        let task = { id: taskId, ...data[taskId] };
        if (task.mainCategory && task.mainCategory.toLowerCase() === "to do") {
            task.mainCategory = "To do";
            updateMainCategoryInBackend(task.id, "To do");
        }
        return task;
    });
}


/**
 * Updates the main category of a task in the backend.
 * @param {string} taskId - The ID of the task.
 * @param {string} newCategory - The new main category to be assigned.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function updateMainCategoryInBackend(taskId, newCategory) {
    try {
        await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mainCategory: newCategory })
        });
        console.log(`✅ Task ${taskId} erfolgreich im Backend aktualisiert: mainCategory = "${newCategory}"`);
    } catch (error) {
        console.error(`❌ Fehler beim Aktualisieren der mainCategory für Task ${taskId}:`, error);
    }
}


/**
 * Renders tasks into their respective columns.
 * @param {Array<Object>} tasks - The list of task objects.
 */
function renderTasks(tasks) {
    const columnMap = getColumnMap();
    clearTaskColumns(columnMap);
    tasks.forEach(task => appendTaskToColumn(task, columnMap));
    setupDragAndDrop();
    initTaskCardClickEvents();
    updateNoTaskVisibility();
}


/**
 * Retrieves a mapping of task categories to their respective DOM elements.
 * @returns {Object} A mapping of category names to column elements.
 */
function getColumnMap() {
    return {
        "To do": document.querySelector("#to-do .column-body"),
        "In progress": document.querySelector("#in-progress .column-body"),
        "Await feedback": document.querySelector("#awaitFeedback .column-body"),
        "Done": document.querySelector("#done .column-body")
    };
}


/**
 * Clears task cards from columns while keeping the "no-task" element intact.
 * @param {Object} columnMap - A mapping of category names to column elements.
 */
function clearTaskColumns(columnMap) {
    Object.values(columnMap).forEach(column => {
        column.querySelectorAll(".task-card").forEach(task => task.remove());
    });
}


/**
 * Appends a task to the appropriate column.
 * @param {Object} task - The task object.
 * @param {Object} columnMap - A mapping of category names to column elements.
 */
function appendTaskToColumn(task, columnMap) {
    let category = task.mainCategory || "To do";
    const column = columnMap[category];
    if (!column) {
        console.warn(`⚠️ Keine passende Spalte für Kategorie: ${category}`);
        return;
    }
    const taskElement = createTaskElement(task);
    column.appendChild(taskElement);
}


/**
 * Creates a task element and returns it.
 * @param {Object} task - The task data.
 * @returns {HTMLElement} The generated task element.
 */
function createTaskElement(task) {
    let categoryColor = task.category === "User Story" ? "#0039fe" : "#1fd7c1";
    let totalSubtasks = task.subtasks ? task.subtasks.length : 0;
    let completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
    let progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    const avatarsHTML = getAvatarsHTML(task.assignedTo);
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card");
    taskDiv.setAttribute("data-id", task.id);
    taskDiv.innerHTML = taskCardTemplate(task, categoryColor, progressPercent, completedSubtasks, totalSubtasks, avatarsHTML);
    return taskDiv;
}


/**
 * Updates the visibility of the "No Tasks" message in each column.
 * If there are tasks in a column, the message is hidden. Otherwise, it is displayed.
 */
function updateNoTaskVisibility() {
    document.querySelectorAll(".column-body").forEach(column => {
        const noTaskDiv = column.querySelector(".no-task");
        const hasTasks = column.querySelector(".task-card") !== null;
        if (hasTasks) {
            noTaskDiv.classList.add("d-none");
        } else {
            noTaskDiv.classList.remove("d-none");
        }
    });
}


/**
 * Updates the task category in the database after being moved to a new column.
 * @param {HTMLElement} taskElement - The task DOM element.
 * @param {string} newColumnId - The ID of the new column.
 */
async function updateTaskCategory(taskElement, newColumnId) {
    console.log("New Column ID:", newColumnId);
    const taskId = taskElement.dataset.id;
    const newCategory = mapColumnIdToCategory(newColumnId);
    if (!taskId) return console.error("❌ Error: No Task ID found!");
    if (!newCategory) return console.error(`❌ Error: Invalid column (${newColumnId}) for Task ${taskId}.`);
    try {
        let taskData = await fetchTaskData(taskId);
        taskData.mainCategory = newCategory;
        await saveTaskCategory(taskId, newCategory);
        console.log(`✅ Task ${taskId} successfully moved to "${newCategory}" and saved.`);
    } catch (error) {
        console.error("❌ Error updating task category:", error);
    }
}


/**
 * Maps a column ID to its corresponding task category.
 * @param {string} columnId - The ID of the column.
 * @returns {string} The mapped category name.
 */
function mapColumnIdToCategory(columnId) {
    const columnMap = {
        "to-do": "To do",
        "to-do-body": "To do",
        "in-progress": "In progress",
        "in-progress-body": "In progress",
        "awaitFeedback": "Await feedback",
        "awaitFeedback-body": "Await feedback",
        "done": "Done",
        "done-body": "Done"
    };
    return columnMap[columnId] || "To do";  // Fallback auf "To do"
}


/**
 * Fetches task data from the database.
 * @param {string} taskId - The ID of the task.
 * @returns {Promise<Object>} The fetched task data.
 */
async function fetchTaskData(taskId) {
    const response = await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
    const data = await response.json();
    if (!data) throw new Error("❌ No task data found!");
    return data;
}


/**
 * Saves the updated task category in the database.
 * @param {string} taskId - The ID of the task.
 * @param {string} newCategory - The new category to be set.
 */
async function saveTaskCategory(taskId, newCategory) {
    await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mainCategory: newCategory })
    });
}


/**
 * Generates the HTML for displaying a task's subtasks.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} The generated HTML for subtasks.
 */
function generateSubtasks(task) {
    if (!task.subtasks || task.subtasks.length === 0) {
        return `<p>No subtasks available</p>`;
    }
    return generateSubtasksTemplate(task);
}


/**
 * Toggles the completion status of a subtask and updates the backend.
 * @param {string} taskId - The ID of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 */
async function toggleSubtask(taskId, subtaskIndex) {
    try {
        const task = await fetchTaskData(taskId);
        if (!task?.subtasks || subtaskIndex >= task.subtasks.length) return;
        task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
        updateSubtaskUI(taskId, task.subtasks);
        await saveSubtasks(taskId, task.subtasks);
    } catch (error) {
        console.error("Error updating subtask:", error);
    }
}


/**
 * Updates the UI elements related to subtasks.
 * @param {string} taskId - The ID of the task.
 * @param {Array} subtasks - The updated subtasks.
 */
function updateSubtaskUI(taskId, subtasks) {
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(st => st.completed).length;
    const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
    if (taskElement) {
        taskElement.querySelector(".subtask-bar-prog-blue").style.width = `${progressPercent}%`;
        taskElement.querySelector(".subtask-checked").textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}


/**
 * Saves the updated subtasks to the backend.
 * @param {string} taskId - The ID of the task.
 * @param {Array} subtasks - The updated subtasks array.
 */
async function saveSubtasks(taskId, subtasks) {
    await fetch(`https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtasks })
    });
}


/**
 * Updates the content of a task card in the UI.
 * @param {string} taskId - The ID of the task.
 * @param {Object} task - The updated task data.
 */
function updateTaskCard(taskId, task) {
    const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
    if (!taskElement) return console.warn(`⚠️ Task card for task ${taskId} not found.`);
    updateTaskText(taskElement, task);
    updateTaskProgress(taskElement, task.subtasks);
}


/**
 * Updates the task title and description in the UI.
 * @param {HTMLElement} taskElement - The task card DOM element.
 * @param {Object} task - The updated task data.
 */
function updateTaskText(taskElement, task) {
    taskElement.querySelector(".task-title").textContent = task.title;
    taskElement.querySelector(".task-description").textContent = task.description;
}


/**
 * Updates the task progress bar and subtask count in the UI.
 * @param {HTMLElement} taskElement - The task card DOM element.
 * @param {Array} subtasks - The updated subtasks array.
 */
function updateTaskProgress(taskElement, subtasks) {
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(st => st.completed).length;
    const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    const progressBar = taskElement.querySelector(".subtask-bar-prog-blue");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    const subtaskText = taskElement.querySelector(".subtask-checked");
    if (subtaskText) subtaskText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
}


/**
 * Initializes click events for task cards.
 * When a task card is clicked, it fetches the task data and opens the detail modal.
 */
function initTaskCardClickEvents() {
    document.querySelectorAll(".task-card").forEach(taskCard =>
        taskCard.addEventListener("click", async function () {
            const taskId = this.dataset.id;
            if (!taskId) return console.error("⚠️ Task ID fehlt!");
            const task = await fetchTaskById(taskId);
            if (task) openTaskDetailModal(task);
        })
    );
}


/**
 * Fetches a task by its ID and processes the data.
 * @param {string} taskId - The ID of the task.
 */
async function fetchTaskById(taskId) {
    try {
        const taskData = await fetchTaskData(taskId);
        const task = processTaskData(taskId, taskData);
        openTaskDetailModal(task);
    } catch (error) {
        console.error("❌ Error fetching task:", error);
    }
}


/**
 * Processes task data and ensures default values.
 * @param {string} taskId - The ID of the task.
 * @param {Object} taskData - The raw task data from the backend.
 * @returns {Object} The processed task object.
 */
function processTaskData(taskId, taskData) {
    if (!taskData) throw new Error("No task data found");
    return {
        id: taskId,
        title: taskData.title || "No title",
        description: taskData.description || "No description",
        category: taskData.category || "General",
        categoryColor: taskData.categoryColor || "#ccc",
        dueDate: taskData.dueDate || "No date",
        priority: taskData.priority || { text: "No priority", image: "" },
        assignedTo: Array.isArray(taskData.assignedTo) ? taskData.assignedTo.map(user => ({
            name: user.name || "Unknown user",
            avatar: user.avatar || { bgcolor: "#ccc", initials: "?" }
        })) : [],
        subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks.map(subtask => ({
            text: subtask.text || subtask,
            completed: subtask.completed || false
        })) : []
    };
}


/**
 * Initializes event listeners and fetches necessary data on page load.
 */
function init() {
    setupDragAndDrop();
    fetchTasks();
    initTaskDetailOverlay();
    initTaskCardClickEvents();
    setupCalendarIcon();
}