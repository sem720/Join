/**
 * Returns the initials of a given name. If the name is not provided, returns "??".
 * The initials are derived from the first letter of each part of the name (split by spaces).
 * 
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials of the name or "??" if no name is provided.
 */
function getInitials(name) {
    if (!name) return "??";  // 

    const parts = name.split(" ");
    return parts.map(part => part[0]).join("").toUpperCase();
}

/**
 * Formats a text string by removing leading numbers, bullet points, and underscores,
 * and capitalizing the first letter of each word.
 * 
 * @param {string} text - The text to be formatted.
 * @returns {string} The formatted text with extra spaces removed and each word capitalized.
 */
function formatText(text) {
    return text
        .trim()
        .replace(/^\d+\.\s*|\*|\•|\-/g, "")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .split(" ") 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(" "); 
}

/**
 * Capitalizes the first letter of each word in a given name.
 * 
 * @param {string} name - The name to capitalize.
 * @returns {string} The name with each word capitalized.
 */
function capitalizeName(name) {
    return name
        .toLowerCase() 
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(" ");
}

/**
 * Creates a new HTML element with an optional class and inner text.
 * 
 * @param {string} tag - The type of the HTML element to create (e.g., "div", "span").
 * @param {string} [className=""] - An optional class to add to the element.
 * @param {string} [text=""] - The optional inner text to set for the element.
 * @returns {HTMLElement} The newly created element.
 */
function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (text) element.innerText = text;
    return element;
}

/**
 * Creates an avatar element for a contact with the initials and background color.
 * 
 * @param {string} name - The name of the contact, used to generate initials.
 * @param {string} bgcolor - The background color for the avatar.
 * @returns {HTMLElement} The avatar element.
 */
function createAvatar(name, bgcolor) {
    const avatar = createElement("div", "avatar", getInitials(name));
    avatar.style.backgroundColor = bgcolor;
    avatar.dataset.name = name; 
    return avatar;
}

/**
 * Creates a checkbox input element for selecting a contact.
 * 
 * @param {string} name - The name of the contact, used as a data attribute.
 * @param {string} avatar - The avatar of the contact, used as a data attribute.
 * @returns {HTMLElement} The checkbox input element.
 */
function createCheckboxElement(name, avatar) {
    const checkbox = createElement("input", "contact-checkbox");
    checkbox.type = "checkbox";
    checkbox.dataset.contactName = name;
    checkbox.dataset.contactAvatar = avatar;

    
    return checkbox;
}


function createImageElement() {
    const img = createElement("img", "checkbox-image");
    img.src = "/assets/imgs/check-mark.png"; // Default image (unchecked state)
    img.alt = "Checkbox image";
    img.classList.add("checkbox-image-small");
    img.style.display = "none";
    return img;
}


/**
 * Displays an error message next to the input field identified by the selector.
 * Highlights the field and shows the error message.
 * 
 * @param {string} selector - The CSS selector identifying the field to display the error for.
 * @param {string} message - The error message to display.
 */
function showError(selector, message) {
    let field = document.querySelector(selector);
    if (!field) return;

    let errorMsg = document.querySelector(`.error-message[data-error-for="${field.id}"]`);
    errorMsg && (errorMsg.textContent = message, errorMsg.style.display = "block");

    const elementToHighlight = selector === "#selected-category" ? document.querySelector(".dropdown-btn") : field;
    elementToHighlight.classList.add("error");

    field.addEventListener("input", () => clearError(selector)); // For text inputs
    field.addEventListener("change", () => clearError(selector));
}

/**
 * Clears the error message and removes the error class from the input field identified by the selector.
 * 
 * @param {string} selector - The CSS selector identifying the field to clear the error from.
 */
function clearError(selector) {
    let field = document.querySelector(selector);
    if (!field) return;

    let errorMsg = document.querySelector(`.error-message[data-error-for="${field.id}"]`);
    errorMsg?.classList.contains("error-message") && (errorMsg.style.display = "none");

    const elementToHighlight = selector === "#selected-category" ? document.querySelector(".dropdown-btn") : field;
    elementToHighlight.classList.remove("error");
}

/**
 * Resets the value of a date input field and removes the 'has-value' class.
 * 
 * @param {HTMLInputElement} input - The date input element to reset.
 */
function resetDateInput(input) {
    input.value = '';
    input.classList.remove('has-value');
}

function toggleCheckboxVisibility(checkbox, img, isChecked) {
    img.style.display = isChecked ? "block" : "none";
    checkbox.style.display = isChecked ? "none" : "block";
}


function uncheckCheckbox(checkbox, img, name) {
    checkbox.checked = false;
    img.style.display = "none";
    checkbox.style.display = "block";

    // Manually trigger the change event
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);

    console.log(`Checkbox changed: ${name}, unchecked: ${checkbox.checked}`);
    console.log(`Avatar hidden for ${name} after unchecking.`);
}


/**
 * Helper function to create an element with optional text content.
 */
function createElement(tag, className, text = "") {
    const element = document.createElement(tag);
    element.classList.add(className);
    if (text) element.textContent = text;
    return element;
}