async function openAddTaskModal() {
    showTaskModal(); // Handles UI visibility
    await initializeTaskModal(); // Handles task-related setup
}

/**
 * Handles opening the modal and overlay with animations.
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
 * Initializes all necessary functionalities for the task modal.
 */
async function initializeTaskModal() {
    const listId = "contacts-list"; 
    console.log("✅ listId in initializeTaskModal:", listId);

    await fetchAndRenderContacts(listId);
    initialDefaultPriority();
    initOutsideClick();
    initAddTaskContacts(listId);
    clearError("#selected-category");
    setupAssignmentButtons();
    resetSelectedContacts();
    console.log("✅ Task modal initialized.");
}


function closeModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    modal.classList.remove("show");

    setTimeout(() => {
        modal.classList.add("hidden");
        overlay.classList.remove("active");
    }, 400);
}


document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".assignment-btn");
    if (button) {
        const listId = button.getAttribute("data-list-id");
        renderContactsList(listId);
    }
    setupAddSubtaskButton();
});


//function very important!!!!!!!!!!!!!!!!!!!!!!!!
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
 * Closes a container when clicking outside of it.
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
 * Closes the dropdown container.
 * @param {HTMLElement} container - The dropdown container.
 */
function closeDropdownContainer(container) {
    container.classList.add("hidden");
    container.classList.remove("visible");
    console.log("✅ Container closed due to outside click");
}

/**
 * Resets the dropdown icon based on the container.
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


function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}


function resetSelectedContacts() {
    selectedContacts.clear(); // Clear old selections

    document.querySelectorAll(".contact-checkbox:checked").forEach((checkbox) => {
        const name = checkbox.getAttribute("data-contact-name");
        const contact = allContacts.get(name);
        if (contact) selectedContacts.add(contact);
    });

    console.log("✅ Selected contacts reset:", [...selectedContacts]);
}
