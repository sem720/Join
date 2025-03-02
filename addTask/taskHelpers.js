function getInitials(name) {
    if (!name) return "??";  // 

    const parts = name.split(" ");
    return parts.map(part => part[0]).join("").toUpperCase();
}

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

function capitalizeName(name) {
    return name
        .toLowerCase() 
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(" ");
}

function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (text) element.innerText = text;
    return element;
}

function createAvatar(name, bgcolor) {
    const avatar = createElement("div", "avatar", getInitials(name));
    avatar.style.backgroundColor = bgcolor;
    return avatar;
}

function createCheckbox(name, avatar) {
    const checkbox = createElement("input", "contact-checkbox");
    checkbox.type = "checkbox";

    checkbox.dataset.contactName = name;
    checkbox.dataset.contactAvatar = avatar;
    checkbox.addEventListener("change", () => toggleContactSelection(name, checkbox.checked));
    return checkbox;
}

function showError(selector, message) {
    let field = document.querySelector(selector);
    if (!field) return;

    let errorMsg = field.nextElementSibling; // Die Fehlermeldung kommt direkt nach dem Eingabefeld
    errorMsg?.classList.contains("error-message") && (errorMsg.textContent = message, errorMsg.style.display = "block");
 
    const elementToHighlight = selector === "#selected-category" ? document.querySelector(".dropdown-btn") : field;
    elementToHighlight.classList.add("error");

    field.addEventListener("input", () => clearError(selector)); // For text inputs
    field.addEventListener("change", () => clearError(selector));
}

function clearError(selector) {
    let field = document.querySelector(selector);
    if (!field) return;

    let errorMsg = field.nextElementSibling; // Die Fehlermeldung kommt direkt nach dem Eingabefeld
    errorMsg?.classList.contains("error-message") && (errorMsg.style.display = "none");

    (selector === "#selected-category" ? document.querySelector(".dropdown-btn") : field).classList.remove("error");
}

function resetDateInput(input) {
    input.value = '';
    input.classList.remove('has-value');
  }