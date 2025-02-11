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



function setupDropdownToggle(dropdownBtn, dropdownContainer, dropdownList) {
  const defaultText = "Select a category"; // Ensure correct default text
  
  dropdownBtn.addEventListener("click", (e) => {
    e.preventDefault();
  
    const isOpen = dropdownContainer.classList.toggle("open");
    dropdownList.style.display = isOpen ? "block" : "none";
  
      // Update the icon: upwards when open, downwards when closed
    dropdownBtn.querySelector("img").src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
  });
}
  
function setupDropdownOptions(dropdownBtn, dropdownList, categoryInput) {
  const defaultText = "Select a category"; // Default text
  
  document.querySelectorAll(".dropdown-options li").forEach((option) => {
    option.addEventListener("click", function () {
      const selectedText = this.textContent;
      const selectedValue = this.getAttribute("data-value");
  
      // Preserve button styling and only update text
      dropdownBtn.innerHTML = `${selectedText} <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">`;
  
      categoryInput.value = selectedValue;
  
      // Close dropdown
      dropdownContainer.classList.remove("open");
      dropdownList.style.display = "none";
    });
  });
  
  // Reset to default when clicking on the selected option again
  dropdownBtn.addEventListener("click", (e) => {
    if (dropdownBtn.textContent.trim() !== defaultText && !dropdownContainer.classList.contains("open")) {
      dropdownBtn.innerHTML = `${defaultText} <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">`;
      categoryInput.value = "";
    }
  });
}

//Initialisiert Event Listener für das + Icon und das Inputfeld 
function setupAddSubtaskButton() {
  const addSubtaskBtn = document.querySelector(".add-subtask-icon");
  const inputField = document.getElementById("subtasks");

  if (addSubtaskBtn) {
    addSubtaskBtn.addEventListener("click", handleAddSubtaskClick);
  }

  if (inputField) {
    inputField.addEventListener("input", handleSubtaskInput);
  }
}

//wird aufgerufen, wenn auf das + icon geklickt wird
function handleAddSubtaskClick() {
  const inputField = document.getElementById("subtasks");
  if (inputField.value.trim()) {
    showSubtaskActions();
  }
}

//wird aufgerufen, wenn der User im Inputfeld etwas eingibt oder löscht
function handleSubtaskInput() {
  const inputField = document.getElementById("subtasks");
  const addSubtaskBtn = document.querySelector(".add-subtask-icon");

  if (inputField.value.trim()) {
    addSubtaskBtn.style.display = "none";
    showSubtaskActions();
  } else {
    addSubtaskBtn.style.display = "inline";
  }
}

function showSubtaskActions() {
  const inputField = document.getElementById("subtasks");
  let iconContainer = document.querySelector(".subtask-action");

  if (!iconContainer) {
    iconContainer = document.createElement("div");
    iconContainer.classList.add("subtask-action");

    const deleteIcon = createIcon("/assets/imgs/clear-subtask.png", "Clear Icon", "clear-icon", clearSubtask);
    const divider = document.createElement("div");
    divider.classList.add("divider");
    const checkIcon = createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", saveSubtask);

    iconContainer.append(deleteIcon, divider, checkIcon);
    inputField.parentElement.appendChild(iconContainer);
  }
}

function createIcon(src, alt, className, eventHandler) {
  const icon = document.createElement("img");
  icon.src = src;
  icon.alt = alt;
  icon.classList.add(className);
  icon.addEventListener("click", eventHandler);
  return icon;
}

function clearSubtask() {
  const inputField = document.getElementById("subtasks");
  const iconContainer = document.querySelector(".subtask-action");
  const addSubtaskBtn = document.querySelector(".add-subtask-icon");

  inputField.value = "";
  iconContainer?.remove();
  addSubtaskBtn.style.display = "inline";
}

//Funktion für die Icons im Listenelement der Subtasks
function createSubtaskListIcons() {
  const liActions = document.createElement("div");
  liActions.classList.add("li-actions");

  const editIcon = createIcon("/assets/imgs/edit.svg", "Edit Icon", "edit-icon", editSubtask);
  const divider = document.createElement("span");
  divider.classList.add("divider1");
  const deleteIcon = createIcon("/assets/imgs/delete-black.png", "Delete Icon", "delete-icon", deleteSubtask);
  

  liActions.append(editIcon, divider, deleteIcon);
  return liActions;
}

function saveSubtask() {
  const inputField = document.getElementById("subtasks");
  const subtaskList = document.getElementById("subtask-list");

  if (inputField.value.trim()) {
    const li = document.createElement("li");
    li.classList.add("subtask-item");

    const span = document.createElement("span");
    span.classList.add("subtask-text");
    span.textContent = `• ${inputField.value}`;

    const liActions = createSubtaskListIcons();
    li.appendChild(span);
    li.appendChild(liActions);
    subtaskList.appendChild(li);
  }
  console.log(document.querySelector(".li-actions"));

  clearSubtask();
}

function editSubtask(event) {
  const li = event.target.closest("li");
  if (!li) return;

  const span = li.querySelector(".subtask-text");
  const input = createEditInput(span.textContent.trim());
  const editContainer = createEditContainer(input, li, span);

  li.innerHTML = "";
  li.appendChild(editContainer);

  input.focus();
}

function createEditContainer(input, li, span) {
  const editContainer = document.createElement("div");

  
  editContainer.classList.add("edit-container");

  const newActions = createEditActions(li, span, input);

  editContainer.appendChild(input);
  editContainer.appendChild(newActions);

  return editContainer;
}

function createEditInput(text) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = text.replace(/^•\s*/, "");
  input.classList.add("edit-input");
  return input;
}

function createEditActions(li, span, input) {
  const saveIcon = createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", () => saveEdit(li, input));
  const divider = document.createElement("span");
  divider.classList.add("divider1");
  const cancelIcon = createIcon("/assets/imgs/delete-black.png", "Clear Icon", "clear-icon", () => cancelEdit(li, span, input));

  const newActions = document.createElement("div");
  newActions.classList.add("subtask-actions");
  newActions.append(cancelIcon, divider, saveIcon);  
  return newActions;
}

function saveEdit(li, input) {
  const span = document.createElement("span");
  span.classList.add("subtask-text");
  span.textContent = `• ${input.value.trim()}`;

  const liActions = createSubtaskListIcons(); // Fügt wieder die normalen Icons hinzu

  li.innerHTML = "";
  li.appendChild(span);
  li.appendChild(liActions);
}


function deleteSubtask(event) {
  const li = event.target.closest("li");
  if (li) li.remove();
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
  setupAddSubtaskButton(),
  clearTask();
 
}

window.onload = init;

//Clear-Logik: in der Prio ist das Medium markiert; 