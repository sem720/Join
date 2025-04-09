// @ts-nocheck

/**
 * Reference to the assignment button DOM element.
 */
let assignmentButton;

/**
 * Reference to the contacts container DOM element.
 */
let contactsContainer;

/**
 * Reference to the dropdown icon DOM element.
 */
const icon = document.getElementById("dropdown-icon");

/**
 * Reference to the selected contacts container DOM element.
 */
const selectedContactsContainer = document.getElementById("selected-contacts-container");


/**
 * Initializes the task contact management by setting up the necessary DOM elements
 * and fetching the contacts data. It also adds a listener for outside keydown events.
 */
function initAddTaskContacts(listId) {
    contactsContainer = document.getElementById('contacts-container');
    assignmentButton = document.getElementById('assignment-btn');
    subtasksInput = document.getElementById('subtasks');

    fetchAndRenderContacts(listId);
    setupAssignmentButtons(); 

    document.addEventListener("keydown", handleKeydownOutsideAssignment);

    setupOutsideClickListener();
}


/**
 * Handles keydown events when the focus is outside the assignment button or contact field.
 * Prevents opening the contacts list when Enter is pressed.
 * 
 * @param {KeyboardEvent} event - The keydown event triggered by pressing a key.
 */
function handleKeydownOutsideAssignment(event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
}


/**
 * Toggles the visibility of the contacts container. It opens the contacts list if it's closed
 * and closes it if it's open.
 * 
 * @param {MouseEvent} event - The click event triggered when the user clicks the toggle button.
 */

function toggleContacts(event, containerId, listId) {
    event.preventDefault();

    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);
    const button = event.target.closest(".assignment-btn"); 
    const dropdownIcon = button?.querySelector("img"); 

    if (!contactsContainer || !contactsList) return;

    const isOpen = contactsContainer.classList.toggle("visible");
    contactsContainer.classList.toggle("hidden", !isOpen);

    updateDropdownIcon(isOpen, dropdownIcon); 
}


/**
 * Manages the outside click event listener. If enabled, the listener will close the contacts
 * list when a click occurs outside of the assignment container.
 * 
 * @param {boolean} enable - Determines whether the outside click listener should be enabled or disabled.
 */

function setupOutsideClickListener() {
    document.addEventListener("click", handleOutsideClick);
}


/**
 * Handles outside click to close the dropdown options and contacts-container when clicked outside.
 *
 * @param {Event} event - The click event.
 */
function handleOutsideClick(event) {
    const dropdownMenu = document.querySelector(".dropdown-options"); 
    const contactsMenu = document.getElementById("contacts-container");
    const dropdownIcon = document.querySelector("#dropdown-btn img");

    if (shouldCloseDropdownMenu(dropdownMenu, event)) {
        closeDropdownMenuAndResetIcon(dropdownMenu, dropdownIcon);
    }

    if (shouldCloseDropdown(contactsMenu, event)) {
        closeContactsMenuAndResetState(contactsMenu);
    }
}


/**
 * Determines whether the dropdown menu should be closed based on the event target.
 * 
 * @param {HTMLElement} dropdownMenu - The dropdown menu element.
 * @param {Event} event - The event triggered by the outside click.
 * @returns {boolean} - Whether the dropdown menu should be closed.
 */
function shouldCloseDropdownMenu(dropdownMenu, event) {
    return dropdownMenu && dropdownMenu.style.display === "block" && 
           !dropdownMenu.contains(event.target) && 
           !event.target.closest("#dropdown-btn");
}


/**
 * Closes the dropdown menu and updates the dropdown icon.
 * 
 * @param {HTMLElement} dropdownMenu - The dropdown menu element.
 * @param {HTMLElement} dropdownIcon - The dropdown icon element.
 */
function closeDropdownMenuAndResetIcon(dropdownMenu, dropdownIcon) {
    dropdownMenu.style.display = "none";
    updateDropdownIcon(false, dropdownIcon);
}


/**
 * Closes the contacts menu and resets its state.
 * 
 * @param {HTMLElement} contactsMenu - The contacts menu element.
 */
function closeContactsMenuAndResetState(contactsMenu) {
    closeDropdownMenu(contactsMenu);
    resetDropdownState();
    closeContacts("edit-contacts-container", "edit-contacts-list", "edit-selected-contacts-container");
}


/**
 * Checks if the dropdown menu should be closed based on the event target.
 * 
 * @param {HTMLElement} menu - The dropdown menu container.
 * @param {Event} event - The click event.
 * @returns {boolean} - True if the dropdown should be closed, false otherwise.
 */
function shouldCloseDropdown(menu, event) {
    return menu && menu.classList.contains("visible") && 
           !menu.contains(event.target) && 
           !event.target.closest(".assignment-btn");
}


/**
 * Closes the dropdown menu by hiding it.
 * 
 * @param {HTMLElement} menu - The dropdown menu container.
 */
function closeDropdownMenu(menu) {
    menu.classList.add("hidden");
    menu.classList.remove("visible");
}


/**
 * Resets the dropdown button icon state.
 */
function resetDropdownState() {
    const button = document.querySelector(".assignment-btn");
    const dropdownIcon = button?.querySelector("img");
    updateDropdownIcon(false, dropdownIcon);
}


