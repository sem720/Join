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


let touchStartX = 0;
let touchStartY = 0;
let currentColumn = null;


/**
 * Initializes drag-and-drop functionality for both mouse and touch interactions.
 * Adds event listeners to task cards and column bodies.
 */
function setupDragAndDrop() {
    document.querySelectorAll(".task-card").forEach(task => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", handleDragStart);
        task.addEventListener("dragend", handleDragEnd);
        task.addEventListener("touchstart", handleTouchStart);
        task.addEventListener("touchmove", handleTouchMove);
        task.addEventListener("touchend", handleTouchEnd);
    });
    document.querySelectorAll(".column-body").forEach(column => {
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleDrop);
        column.addEventListener("dragleave", handleDragLeave);
    });
}


/**
 * Handles the touch start event for mobile drag-and-drop.
 * Stores the initial touch position and applies a visual effect to the dragged task.
 *
 * @param {TouchEvent} event - The touch event triggered when a user starts touching a task.
 */
function handleTouchStart(event) {
    draggedTask = event.target.closest(".task-card");
    if (!draggedTask) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    draggedTask.style.opacity = "0.5";
}


/**
 * Handles the touch move event, moving the task visually as the user drags it.
 * Determines which column the task is currently over.
 * @param {TouchEvent} event - The touch event triggered when the user moves their finger.
 */
function handleTouchMove(event) {
    if (!draggedTask) return;
    const touch = event.touches[0];
    updateTaskPosition(touch);
    highlightCurrentColumn(touch);
    event.preventDefault();
}


/**
 * Updates the position of the dragged task.
 */
function updateTaskPosition(touch) {
    draggedTask.style.position = "absolute";
    draggedTask.style.left = `${touch.clientX - 150}px`;
    draggedTask.style.top = `${touch.clientY - 150}px`;
}


/**
 * Highlights the column under the touch position.
 */
function highlightCurrentColumn(touch) {
    document.querySelectorAll(".column-body").forEach(column => {
        const rect = column.getBoundingClientRect();
        column.classList.toggle("drag-over",
            touch.clientX > rect.left && touch.clientX < rect.right &&
            touch.clientY > rect.top && touch.clientY < rect.bottom
        );
        if (column.classList.contains("drag-over")) currentColumn = column;
    });
}


/**
 * Handles the touch end event, placing the task in the new column if applicable.
 * Updates the task category and resets its position.
 */
function handleTouchEnd() {
    if (!draggedTask || !currentColumn) {
        resetTaskPosition();
        return;
    }
    currentColumn.appendChild(draggedTask);
    const newColumnId = currentColumn.parentElement.id;
    updateTaskCategory(draggedTask, newColumnId);
    updateNoTaskVisibility();
    resetTaskPosition();
}


/**
 * Resets the task's position and removes temporary drag styling.
 * Ensures the task appears back in a normal state after dragging.
 */
function resetTaskPosition() {
    if (draggedTask) {
        draggedTask.style.position = "relative";
        draggedTask.style.left = "0px";
        draggedTask.style.top = "0px";
        draggedTask.style.opacity = "1";
    }
    document.querySelectorAll(".column-body").forEach(column => column.classList.remove("drag-over"));
    draggedTask = null;
    currentColumn = null;
}