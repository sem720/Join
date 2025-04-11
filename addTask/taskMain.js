/**
 * Checks if required form fields are filled and enables/disables the submit button accordingly.
 */
function checkFormValidity() {
    const taskName = document.getElementById("task-name");
    const dueDate = document.getElementById("due-date");
    const category = document.getElementById("selected-category");
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
    document.getElementById("selected-category")?.addEventListener("input", checkFormValidity);
}


/**
 * Disables the "create" button (for form validation or other checks).
 */
function disableCreateButton() {
    document.querySelector(".create-btn").setAttribute("disabled", "true");
}


/**
 * Initializes event listeners for the application.
 */
function initEventListeners() {
    document.getElementById("createTask")?.addEventListener("click", handleTaskCreation);
}


/**
 * Initializes the application by setting up default values, UI components, and event listeners.
 * This function ensures that all necessary elements and features of the application are properly initialized.
 *
 * Steps performed:
 * 1. Sets the default priority for tasks.
 * 2. Initializes the date input field and its associated calendar functionality.
 * 3. Sets up functionality to reset the date input field.
 * 4. Configures the "Add Subtask" button and its related actions.
 * 5. Initializes general event listeners for user interactions.
 * 6. Sets up the calendar icon to open the date picker.
 * 7. Clears the task input fields and subtask list.
 * 8. Initializes the "Add Task Contacts" feature for assigning tasks to contacts.
 * 9. Validates the form by setting up error handling for required fields.
 * 10. Renders the contacts list for task assignments.
 * 11. Sets up validation logic for required input fields.
 */
function init() {
    initialDefaultPriority();
    dateInput();
    setupDateReset();
    setupAddSubtaskButton();
    initEventListeners();
    setupCalendarIcon();
    clearTask();
    clearSubtask();
    initAddTaskContacts("contacts-list");
    initFormValidation(); 
    renderContactsList("contacts-list");
    setupFieldValidation();
}