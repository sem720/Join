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
    setupPriorityButtons();


    console.log("✅ Modal opened, priority buttons initialized.");
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


function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}


function setupPriorityButtons() {
    document.querySelectorAll(".modal .btn-switch").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".modal .btn-switch").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // ✅ Update the global activeButton
            activeButton = button;
            console.log("🔴 Updated activeButton:", activeButton);
        });
    });
}







