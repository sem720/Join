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
    
    await fetchContacts();
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

function clearTask(event) {
    event.stopPropagation();
    document.querySelector(".selected-contacts").innerHTML = "";
}













