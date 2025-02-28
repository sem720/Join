function openAddTaskModal() {
    document.getElementById("task-overlay").classList.add("active");
    document.getElementById("addTaskModal").classList.remove("hidden");
    document.getElementById("addTaskModal").classList.add("show");  
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




