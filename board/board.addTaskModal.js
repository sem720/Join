function openAddTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("active");

    modal.classList.remove("hidden");  
    void modal.offsetHeight; // or modal.offsetWidth
    modal.classList.add("show");
    
    fetchAddTaskContent();   
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


function fetchAddTaskContent() {
    fetch("/board/addTaskContent.html")
        .then(response => response.text()) // Holt den HTML-Code als Text
        .then(data => {
            document.getElementById("modal-body").innerHTML = data;
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



