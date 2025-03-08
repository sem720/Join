function taskCardTemplate(task) {
    let categoryColor = task.category === "User Story" ? "#0039fe" : "#1fd7c1";

    let totalSubtasks = task.subtasks ? task.subtasks.length : 0;
    let completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
    let progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const avatarsHTML = task.assignedTo
        ? task.assignedTo.map(user =>
            `<div class="avatar-board-card" style="background-color: ${user.avatar.bgcolor};">${user.avatar.initials}</div>`
        ).join("")
        : "";

    return `
        <div class="task-category" style="background-color: ${categoryColor};">
            ${task.category || "No Category"}
        </div>
        <h3 class="task-title">${task.title || "No Title"}</h3>
        <p class="task-description">${task.description || "No Description"}</p>
        <div class="subtask-snackbar">
            <div class="subtask-bar-progress">
                <div class="subtask-bar-prog-blue" style="width: ${progressPercent}%;"></div>
            </div>
            <p class="subtask-checked">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>
        <div class="task-card-footer">
            <div class="task-card-avatar">${avatarsHTML}</div>
            <img src="${task.priority?.image || ''}" alt="${task.priority?.text || ''}" class="prio-icon">
        </div>
    `;
}


function generateSubtasksTemplate(task) {
    if (!task.subtasks || task.subtasks.length === 0) {
        return `<p>No subtasks available</p>`;
    }

    return task.subtasks.map((subtask, index) => `
        <div class="subtasks-content">
            <input type="checkbox" id="subtask-${task.id}-${index}" 
                ${subtask.completed ? "checked" : ""} 
                onchange="toggleSubtask('${task.id}', ${index})">
            <label for="subtask-${task.id}-${index}">${subtask.text}</label>
        </div>
    `).join("");
}


function taskDetailTemplate(task, subtasksHTML) {
    let categoryColor = task.category === "User Story" ? "#0039fe" : "#1fd7c1";

    return `
        <div class="task-detail-header">
            <span class="task-detail-category" style="background: ${categoryColor};">
                ${task.category}
            </span>
        </div>
        <h2 class="task-detail-title">${task.title}</h2>
        <p class="task-detail-content">${task.description}</p>
        <p><strong style="padding-right: 16px;">Due date:</strong> ${formatDate(task.dueDate)}</p>
        <p><strong style="padding-right: 16px;">Priority:</strong> ${task.priority.text} 
            <img src="${task.priority?.image || ''}" alt="${task.priority?.text || ''}" class="prio-icon">
        </p>
        <p style="padding-bottom: 0;"><strong>Assigned To:</strong></p>
        <ul>
            ${task.assignedTo.map(user => `
                <li style="display: flex; align-items: center; gap: 8px;">
                    <div class="avatar-board-card" style="background-color: ${user.avatar?.bgcolor || "#ccc"};">
                        ${user.avatar?.initials || "?"}
                    </div>
                    ${user.name}
                </li>
            `).join("")}
        </ul>
        <div class="task-detail-subtasks">
            <p><strong>Subtasks</strong></p>
            ${subtasksHTML}
        </div>
        <div class="task-detail-footer">
            <button onclick="deleteTask('${task.id}')" class="btn-delete">
                <img src="../assets/imgs/delete.svg" alt="" class="delete-icon">
                Delete
            </button>
            <div class="line"></div>
            <button onclick="openEditTaskModal('${task.id}')" class="btn-edit">
                <img src="../assets/imgs/edit.svg" alt="" class="edit-icon" style="width: 18px; height: 18px;">
                Edit
            </button>
        </div>
    `;
}


function editTaskTempl() {
    return `
    <button id="editTask-close-btn" class="editTask-close-btn" onclick="closeEditTaskModal()">
        &times;
    </button>

    <form class="edit-modal-container" onsubmit="saveTaskChanges(event)">
        <div class="form-content">
            <label for="edit-task-title">Title</label>
            <input id="edit-task-title" class="edit-input-board" type="text" placeholder="Enter a title" required />
        </div>

        <div class="form-content">
            <label for="edit-task-description">Description</label>
            <textarea id="edit-task-description" placeholder="Enter a Description"></textarea>
        </div>

        <div class="form-content">
            <label for="edit-due-date">Due Date</label>
            <input type="date" class="edit-input-board" id="edit-due-date" required />
        </div>

        <div class="form-content">
            <label>Priority</label>
            <div class="button-container">
                <button class="btn-switch" id="urgent" name="urgent" type="button" onclick="toggleButtons(this)">
                    Urgent 
                    <img src="/assets/imgs/urgent.png" alt="urgent-icon" />
                </button>
                <button class="btn-switch" id="medium" name="medium" type="button" onclick="toggleButtons(this)">
                    Medium 
                    <img src="/assets/imgs/medium.png" alt="medium-icon" />
                </button>
                <button class="btn-switch" id="low" name="low" type="button" onclick="toggleButtons(this)">
                    Low 
                    <img src="/assets/imgs/low.png" alt="low-icon" />
                </button>
            </div>
        </div>

        <div class="form-content">
            <label>Assigned to</label>
            <div class="edit-assignment-container">
                <button class="assignment-btn">
                    Select contacts to assign
                </button>
                <div id="edit-selected-contacts-container"></div>
            </div>
        </div>

        <div class="form-content">
            <label>Subtasks</label>
            <input type="text" class="edit-input-board" id="edit-subtasks" placeholder="Add new subtask" />
            <ul id="edit-subtask-list"></ul>
        </div>
    </form>

    <div class="edit-modal-footer">
        <button class="edit-save-btn btn-dark">
            OK
            <img src="/assets/imgs/check-white.png" alt="">
        </button>
    </div>
    `
}