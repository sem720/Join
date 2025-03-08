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
function initAddTaskContacts() {
    contactsContainer = document.getElementById('contacts-container');
    assignmentButton = document.getElementById('assignment-btn');
    subtasksInput = document.getElementById('subtasks');

    fetchContacts();

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


function toggleContacts(event) {
    event.preventDefault();
    
    const contactsContainer = document.getElementById('contacts-container');
    const contactsList = document.getElementById("contacts-list");
    if (!contactsList) return console.error("❌ Element #contacts-list not found!");

    const isOpen = contactsContainer.classList.contains("visible");

    isOpen ? closeContacts() : openContacts();
}


/**
 * Manages the outside click event listener. If enabled, the listener will close the contacts
 * list when a click occurs outside of the assignment container.
 * 
 * @param {boolean} enable - Determines whether the outside click listener should be enabled or disabled.
 */
function manageOutsideClick(enable) {
    if (enable) {
        document.addEventListener("click", closeOnOutsideClick);
    } else {
        document.removeEventListener("click", closeOnOutsideClick);
    }
}


/**
 * Closes the contacts list if a click happens outside of the assignment container.
 * 
 * @param {MouseEvent} event - The click event triggered by a user interaction.
 */
function closeOnOutsideClick(event) {
    const assignmentContainer = document.querySelector(".assignment-container");

    if (!assignmentContainer.contains(event.target)) {
        closeContacts();
        updateDropdownIcon(false);
    }
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
function openContacts() {
    const contactsContainer = document.getElementById('contacts-container');
    const contactsList = document.getElementById("contacts-list");

    contactsContainer.classList.add("visible");
    contactsContainer.classList.remove("hidden");

    contactsList.classList.add("visible");
    contactsList.classList.remove("hidden");

    updateDropdownIcon(true);
    manageOutsideClick(true);
    updateSelectedContactsDisplay(); // Aktiviert das Schließen bei Klick außerhalb
}


/**
 * Closes the contacts list by adding the "hidden" class and removing the "visible" class.
 * It also updates the dropdown icon and disables outside click behavior.
 */
function closeContacts() {
    const contactsContainer = document.getElementById('contacts-container');
    const contactsList = document.getElementById("contacts-list");

    contactsContainer.classList.add("hidden");
    contactsContainer.classList.remove("visible");

    contactsList.classList.add("hidden");
    contactsList.classList.remove("visible");

    updateDropdownIcon(false);
    manageOutsideClick(false);
    updateSelectedContactsDisplay(); // Deaktiviert das Schließen bei Klick außerhalb
}


/**
 * Fetches the contacts data from an external source and processes it into a usable format.
 * 
 * @throws {Error} Throws an error if the HTTP request fails or the data is invalid.
 */
async function fetchContacts() {
    const response = await fetch('https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/users.json');
  
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data) return console.error("Keine Nutzerdaten gefunden.");
        
    processContactsData(data); 
    await renderContactsList();
}


/**
 * Processes the raw contacts data and stores it in the `allContacts` map.
 * 
 * @param {Object} data - The raw contacts data.
 */
function processContactsData(data) {
    allContacts.clear();
    console.log("✅ Processed Contacts:", data);
    Object.values(data).forEach(user => {
        let name = capitalizeName(user.name);
        let bgcolor = user.bgcolor;

        allContacts.set(name, { name, bgcolor }); 
    }); 
}


/**
 * Renders the list of contacts in the contacts container by creating HTML elements for each contact.
 */
async function renderContactsList() {
    const contactsList = document.getElementById('contacts-list');
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
function createContactElement(name, bgcolor, avatar) {
    const contactDiv = createElement("div", "contact-item");
    const nameSpan = createElement("span", "contact-name", name);
    const checkbox = createCheckbox(name);

    contactDiv.appendChild(createAvatar(name, bgcolor)); 
    contactDiv.appendChild(nameSpan); 
    contactDiv.appendChild(checkbox); 

    handleContactClick(contactDiv, avatar, checkbox);
    
    return contactDiv; 
}


/**
 * Updates the display of selected contacts in the selected contacts container.
 */
function updateSelectedContactsDisplay() {
    selectedContactsContainer.innerHTML = ""; 

    selectedContacts.forEach(({ name, bgcolor }) => {
        const avatar = createAvatar(name, bgcolor);
        selectedContactsContainer.appendChild(avatar);
    });
}


/**
 * Toggles the selection state of a contact and updates the display of selected contacts.
 * 
 * @param {string} name - The name of the contact.
 * @param {boolean} isChecked - The new selection state of the contact (true if selected, false if deselected).
 */
function toggleContactSelection(name, isChecked) {
    const contact = allContacts.get(name);
    if (!contact) return;

    if (isChecked) {
        selectedContacts.add(contact);
    } else {
        selectedContacts.forEach(c => {
            if (c.name === name) {
                selectedContacts.delete(c);
            }
        });
    }
    updateSelectedContactsDisplay();
}


function handleCheckboxChange(checkbox, img, name) {
    checkbox.addEventListener("change", () => {
        toggleContactSelection(name, checkbox.checked);
        
        img.style.display = checkbox.checked ? "block" : "none";
        checkbox.style.display = checkbox.checked ? "none" : "block";
    });
      // Ensure clicking the image returns to the checkbox
      img.addEventListener("click", () => {
        checkbox.checked = false;  // Uncheck the checkbox
        img.style.display = "none";  // Hide the image
        checkbox.style.display = "block";  // Show the checkbox again
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
    contactItem.addEventListener("click", () => {
        contactItem.classList.toggle("selected");
        const avatar = contactItem.querySelector(".avatar");
        if (avatar) avatar.classList.toggle("selected-avatar");

        const nameSpan = contactItem.querySelector(".contact-name");
        if (nameSpan) nameSpan.classList.toggle("selected-name");

        const checkboxImg = contactItem.querySelector(".checkbox-image");
        if (checkboxImg) checkboxImg.classList.toggle("selected-checkbox-image");
        
    })
}

function initOutsideClick() {
    const modal = document.getElementById("addTaskModal");
    const contactsContainer = document.getElementById("contacts-container");
    const assignmentButton = document.getElementById("assignment-btn");

    modal.addEventListener("click", (event) => {
        if (!contactsContainer.contains(event.target) && !assignmentButton.contains(event.target)) {
            closeContacts();
            updateDropdownIcon(false);
        }
    });
}