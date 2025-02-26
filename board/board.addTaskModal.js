document.addEventListener('DOMContentLoaded', initializeEventListeners);

function initializeEventListeners() {
    const closeBtn = document.querySelector(".close-btn");
    const overlay = document.querySelector(".overlay");

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    const categoryContainer = document.getElementById("category-container");
    if (categoryContainer) {
        categoryContainer.addEventListener("click", function (event) {
            if (event.target.id === "dropdown-btn") {
                event.stopPropagation(); // Prevent modal from closing
            }
        });
    }
}

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
  
function closeModal(event) {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    if (modal.contains(event.target) && !event.target.classList.contains('close-btn')) {
        return;
    }
  
    overlay.classList.add("hidden");
    modal.classList.remove("show");
  
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 400); 
}

function fetchAddTaskContent() {
    fetch("/addTask/addTaskContent.html")
        .then(response => response.text()) // Holt den HTML-Code als Text
        .then(data => {
            document.getElementById("modal-body").innerHTML = data;
            console.log("Fetched modal content:", data);
            executeScriptsFromHTML(data);
        })
        .catch(error => console.error("Error fetching add task content:", error));
}

function executeScriptsFromHTML(html) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html; // Load HTML into a temporary element

    const scripts = tempElement.querySelectorAll('script'); // Get all <script> elements

    if (!scripts.length) {
        console.warn("No scripts found in modal HTML.");
        return;
    }

    scripts.forEach(script => {
        const newScript = document.createElement('script');

        if (script.src) {
            newScript.src = script.src;
            newScript.async = false;
        } else {
            newScript.textContent = script.textContent;
        }

        document.body.appendChild(newScript);
    });

    console.log("Scripts executed successfully.");
}



