// @ts-nocheck

/**
 * Opens the task modal. If the screen width is below 670px, redirects to the addTask page.
 * @async
 * @param {string} category - The category for the task (default is "To do").
 */
async function openAddTaskModal(category = "To do") {
    if (window.innerWidth < 670) {
        return redirectToAddTaskPage(category);
    }
    setupModal(category);
}


/**
 * Redirects the user to the addTask page with the specified category.
 * @param {string} category - The selected task category.
 */
function redirectToAddTaskPage(category) {
    window.location.href = `/addTask/addTask.html?category=${encodeURIComponent(category)}`;
}


/**
 * Sets up and displays the task modal, initializing required components.
 * @async
 * @param {string} category - The selected task category.
 */
async function setupModal(category) {
    window.selectedTaskCategory = category;
    showTaskModal();
    await initializeTaskModal();
    initFormValidation();
    toggleModalVisibility(true);
    checkFormValidity();
    dateInput();
}


/**
 * Toggles the visibility of the task modal and overlay.
 * @param {boolean} isVisible - Whether to show or hide the modal.
 */
function toggleModalVisibility(isVisible) {
    const modal = document.getElementById("addTaskModal");
    const modalOverlay = document.querySelector(".modal-overlay");
    modal.style.display = isVisible ? "block" : "none";
    modalOverlay.classList.toggle("active", isVisible);
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
    initOutsideClickModal();
   
    initAddTaskContacts(listId); 
    clearError("#selected-category");
    setupContactButton();
    setupAssignmentButtons();
    updateDropdownIcon();
    dateInput();
   
    document.addEventListener("click", handleOutsideClick);
    selectedContacts.clear(); 
    updateSelectedContactsDisplay("selected-contacts-container"); 
}


/**
 * Closes the task modal with fade-out animation.
 */
function closeModal() {
    const modal = document.getElementById("addTaskModal");
    const overlay = document.getElementById("task-overlay");

    modal.classList.remove("show");
    setTimeout(() => {
        modal.classList.add("hidden");
        overlay.classList.remove("active");
    }, 400);

    updateSelectedContactsDisplay("selected-contacts-container");
    document.querySelectorAll(".contact-checkbox").forEach(checkbox => checkbox.checked = false);
    selectedContacts.clear();
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
function initOutsideClickModal() {
    const modal = document.getElementById("addTaskModal");
    const contactsContainer = document.getElementById("contacts-container");
    const dropdownOptions = document.querySelector(".dropdown-options");

    if (!modal || !contactsContainer || !dropdownOptions) return  console.warn("[initOutsideClick] missing element:", { modal, contactsContainer, dropdownOptions });

    const button = document.querySelector(".assignment-btn");
    const dropdownButton = document.querySelector(".dropdown-btn");
    const dropdownIcon = button?.querySelector("img");

    modal.addEventListener("click", (event) => {
        handleOutsideClickModal(event, contactsContainer, ".assignment-btn", dropdownIcon);
        handleOutsideClickModal(event, dropdownContainer, ".dropdown-btn", dropdownIcon, true);
    });
}


/**
 * Handles clicks outside of a given container to close it.
 * @param {Event} event - The click event.
 * @param {HTMLElement} container - The container to close.
 * @param {string} exceptionSelector - Selector for elements that should not trigger closing.
 */
function handleOutsideClickModal(event, container, exceptionSelector, dropdownIcon, isDisplayBlock = false) {
    console.log('Event target:', event.target);
    console.log('Container:', container);
    console.log('Exception selector:', exceptionSelector);
    console.log('Dropdown icon:', dropdownIcon);

    if (isDisplayBlock) {
        if (!container || container.style.display !== "block") return;
    } else {
        if (!container || !container.classList.contains("visible")) return;
    }

    if (!container.contains(event.target) && !event.target.closest(exceptionSelector)) {
        console.log('Closing container');
        closeDropdownContainer(container, isDisplayBlock);
        resetDropdownIcon(container, dropdownIcon);
    }
}


/**
 * Closes a dropdown container by setting display to none or adding hidden class.
 * @param {HTMLElement} container - The dropdown container.
 * @param {boolean} isDisplayBlock - Whether to use display block/none or visible/hidden.
 */
function closeDropdownContainer(container, isDisplayBlock = false) {
    if (isDisplayBlock) {
        container.style.display = "none";
    } else {
        container.classList.add("hidden");
        container.classList.remove("visible");
    }
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
    selectedContacts.clear(); 

    document.querySelectorAll(".contact-checkbox:checked").forEach((checkbox) => {
        const name = checkbox.getAttribute("data-contact-name");
        const contact = allContacts.get(name);
        if (contact) selectedContacts.add(contact);
    });

    updateSelectedContactsDisplay("selected-contacts-container"); 
}



