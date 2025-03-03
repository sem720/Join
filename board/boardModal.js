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
    dateInput();
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


