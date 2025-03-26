/**
 * Checks if required form fields are filled and enables/disables the submit button accordingly.
 */
function checkFormValidity() {
    const taskName = document.getElementById("task-name");
    const dueDate = document.getElementById("due-date");
    const category = document.getElementById("category-container");
    const submitBtn = document.querySelector(".create-btn");

    if (taskName.value.trim() !== "" && dueDate.value.trim() !== "" && category.value.trim() !== "") {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}


/**
 * Initializes event listeners for form validation.
 */
function initFormValidation() {
    document.getElementById("task-name")?.addEventListener("input", checkFormValidity);
    document.getElementById("due-date")?.addEventListener("input", checkFormValidity);
    document.getElementById("category-container")?.addEventListener("input", checkFormValidity);
}


/**
 * Initializes event listeners for the application.
 */
function initEventListeners() {
    document.getElementById("createTask")?.addEventListener("click", handleTaskCreation);
}


/**
 * Initializes the application by setting up default values and event listeners.
 */
function init() {
    initialDefaultPriority();
    dateInput();
    setupDateReset();
    setupAddSubtaskButton();
    initEventListeners();
    setupCalendarIcon();
    clearTask();
    initAddTaskContacts("contacts-list");
    initFormValidation(); 
}
