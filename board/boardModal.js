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
    const listId = button.getAttribute("data-list-id");
    renderContactsList(listId);
    setupAddSubtaskButton();
    document.querySelector(".dropdown-btn")?.classList.remove("error");
    init();
});


//function very important!!!!!!!!!!!!!!!!!!!!!!!!
function initOutsideClick() {
    const modal = document.getElementById("addTaskModal");
    const contactsContainer = document.getElementById("contacts-container");

    if (!modal || !contactsContainer) return;

    modal.addEventListener("click", (event) => handleOutsideClick(event, contactsContainer, ".assignment-btn"));
}

/**
 * Closes a container when clicking outside of it.
 * @param {Event} event - The click event.
 * @param {HTMLElement} container - The container to close.
 * @param {string} exceptionSelector - Selector for elements that should not trigger closing.
 */
function handleOutsideClick(event, container, exceptionSelector) {
    
    if (
        container.classList.contains("visible") &&
        !container.contains(event.target) &&
        !event.target.closest(exceptionSelector)
    ) {
        container.classList.add("hidden");
        container.classList.remove("visible");
        
        console.log("✅ Container closed due to outside click");
        updateDropdownIcon(false);

        if (container.id === "edit-contacts-container") updateDropdownIcon(false, document.querySelector("#toggle-contacts-btn img"));
    }
}


function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}




