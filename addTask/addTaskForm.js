let activeButton = null; 
const selectedCategory = document.getElementById('selected-category');
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownList = document.getElementById('dropdown-list');
const dropdownContainer = document.querySelector('.dropdown-container');
const defaultText = "Select a category";

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

  console.log("🔄 Button Clicked:", clickedButton);
    console.log("📌 Button ID:", clickedButton.id);
    console.log("📌 Current Class List:", clickedButton.classList);
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

function dateInput() {
  const dateInput = document.getElementById("due-date");

  if (!dateInput) {
    console.error("Element with ID 'due-date' not found.");
    return; // Exit if the element is missing
  }

  dateInput.addEventListener("input", function () {
    if (dateInput.value) {
      dateInput.classList.add("has-value"); 
    } else {
      dateInput.classList.remove("has-value"); 
    }
  });
}

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

function toggleDropdown() {
  const isOpen = dropdownContainer.classList.toggle("open");
  dropdownList.style.display = isOpen ? "block" : "none";
  dropdownBtn.querySelector("img").src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;

  if (isOpen) {
    resetDropdown();
  }
}
  
function selectCategory(option) {
  const selectedText = option.textContent;
  const selectedValue = option.getAttribute("data-value");
  
  dropdownBtn.innerHTML = `
    ${selectedText}
    <span class="icon-container">
      <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">
    </span>
  `;

  selectedCategory.value = selectedValue;
  dropdownContainer.classList.remove("open");
  dropdownList.style.display = "none";
}

function resetDropdown() {
  dropdownBtn.innerHTML = `
    ${defaultText}
    <span class="icon-container">
      <img src="/assets/imgs/dropdown-upwards.png" alt="Dropdown Icon" id="dropdown-icon">
    </span>
  `;
  selectedCategory.value = "";
}

function setupAddSubtaskButton() {
  const addSubtaskBtn = document.querySelector(".add-subtask-icon");
  const inputField = document.getElementById("subtasks");

  console.log("🔎 Checking elements...");
  console.log("📌 addSubtaskBtn:", addSubtaskBtn);
  console.log("📌 inputField:", inputField);

  if (addSubtaskBtn) addSubtaskBtn.addEventListener("click", handleAddSubtaskClick);
  if (inputField) inputField.addEventListener("input", handleSubtaskInput);

  if (addSubtaskBtn) console.log("✅ Add Subtask Button Found");
  if (inputField) console.log("✅ Input Field Found");

}

function handleAddSubtaskClick() {
  const inputField = document.getElementById("subtasks");
  if (inputField.value.trim()) {
    showSubtaskActions();
  }
}

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

  console.log("📌 Creating subtask actions...");

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

  const liActions = createSubtaskListIcons(); 

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
  event.preventDefault(); 

  if (validateForm()) {
    alert("Task created!"); 
  }
}

function init() {
  initialDefaultPriority(),
  dateInput(),
  setupDateReset(),
  setupAddSubtaskButton(),
  initEventListeners(),
  clearTask();
}








