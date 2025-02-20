document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal-content');
    const closeBtn = document.querySelector(".close-btn");
    const overlay = document.querySelector(".overlay");

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };
});

function openAddTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");
  
    overlay.classList.remove("hidden");
    modal.classList.remove("show");    
    modal.classList.remove("hidden");  
  
    void modal.offsetHeight; // or modal.offsetWidth
  
    modal.classList.add("show");
  
    fetchAddTaskContent();
  }
  
  function closeModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");
  
    overlay.classList.add("hidden");
    modal.classList.remove("show");
  
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 400); 
  }

function closeAddTaskModal() {
    
}

function fetchAddTaskContent() {
    fetch("/addTask/addTaskContent.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("modal-body").innerHTML = data;

            const tempElement = document.createElement('div');
            tempElement.innerHTML = data;

            const scripts = tempElement.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            });
        })
        .catch(error => console.error('Error fetching addTaskContent.html:', error));
}



function toggleButtons(button) {
    const buttons = document.querySelectorAll('.btn-switch');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

function clearTask() {
    // Implement the clear task functionality
    console.log("Clear task function called");
}

function createTask(event) {
    event.preventDefault();
    // Implement the create task functionality
    console.log("Create task function called");
}
function findTask() {

}

function initBoard() {
    
}

