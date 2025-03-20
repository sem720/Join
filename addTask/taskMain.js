/**
 * Initializes event listeners for the application.
 * Specifically, it adds an event listener to the "createTask" button that triggers task creation.
 */
function initEventListeners() {
    document.getElementById("createTask")?.addEventListener("click", handleTaskCreation);
}

/**
 * Initializes the application by setting up default values and event listeners.
 * - Sets default priority
 * - Initializes date input handling
 * - Sets up date reset functionality
 * - Sets up add subtask button functionality
 * - Initializes event listeners
 * - Clears task data
 */
function init() {
    initialDefaultPriority(),
    dateInput(),
    setupDateReset(),
    setupAddSubtaskButton(),
    initEventListeners(),
    setupCalendarIcon(),
    clearTask();
    initAddTaskContacts("contacts-list");
}