async function openAddTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("active");
    modal.classList.remove("hidden");

    setTimeout(() => {
        modal.classList.add("show");
    }, 10);

    await fetchContacts();
    renderContactsList();
    setupAddSubtaskButton();
    initialDefaultPriority();
    init();
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
    const modal = document.getElementById("addTaskModal");
    console.log("Modal Element:", modal);
    if (modal) {
        console.log("✅ Modal is found, ready to apply classList changes.");
    } else {
        console.error("❌ Modal not found! Check if the script runs too early.");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    fetchTasks();
    initTaskDetailOverlay();
});


function openEditTaskModal() {
    const overlay = document.getElementById("edit-task-overlay");
    const modal = document.getElementById("editTaskModal");

    overlay.classList.remove("hidden");
    overlay.classList.add("active");
    modal.classList.remove("closing-to-right");

    // Klick innerhalb des Modals verhindern, dass es sich schließt
    modal.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Klick auf das Overlay soll das Modal schließen
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeEditModal();
        }
    });
}

function closeEditModal() {
    const overlay = document.getElementById("edit-task-overlay");
    const modal = document.getElementById("editTaskModal");

    overlay.classList.remove("active");
    modal.classList.add("closing-to-right");

    setTimeout(() => {
        overlay.classList.add("hidden");
        modal.classList.remove("closing-to-right");
    }, 500);
}

// Sicherstellen, dass der Schließen-Button funktioniert
document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.getElementById("edit-close-modal");
    if (closeButton) {
        closeButton.addEventListener("click", closeEditModal);
    }
});



