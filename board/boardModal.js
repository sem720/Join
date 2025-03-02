function openAddTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("overlay", "active");
    overlay.classList.remove("closing");
    // modal.classList.remove("closing-to-right");

    modal.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}


function closeModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("closing");
    modal.classList.add("closing-to-right");

    setTimeout(() => {
        overlay.classList.remove("overlay", "active", "closing");
        modal.classList.remove("closing-to-right");
    }, 500);
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
