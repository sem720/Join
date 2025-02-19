function openAddTaskModal() {
    document.getElementById("task-overlay").classList.remove("hidden");
    document.getElementById("add-task-modal").classList.remove("hidden");

    fetch("/addTask/addTaskContent.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("modal-body").innerHTML = html;
            
            window.init();
            window.initAddTaskContacts();
        })
        .catch(error => console.error("Error loading modal content:", error));
}

function closeModalWitchClick() {
    document.getElementById("close-modal").addEventListener("click", closeAddTaskModal);
}

function closeAddTaskModal() {
    document.getElementById("task-overlay").classList.add("hidden");
    document.getElementById("add-task-modal").classList.add("hidden");
}

function findTask() {

}

function initBoard() {
    openAddTaskModal(),
    closeModalWitchClick();

}