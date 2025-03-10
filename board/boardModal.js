async function openAddTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("active");
    modal.classList.remove("hidden");

    setTimeout(() => {
        modal.classList.add("show");
    }, 10);

    modal.addEventListener("click", (event) => {
        event.stopPropagation();
    });
    
    await fetchAndRenderContacts();
    initOutsideClick();
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
    renderContactsList();
    setupAddSubtaskButton();
    initialDefaultPriority();
    init();

});


function initOutsideClick() {
    const modal = document.getElementById("addTaskModal");
    const contactsContainer = document.getElementById("contacts-container");
    const assignmentButton = document.getElementById("assignment-btn");

    modal.addEventListener("click", (event) => {
        if (!contactsContainer.contains(event.target) && !assignmentButton.contains(event.target)) {
            closeContacts();
            updateDropdownIcon(false);
        }
    });
}




