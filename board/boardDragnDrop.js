/**
 * Sets up drag-and-drop functionality for task elements and columns.
 * Enables draggable tasks and adds event listeners for drag events.
 */
function setupDragAndDrop() {
    document.querySelectorAll(".task-card").forEach(task => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", handleDragStart);
        task.addEventListener("dragend", handleDragEnd);
    });
    document.querySelectorAll(".column-body").forEach(column => {
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleDrop);
        column.addEventListener("dragleave", handleDragLeave);
    });
}


/**
 * Stores the currently dragged task element.
 * @type {HTMLElement | null}
 */
let draggedTask = null;

/**
 * Handles the drag start event.
 * Sets the dragged task and applies a visual effect.
 * @param {DragEvent} event - The drag start event.
 */
function handleDragStart(event) {
    draggedTask = event.target;
    event.target.style.opacity = "0.5";
    event.dataTransfer.effectAllowed = "move";
}


/**
 * Handles the drag end event.
 * Resets the dragged task and removes the visual effect.
 * @param {DragEvent} event - The drag end event.
 */
function handleDragEnd(event) {
    event.target.style.opacity = "1";
    draggedTask = null;
}


/**
 * Handles the drag over event.
 * Prevents default behavior to allow dropping.
 * @param {DragEvent} event - The drag over event.
 */
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
}


/**
 * Handles the drag leave event.
 * Removes the visual drag-over effect.
 * @param {DragEvent} event - The drag leave event.
 */
function handleDragLeave(event) {
    event.currentTarget.classList.remove("drag-over");
}


/**
 * Handles the drop event.
 * Moves the dragged task to a new column and updates its category.
 * @param {DragEvent} event - The drop event.
 */
function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");
    if (draggedTask) {
        const newColumn = event.target.closest(".column-body");
        const newColumnId = newColumn.parentElement.id;
        console.log("newColumnId:", newColumnId);
        newColumn.appendChild(draggedTask);
        updateTaskCategory(draggedTask, newColumnId);
        updateNoTaskVisibility();
    }
}