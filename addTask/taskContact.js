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
    setupAssignmentButtons(); // 🔄 Event-Listener für Buttons setzen

    console.log("💡 Init Contacts - Searching for:", listId);
    console.log("📌 Contacts List Found:", document.getElementById(listId));

    document.addEventListener("keydown", handleKeydownOutsideAssignment);

    setupOutsideClickListener();
}

/**
 * Fügt allen `.assignment-btn` Buttons einen Click-EventListener hinzu.
 */
function setupAssignmentButtons() {
    document.querySelectorAll(".assignment-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            console.log("✅ Button Clicked!", event.target);

            const containerId = button.getAttribute("data-container-id");
            const listId = button.getAttribute("data-list-id");
            const selectedContainerId = button.getAttribute("data-selected-id");

            if (!listId) return console.error("❌ listId is undefined! Check the button's data attributes.");
             
            toggleContacts(event, containerId, listId, selectedContainerId);
        });
    });
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
    event.preventDefault();

    console.log("🔄 toggleContacts() called!", { containerId, listId, selectedContainerId });

    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);
    
    if (!contactsContainer || !contactsList) return console.error(`❌ Missing container: ${containerId} or ${listId}`);
    
    const isOpen = contactsContainer.classList.toggle("visible");
    contactsContainer.classList.toggle("hidden", !isOpen);

    updateDropdownIcon(isOpen); // ✅ Update icon here
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
 * Schließt das Kontakt-Menü, wenn außerhalb geklickt wird.
 * @param {Event} event - Der Klick-Event.
 */
function handleOutsideClick(event) {
    const menu = document.getElementById("contacts-container");

    if (
        menu &&
        menu.classList.contains("visible") && // Nur prüfen, wenn das Menü sichtbar ist
        !menu.contains(event.target) &&
        !event.target.closest(".assignment-btn")
    ) {
        menu.classList.add("hidden");
        menu.classList.remove("visible");

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
    updateSelectedContactsDisplay(selectedContainerId);
}



/**
 * Closes the contacts list by adding the "hidden" class and removing the "visible" class.
 * It also updates the dropdown icon and disables outside click behavior.
 */
function closeContacts(containerId, listId) {
    const contactsContainer = document.getElementById(containerId);
    const contactsList = document.getElementById(listId);

    if (!contactsContainer || !contactsList) return  console.error(`❌ Contacts container (${containerId}) or list (${listId}) not found!`);
      
    contactsContainer.classList.add("hidden");
    contactsContainer.classList.remove("visible");
    contactsList.classList.add("hidden");
    contactsList.classList.remove("visible");

    updateDropdownIcon(false);
}


/**
 * Fetches the contacts data from an external source and processes it into a usable format.
 * 
 * @throws {Error} Throws an error if the HTTP request fails or the data is invalid.
 */
async function fetchAndRenderContacts(listId) {
    try {
        const response = await fetch('https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/users.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (!data) throw new Error("Keine Nutzerdaten gefunden.");

        processContactsData(data); 
        console.log("✅ Contacts fetched:", Array.from(allContacts.keys())); // Debugging

        listId ? renderContactsList(listId) : console.error("❌ listId is undefined in fetchAndRenderContacts");

    } catch (error) {
        console.error("❌ Fehler beim Laden der Kontakte:", error.message);
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
    if (!listId) return console.error("❌ listId is undefined in renderContactsList");
       
    const contactsList = document.getElementById(listId);
    if (!contactsList) return console.error(`❌ Contacts list not found: ${listId}`);
        
    console.log(`📝 Rendering contacts in list: ${listId}`);
    contactsList.innerHTML = '';

    allContacts.forEach(({ name, bgcolor }) => {
        console.log(`👤 Adding contact: ${name}`);
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
    const contactDiv = createElement("div", "contact-item");
    const nameSpan = createElement("span", "contact-name", name);
    
    contactDiv.append(
        createAvatar(name, bgcolor),
        nameSpan,
        createCheckbox(name)
    );

    contactDiv.addEventListener("click", () => handleContactClick(contactDiv));
    return contactDiv;
}


/**
 * Updates the display of selected contacts in the selected contacts container.
 */
function updateSelectedContactsDisplay(selectedContainerId) {
    const selectedContainer = document.getElementById(selectedContainerId);
    if (!selectedContainer) return console.error(`❌ Selected contacts container not found: ${selectedContainerId}`);
    
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

    if (!contact) return console.error(`❌ Contact not found: ${name}`);
        
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


