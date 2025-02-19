let activeButton = null; 
let dropdownBtn, dropdownList, dropdownIcon, categoryInput;
let dropdownContainer = document.querySelector(".dropdown-container");

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

//Funktionen für das Datumsfeld
function dateInput() {
  const dateInput = document.getElementById("due-date");

  dateInput.addEventListener("input", function () {
    if (dateInput.value) {
      dateInput.classList.add("has-value"); 
    } else {
      dateInput.classList.remove("has-value"); 
    }
  });
}

//Zurücksetzen wenn auf kalender-icon geklickt wird
function setupDateReset() {
  const dateInput = document.getElementById("due-date");
  if (dateInput) {
    dateInput.addEventListener('click', (event) => handleDateReset(event, dateInput));
  }
}

function handleDateReset(event, input) {
  if (iconClicked(event, input)) {
     setTimeout(() => resetDateInput(input), 0);
  }
}

function iconClicked(event, input) {
  const rect = input.getBoundingClientRect();
  return event.clientX > rect.right - 30;
}

function resetDateInput(input) {
  input.value = '';
  input.classList.remove('has-value');
}

function initialDefaultPriority() {
  const mediumButton = document.getElementById('medium');

  if (mediumButton) {
      activateButton(mediumButton);
      activeButton = mediumButton;
  }
}

function setupDropdownToggle(dropdownBtn, dropdownList) {
  dropdownBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = dropdownContainer.classList.toggle("open");
    dropdownList.style.display = isOpen ? "block" : "none";
    dropdownBtn.querySelector("img").src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
  });
}

function toggleDropdown(dropdownContainer, dropdownList) {
  dropdownContainer.classList.toggle("open");
  dropdownList.style.display = dropdownContainer.classList.contains("open") ? "block" : "none";
}
  
function setupDropdownOptions(dropdownBtn, dropdownList, categoryInput) {
  const defaultText = "Select a category"; // Default text
  
  document.querySelectorAll(".dropdown-options li").forEach((option) => {
    option.addEventListener("click", function () {
      const selectedText = this.textContent;
      const selectedValue = this.getAttribute("data-value");

      dropdownBtn.innerHTML = `${selectedText} 
                              <span class="icon-container">
                                  <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">
                              </span>
                            `; 
      document.getElementById("selected-category").value = selectedValue;
      dropdownContainer.classList.remove("open");
      dropdownList.style.display = "none";
    });
  });
  
  // Reset to default when clicking on the selected option again
  dropdownBtn.addEventListener("click", () => {
    if (dropdownBtn.textContent.trim() !== defaultText && !dropdownContainer.classList.contains("open")) {
      dropdownBtn.innerHTML = `${defaultText} 
                                 <span class="icon-container">
                                  <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">
                              </span>
                             `; 
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

function createSubtaskIcons() {
  const deleteIcon = createIcon("/assets/imgs/clear-subtask.png", "Clear Icon", "clear-icon", clearSubtask);
  const divider = document.createElement("div");
  divider.classList.add("divider");
  const checkIcon = createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", saveSubtask);
  
  return [deleteIcon, divider, checkIcon];
}

function showSubtaskActions() {
  const inputField = document.getElementById("subtasks");
  let iconContainer = document.querySelector(".subtask-action");

  if (!iconContainer) {
    iconContainer = document.createElement("div");
    iconContainer.classList.add("subtask-action");

    const icons = createSubtaskIcons();
    iconContainer.append(...icons);
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

function createSubtaskElement(value) {
  const li = document.createElement("li");
  li.classList.add("subtask-item");

  const span = document.createElement("span");
  span.classList.add("subtask-text");
  span.textContent = `• ${value}`;

  const liActions = createSubtaskListIcons();
  li.appendChild(span);
  li.appendChild(liActions);
  return li;
}

function saveSubtask() {
  const inputField = document.getElementById("subtasks");
  const subtaskList = document.getElementById("subtask-list");

  if (inputField.value.trim()) {
    const li = createSubtaskElement(inputField.value);
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
  const editActions = createEditActions(input, li, span);

  li.innerHTML = "";
  li.appendChild(input);
  li.appendChild(editActions);

  input.focus();
}

function createEditInput(text) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = text.replace(/^•\s*/, "");
  input.classList.add("edit-input");
  return input;
}

function createEditActions(input, li, span) {
  const saveIcon = createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", () => saveEdit(li, input));
  const divider = document.createElement("span");
  divider.classList.add("divider1");
  const cancelIcon = createIcon("/assets/imgs/delete-black.png", "Clear Icon", "clear-icon", () => cancelEdit(li, span, input));

  const newActions = document.createElement("div");
  newActions.classList.add("subtask-actions");
  newActions.append(cancelIcon, divider, saveIcon);  
  return newActions;
}

function cancelEdit(li, span, input) {
  input.value = "";
  li.remove();
  span.remove();
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
  ["task-name", "description", "subtasks"].forEach(id => document.getElementById(id).value = "");
    
  // Datum zurücksetzen
  resetDateInput(document.getElementById("due-date"));
  document.getElementById("dropdown-btn").innerHTML = `Select task category <span class="icon-container"><img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon"></span>`;
  document.getElementById("selected-contacts-container").innerHTML = "";

  document.querySelectorAll(".error-message").forEach((error) => {error.style.display = "none";});
  document.querySelectorAll(".error").forEach((el) => {el.classList.remove("error");});
}

function initEventListeners() {
  document.getElementById("createTask")?.addEventListener("click", handleTaskCreation);
}

function handleTaskCreation(event) {
  event.preventDefault(); // Verhindert, dass das Formular abgeschickt wird

  if (validateForm()) {
    alert("Task created!"); 
  }
}

function init() {
  dropdownBtn = document.getElementById("dropdown-btn");
  dropdownList = document.getElementById("dropdown-list");
  categoryInput = document.getElementById("category");
  
  initialDefaultPriority(),
  dateInput(),
  setupDateReset(),
  setupDropdownOptions(dropdownBtn, dropdownList, categoryInput),
  setupDropdownToggle(dropdownBtn, dropdownList),
  setupAddSubtaskButton(),
  initEventListeners(),
  clearTask();
}






