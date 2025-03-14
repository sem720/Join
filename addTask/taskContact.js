const allContacts = new Map();
const selectedContacts = new Set();
let assignmentButton;
let contactsContainer;
const icon = document.getElementById("dropdown-icon");
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

    document.addEventListener("keydown", handleKeydownOutsideAssignment);
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


function toggleContacts(event, containerId, listId, selectedContainerId) {
    console.log("✅ toggleContacts called with:", { containerId, listId, selectedContainerId });

    event.preventDefault();
    
    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);

    console.log("📌 Found contactsContainer:", contactsContainer);
    console.log("📌 Found contactsList:", contactsList);


    if (!contactsContainer || !contactsList) return console.error(`❌ Missing container: ${containerId} or ${listId}`);
    const isOpen = contactsContainer.classList.contains("visible");
    
    isOpen ? closeContacts(containerId, listId) : (openContacts(containerId, listId, selectedContainerId), renderContactsList(listId));

}


/**
 * Manages the outside click event listener. If enabled, the listener will close the contacts
 * list when a click occurs outside of the assignment container.
 * 
 * @param {boolean} enable - Determines whether the outside click listener should be enabled or disabled.
 */
function manageOutsideClick(enable, containerId) {
    if (enable) {
        document.addEventListener("click", handleOutsideClick);
    } else {
        document.removeEventListener("click", handleOutsideClick);
    }

    function handleOutsideClick(event) {
        closeOnOutsideClick(event, containerId);
    }
}



/**
 * Closes the contacts list if a click happens outside of the assignment container.
 * 
 * @param {MouseEvent} event - The click event triggered by a user interaction.
 */
function closeOnOutsideClick(event, containerId) {
    const contactsContainer = document.getElementById(containerId);

    if (!contactsContainer || contactsContainer.contains(event.target)) {
        return; // Prevent closing when clicking inside
    }

    closeContacts(containerId, "contacts-list"); 
    manageOutsideClick(false, containerId); // Ensure listener is removed when closing
    updateDropdownIcon(false);
}



/**
 * Updates the dropdown icon to indicate whether the contacts list is open or closed.
 * 
 * @param {boolean} isOpen - If true, the icon indicates that the contacts list is open; otherwise, it indicates closed.
 */
function updateDropdownIcon(isOpen) {
    if (icon) {
        icon.src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
    }
}


/**
 * Opens the contacts list by adding the "visible" class and removing the "hidden" class.
 * It also updates the dropdown icon and manages outside click behavior.
 */
function openContacts(containerId, listId, selectedContainerId) {
    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);

    contactsContainer.classList.add("visible");
    contactsContainer.classList.remove("hidden");
    contactsList.classList.add("visible");
    contactsList.classList.remove("hidden");

    updateDropdownIcon(true);
    manageOutsideClick(true, containerId);
    updateSelectedContactsDisplay(selectedContainerId);

    fetchAndRenderContacts(listId);
    updateSelectedContactsDisplay(selectedContainerId);
}



/**
 * Closes the contacts list by adding the "hidden" class and removing the "visible" class.
 * It also updates the dropdown icon and disables outside click behavior.
 */
function closeContacts(containerId, listId) {
    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);

    if (!contactsContainer || !contactsList) {
        console.error(`❌ Contacts container (${containerId}) or list (${listId}) not found!`);
        return;
    }

    contactsContainer.classList.add("hidden");
    contactsContainer.classList.remove("visible");
    contactsList.classList.add("hidden");
    contactsList.classList.remove("visible");

    updateDropdownIcon(false);
    manageOutsideClick(false, containerId);

}


/**
 * Fetches the contacts data from an external source and processes it into a usable format.
 * 
 * @throws {Error} Throws an error if the HTTP request fails or the data is invalid.
 */
async function fetchAndRenderContacts(listId) {
    const response = await fetch('https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/users.json');
    if (!response.ok) return console.error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();
    if (!data) return console.error("Keine Nutzerdaten gefunden.");

    processContactsData(data); 
    if (listId) {
        await renderContactsList(listId);
      } else {
        console.error('❌ listId is undefined in fetchAndRenderContacts');
      }
}


/**
 * Processes the raw contacts data and stores it in the `allContacts` map.
 * 
 * @param {Object} data - The raw contacts data.
 */
function processContactsData(data) {
    allContacts.clear();
    Object.values(data).forEach(user => {
        let name = capitalizeName(user.name);
        let bgcolor = user.bgcolor;
        allContacts.set(name, { name, bgcolor }); 
    }); 
}


/**
 * Renders the list of contacts in the contacts container by creating HTML elements for each contact.
 */
