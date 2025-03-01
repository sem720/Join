function initEventListeners() {
    document.getElementById("createTask")?.addEventListener("click", handleTaskCreation);
}

function init() {
    initialDefaultPriority(),
    dateInput(),
    setupDateReset(),
    setupAddSubtaskButton(),
    initEventListeners(),
    clearTask();
}