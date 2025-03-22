/**
 * Opens the task modal. If the screen width is below 670px, redirects to the addTask page.
 * @async
 */
async function openAddTaskModal() {
    showTaskModal(); 
    await initializeTaskModal(); 

    if (window.innerWidth < 670) {
        window.location.href = "/addTask/addTask.html"; 
        return; 
    }

    document.getElementById("modal").style.display = "block"; 
}


/**
 * Displays the task modal with overlay and animations.
 */
function showTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("active");
    modal.classList.remove("hidden");

    setTimeout(() => modal.classList.add("show"), 10);

    modal.addEventListener("click", (event) => event.stopPropagation());
}


/**
 * Initializes the task modal by setting up contacts, priorities, event listeners, and clearing errors.
 * @async
 */
async function initializeTaskModal() {
    const listId = "contacts-list"; 

    await fetchAndRenderContacts(listId);
    initialDefaultPriority();
    initOutsideClick();
    initAddTaskContacts(listId);
    clearError("#selected-category");
    setupAssignmentButtons();
    resetSelectedContacts();
}


/**
 * Closes the task modal with fade-out animation.
 */
function closeModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    modal.classList.remove("show");

    setTimeout(() => {
        modal.classList.add("hidden");
        overlay.classList.remove("active");
    }, 400);
}


/**
 * Sets up the contact button to render the contacts list.
 */
function setupContactButton() {
    const button = document.querySelector(".assignment-btn");
    if (button) {
        const listId = button.getAttribute("data-list-id");
        renderContactsList(listId);
    }
}


/**
 * Initializes outside click detection for the modal and contact dropdown.
 */
function initOutsideClick() {
    const modal = document.getElementById("addTaskModal");
    const contactsContainer = document.getElementById("contacts-container");

    if (!modal || !contactsContainer) return;

    const button = document.querySelector(".assignment-btn"); 
    const dropdownIcon = button?.querySelector("img");

    modal.addEventListener("click", (event) => {
        handleOutsideClick(event, contactsContainer, ".assignment-btn", dropdownIcon);
    });
}


/**
 * Handles clicks outside of a given container to close it.
 * @param {Event} event - The click event.
 * @param {HTMLElement} container - The container to close.
 * @param {string} exceptionSelector - Selector for elements that should not trigger closing.
 */
function handleOutsideClick(event, container, exceptionSelector) {
    if (!container || !container.classList.contains("visible")) return;

    if (!container.contains(event.target) && !event.target.closest(exceptionSelector)) {
        closeDropdownContainer(container);
        resetDropdownIcon(container);
    }
}


/**
 * Closes a dropdown container by adding the hidden class.
 * @param {HTMLElement} container - The dropdown container.
 */
function closeDropdownContainer(container) {
    container.classList.add("hidden");
    container.classList.remove("visible");
}


/**
 * Resets the dropdown icon to its default state.
 * @param {HTMLElement} container - The dropdown container.
 */
function resetDropdownIcon(container) {
    let dropdownIcon;

    if (container.id === "edit-contacts-container") {
        dropdownIcon = document.querySelector("#toggle-contacts-btn img");
    } else {
        const button = document.querySelector(".assignment-btn");
        dropdownIcon = button?.querySelector("img");
    }

    if (dropdownIcon) updateDropdownIcon(false, dropdownIcon);
}


/**
 * Displays a popup message confirming that the task was added, then redirects to the board.
 */
function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}


/**
 * Resets the selected contacts by clearing the set and updating it with checked contacts.
 */
function resetSelectedContacts() {
    selectedContacts.clear(); // Clear old selections

    document.querySelectorAll(".contact-checkbox:checked").forEach((checkbox) => {
        const name = checkbox.getAttribute("data-contact-name");
        const contact = allContacts.get(name);
        if (contact) selectedContacts.add(contact);
    });
}
