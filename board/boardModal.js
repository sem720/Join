function openAddTaskModal() {
    document.getElementById("task-overlay").classList.add("active");
    document.getElementById("addTaskModal").classList.remove("hidden");
    document.getElementById("addTaskModal").classList.add("show");  
    document.getElementById("close-modal").removeAttribute("disabled");

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




