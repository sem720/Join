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
 * Displays an error message next to the input field identified by the selector.
 * Highlights the field and shows the error message.
 * 
 * @param {string} selector - The CSS selector identifying the field to display the error for.
 * @param {string} message - The error message to display.
 */
function showError(selector, message) {
    const field = document.querySelector(selector);
    if (!field) return;

    const errorMsg = document.querySelector(`.error-message[data-error-for="${field.id}"]`);
    errorMsg && (errorMsg.textContent = message, errorMsg.style.display = "block");

    const elementToHighlight = selector === "#category" ? document.querySelector(".dropdown-container") : field;
    elementToHighlight.classList.add("error");
}


/**
 * Clears the error message and removes the error class from the input field identified by the selector.
 * 
 * @param {string} selector - The CSS selector identifying the field to clear the error from.
 */
function clearError(selector) {
    const field = document.querySelector(selector);
    if (!field) return;

    const errorMsg = document.querySelector(`.error-message[data-error-for="${field.id}"]`);
    errorMsg?.classList.contains("error-message") && (errorMsg.style.display = "none");

    const elementToHighlight = selector === "#category" ? document.querySelector(".dropdown-container") : field;
    elementToHighlight.classList.remove("error");
}


/**
 * Attaches a listener to show an error message when the field is interacted with.
 * Highlights the field and shows the error message if it is empty.
 * 
 * @param {string} selector - The CSS selector identifying the field.
 * @param {string} message - The error message to display.
 */
function attachErrorOnInteraction(selector, message) {
    const field = document.querySelector(selector);
    if (!field) return;

    field.addEventListener("focus", () => field.value.trim() === "" && showError(selector, message));
    field.addEventListener("blur", () => field.value.trim() === "" ? showError(selector, message) : clearError(selector));
}


/**
 * Validiert ein Feld anhand seines Werts. Zeigt oder entfernt Fehler.
 */
function validateField(selector, message) {
    const field = document.querySelector(selector);
    if (!field) return;
  
    let value = field.value?.trim() ?? "";

    if (selector === "#category") {
        const dropdownText = document.querySelector(".dropdown-btn")?.textContent.trim();
        value = dropdownText === "Select task category" ? "" : dropdownText;
    }
  
    if (!value) {
      showError(selector, message);
      return false;
    } else {
      clearError(selector);
      return true;
    }
}


/**
 * Initialisiert Event Listener für Validierung bei User-Interaktion.
 */
function setupFieldValidation() {
    const fields = [
      { selector: "#task-name", message: "Please choose a title." },
      { selector: "#due-date", message: "Please select a date." },
      { selector: "#category", message: "Please select a category." },
    ];
  
    fields.forEach(({ selector, message }) => {
      const field = document.querySelector(selector);
      if (!field) return;
  
      const eventType = selector === "#category" ? "change" : "blur";
      field.addEventListener(eventType, () => {
        validateField(selector, message);
      });
    });
}

