//Die Logik ist etwas lange, ich habe heute eine kürzere Version erarbeitet, die ich noch implementieren muss;
let activeButton = null; 
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownContainer = document.querySelector(".dropdown-container");
const dropdownList = document.getElementById("dropdown-list");
const dropdownIcon = document.getElementById("dropdown-icon");
const categoryInput = document.getElementById("category");

function toggleButtons(clickedButton) {
  if (activeButton) {
       deactivateButton(activeButton);   
  }

  if (activeButton === clickedButton) {
      activeButton = null;
      return;
  }
  
  activateButton(clickedButton);
  activeButton = clickedButton;
}

function activateButton(button) {
  button.classList.add('active');
  changeButtonStyle(button, 'add');
  changeImageStyle(button, 'add');
}

function deactivateButton(button) {
  button.classList.remove('active');
  changeButtonStyle(button, 'remove');
  changeImageStyle(button, 'remove');
}


function changeButtonStyle(button, action) {
  const colorMap = {
      'urgent': '#FF3D00',
      'medium': '#FFA800',
      'low': '#7AE229'
  };

  const color = colorMap[button.id] || '';
  
  if (action === 'add') {
      button.style.backgroundColor = color;
      button.style.color = 'white';
  } else if (action === 'remove') {
      button.style.backgroundColor = '';
      button.style.color = '';
  }
}

function changeImageStyle(button, action) {
  const img = button.querySelector('img');
  
  if (action === 'add') {
      img.style.filter = 'brightness(0) invert(1)'; 
  } else if (action === 'remove') {
      img.style.filter = ''; 
  }
}

function initialDefaultPriority() {
  const mediumButton = document.getElementById('medium');

  if (mediumButton) {
      activateButton(mediumButton);
      activeButton = mediumButton;
  }
}

//Logik für Inputfelder die required sind: Schritte 1-4:
  //Schritt 1: Prüfen ob das Inputfeld leer ist, wenn der User submitted oder das Inputfeld verlässt
  //Schritt 2: Eine rote Border hinzufügen, wenn das Inputfeld leer ist
  //Schritt 3: Den Text in rot anzeigen (This field is required)
  //Schritt 4: Die rote Border und den Text entfernen, wenn der User das Inputfeld ausfüllt

  //in CSS: code für error border und error message erstellen

  //div mit Error Message auf display none setzen und dann anzeigen, wenn das Inputfeld leer ist



function setupDropdownToggle(btn, container, list) {
  const defaultText = btn.innerHTML;
  
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = container.classList.toggle("open");
    list.style.display = isOpen ? "block" : "none";
  
    btn.querySelector("img").src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
  
    if (!isOpen) {
      btn.innerHTML = defaultText;
      document.getElementById("category").value = "";
    }
  });
}

function setupDropdownOptions(dropdownBtn, dropdownList, categoryInput) {
  document.querySelectorAll('.dropdown-options li').forEach(option => { 
      option.addEventListener('click', function () {
        const selectedText = this.textContent;
        const selectedValue = this.getAttribute('data-value');

        dropdownBtn.innerHTML = `${selectedText} <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">`;
        categoryInput.value = selectedValue;

        dropdownList.style.display = "none";
       
      });
  });
}

function addSubtask() {
  const inputField = document.getElementById("subtasks");
  const subtaskText = inputField.value.trim();

  if (subtaskText === "") {
      return;
  }
}

function clearTask() {
  document.getElementById("task-name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("subtasks").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("dropdown-btn").innerHTML = `Select task category <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">`;
  //document.getElementById("category").value = "";
  //document.getElementById("assignmment-btn").innerHTML = ``
  
}

function init() {
  const dropdownBtn = document.getElementById("dropdown-btn");
  const dropdownList = document.getElementById("dropdown-list");
  const categoryInput = document.getElementById("category");

  initialDefaultPriority(),
  setupDropdownOptions(dropdownBtn, dropdownList, categoryInput),
  setupDropdownToggle(dropdownBtn, dropdownContainer, dropdownList, dropdownIcon),
  clearTask();
}

window.onload = init;

//Clear-Logik: in der Prio ist das Medium markiert; 