/**
 * Opens the contacts list by adding the "visible" class and removing the "hidden" class.
 * It also updates the dropdown icon and manages outside click behavior.
 * 
 * @param {string} containerId - The ID of the contacts container.
 * @param {string} listId - The ID of the contacts list.
 * @param {string} selectedContainerId - The ID of the selected contacts container.
 */
function openContacts(containerId, listId, selectedContainerId) {
    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);

    contactsContainer.classList.add("visible");
    contactsContainer.classList.remove("hidden");
    contactsList.classList.add("visible");
    contactsList.classList.remove("hidden");

    updateDropdownIcon(true);
    updateSelectedContactsDisplay(selectedContainerId);

    fetchAndRenderContacts(listId);
}


/**
 * Closes the contacts list by adding the "hidden" class and removing the "visible" class.
 * It also updates the dropdown icon and disables outside click behavior.
 * 
 * @param {string} containerId - The ID of the contacts container.
 * @param {string} listId - The ID of the contacts list.
 * @param {string} [selectedContainerId=null] - The ID of the selected contacts container (optional).
 */
function closeContacts(containerId, listId, selectedContainerId = null) {
    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);

    if (!contactsContainer || !contactsList) return;

    contactsContainer.classList.add("hidden");
    contactsContainer.classList.remove("visible");
    contactsList.classList.add("hidden");
    contactsList.classList.remove("visible");

    if (selectedContainerId) updateSelectedContactsDisplay(selectedContainerId);
    
    updateDropdownIcon(false);
}


/**
 * Creates and appends a single contact element to the contact list.
 * 
 * @param {HTMLElement} contactsList - The container to append the contact to.
 * @param {string} name - The full name of the contact.
 * @param {string} bgcolor - The background color of the contact's avatar.
 * @param {boolean} isPreselected - Whether the contact is preselected.
 */
function renderSingleContact(contactsList, name, bgcolor, isPreselected) {
    const contactElement = createContactElement(name, bgcolor, isPreselected);
    contactsList.appendChild(contactElement);
}


/**
 * Renders the list of contacts in the specified container.
 * @param {string} listId - The ID of the contacts container.
 */
async function renderContactsList(listId) {
    const contactsList = document.getElementById(listId);
    if (!contactsList) return;

    clearContactsList(contactsList);
    const preselectedInitials = getPreselectedInitials();

    renderAllContacts(contactsList, preselectedInitials);
    attachContactClickHandlers();
}


/**
 * Clears the content of the contacts container.
 * @param {HTMLElement} container - The container to clear.
 */
function clearContactsList(container) {
    container.innerHTML = '';
}


/**
 * Renders all contacts to the specified container.
 * @param {HTMLElement} container - The container to render contacts into.
 * @param {Array} preselectedInitials - List of initials that are preselected.
 */
function renderAllContacts(container, preselectedInitials) {
    allContacts.forEach(({ name, bgcolor }) => {
        const isPreselected = preselectedInitials.includes(getInitials(name));
        renderSingleContact(container, name, bgcolor, isPreselected);
    });
}


/**
 * Attaches click handlers to all rendered contact items.
 */
function attachContactClickHandlers() {
    document.querySelectorAll(".contact-item").forEach(contactItem => {
        contactItem.addEventListener("click", (event) => {
            const isPreselected = contactItem.classList.contains("preselected");
            handleContactClick(contactItem, isPreselected, event);
        });
    });
}


/**
 * Updates the display of selected contacts in the selected contacts container.
 * 
 * @param {string} selectedContainerId - The ID of the selected contacts container.
 */
function updateSelectedContactsDisplay(selectedContainerId) {
    const selectedContainer = document.getElementById(selectedContainerId);
    if (!selectedContainer) return;

    selectedContainer.innerHTML = ""; 

    renderContactAvatars(selectedContainer, Array.from(selectedContacts));
}


/**
 * Renders the avatars of selected contacts in the specified container.
 * 
 * @param {HTMLElement} container - The container to append the avatars to.
 * @param {Array} contacts - The array of selected contacts.
 */
function renderContactAvatars(container, contacts) {
    const limit = 4;
    const displayContacts = contacts.slice(0, limit);
    const additionalContactsCount = contacts.length - displayContacts.length;

    displayContacts.forEach(contact => {
        const avatarDiv = createContactAvatar(contact);
        container.appendChild(avatarDiv);
    });

    if (additionalContactsCount > 0) {
        const additionalAvatar = createAdditionalContactsAvatar(additionalContactsCount);
        container.appendChild(additionalAvatar);
    }
}


/**
 * Creates a single contact avatar element.
 * 
 * @param {Object} contact - The contact object containing name and bgcolor.
 * @returns {HTMLElement} The avatar element.
 */
function createContactAvatar(contact) {
    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar", "avatar-board-card");
    avatarDiv.style.backgroundColor = contact.bgcolor;
    avatarDiv.textContent = getInitials(contact.name);
    return avatarDiv;
}


/**
 * Creates an avatar element for additional contacts.
 * 
 * @param {number} count - Number of additional contacts.
 * @returns {HTMLElement} The additional contacts avatar element.
 */
function createAdditionalContactsAvatar(count) {
    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar", "additional-contacts");
    avatarDiv.style.backgroundColor = "#ccc";
    avatarDiv.textContent = `+${count}`;
    return avatarDiv;
}





