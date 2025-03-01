function setupAddSubtaskButton() {
    const addSubtaskBtn = document.querySelector(".add-subtask-icon");
    const inputField = document.getElementById("subtasks");
  
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
  