async function renderContactsList(listId) {
    console.log("🔍 Trying to render contacts for:", listId);
    if (!listId) {
        console.error("❌ listId is undefined when calling renderContactsList");
        return;
    }
    const contactsList = document.getElementById(listId);
    if (!contactsList) {
        console.error(`❌ Target contacts list not found: ${listId}`);
        return;
    }
    contactsList.innerHTML = '';

    allContacts.forEach(({ name, bgcolor }) => {
        contactsList.appendChild(createContactElement(name, bgcolor));
    });
}


/**
 * Creates a contact element to be displayed in the contacts list.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} bgcolor - The background color associated with the contact.
 * @returns {HTMLElement} The contact element.
 */
function createContactElement(name, bgcolor) {
    const contactDiv = document.createElement("div");
    contactDiv.classList.add("contact-item");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("contact-name");
    nameSpan.textContent = name;

    const checkbox = createCheckbox(name);

    contactDiv.appendChild(createAvatar(name, bgcolor));
    contactDiv.appendChild(nameSpan);
    contactDiv.appendChild(checkbox);

    contactDiv.addEventListener("click", () => handleContactClick(contactDiv));

    return contactDiv;
}



/**
 * Updates the display of selected contacts in the selected contacts container.
 */
function updateSelectedContactsDisplay(selectedContainerId) {
    const selectedContainer = document.getElementById(selectedContainerId);
    if (!selectedContainer) {
        console.error(`❌ Selected contacts container not found: ${selectedContainerId}`);
        return;
    }

    console.log("Selected Container ID:", selectedContainerId);
    console.log("Selected Container:", selectedContainer);
    selectedContainer.innerHTML = "";

    selectedContacts.forEach(({ name, bgcolor }) => {
        const avatar = createAvatar(name, bgcolor);
        selectedContainer.appendChild(avatar);
    });
}


/**
 * Toggles the selection state of a contact and updates the display of selected contacts.
 * 
 * @param {string} name - The name of the contact.
 * @param {boolean} isChecked - The new selection state of the contact (true if selected, false if deselected).
 */
function toggleContactSelection(name, isChecked) {
    console.log(`Toggling contact: ${name}, Checked: ${isChecked}`);
    const contact = allContacts.get(name);

    if (!contact) {
        console.error(`❌ Contact not found in allContacts: ${name}`);
        return;
    }

    if (isChecked) {
        selectedContacts.add(contact);
    } else {
        selectedContacts.delete(contact);
    }

    console.log("Updated selected contacts:", [...selectedContacts]);

    updateSelectedContactsDisplay("selected-contacts-container"); // Ensure correct ID
}


function handleCheckboxChange(checkbox, img, name) {
    checkbox.addEventListener("change", () => {
        console.log(`Checkbox changed: ${name}, Checked: ${checkbox.checked}`);
        
        toggleContactSelection(name, checkbox.checked);
        toggleCheckboxVisibility(checkbox, img, checkbox.checked);
    });

    // Ensure clicking the image returns to the checkbox
    img.addEventListener("click", () => {
        uncheckCheckbox(checkbox, img, name);
    });
}


// Function to create the checkbox with image logic
function createCheckbox(name, avatar) {
    const container = createElement("div", "contact-checkbox-container");

    const checkbox = createCheckboxElement(name, avatar);
    const img = createImageElement();

    container.appendChild(checkbox);
    container.appendChild(img);

    handleCheckboxChange(checkbox, img, name);

    return container;
}


function handleContactClick(contactItem) {
    contactItem.classList.toggle("selected");
    const avatar = contactItem.querySelector(".avatar");
    const nameSpan = contactItem.querySelector(".contact-name");
    const checkboxImg = contactItem.querySelector(".checkbox-image");

    avatar?.classList.toggle("selected-avatar");
    nameSpan?.classList.toggle("selected-name");
    checkboxImg?.classList.toggle("selected-checkbox-image");
}


function handleCheckboxChecked(avatar) {
    selectedContactsContainer.appendChild(avatar);
}


function handleCheckboxUnchecked(avatar) {
    selectedContactsContainer.removeChild(avatar);
}

function handleCheckboxChangeAvatar(name) {
    const avatar = createElement("div", "avatar", getInitials(name));
    checkbox.addEventListener("change", () => {
        toggleContactSelection(name, checkbox.checked);
        
        if (checkbox.checked) {
            handleCheckboxChecked(avatar, name);
        } else {
            handleCheckboxUnchecked(avatar, name);
            }
        console.log(`Avatar visibility for ${name}:`, avatar.style.display);
    });
}


