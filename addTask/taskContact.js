const allContacts = new Map();
const selectedContacts = new Set();

let assignmentButton;
let contactsContainer;
const icon = document.getElementById("dropdown-icon");
const selectedContactsContainer = document.getElementById("selected-contacts-container");


function initAddTaskContacts() {
    contactsContainer = document.getElementById('contacts-container');
    assignmentButton = document.getElementById('assignment-btn');
    subtasksInput = document.getElementById('subtasks');

    fetchContacts();

    document.addEventListener("keydown", handleKeydownOutsideAssignment);
}

function handleKeydownOutsideAssignment(event) {
    // Wenn Enter gedrückt wird, und der Fokus nicht auf dem Assignment-Button oder einem Kontaktfeld ist,
    // verhindern wir das Öffnen der Kontakte-Liste
    if (event.key === "Enter") {
        event.preventDefault();
    }
}


function toggleContacts(event) {
    event.preventDefault();
    
    const contactsContainer = document.getElementById('contacts-container');
    const contactsList = document.getElementById("contacts-list");
    if (!contactsList) return console.error("❌ Element #contacts-list not found!");

    const isOpen = contactsContainer.classList.contains("visible");

    if (isOpen) {
        closeContacts();
    } else {
        openContacts();
    }
}


function manageOutsideClick(enable){
    if (enable) {
        document.addEventListener("click", closeOnOutsideClick);
    } else {
        document.removeEventListener("click", closeOnOutsideClick);
    }
}


function closeOnOutsideClick(event) {
    const assignmentContainer = document.querySelector(".assignment-container");

    if (!assignmentContainer.contains(event.target)) {
        closeContacts();

        updateDropdownIcon(false);
    }
}


function updateDropdownIcon(isOpen) {
    if (icon) {
        icon.src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
    }
}


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


function processContactsData(data) {
    allContacts.clear();
    console.log("✅ Processed Contacts:", data);
    Object.values(data).forEach(user => {
        let name = capitalizeName(user.name);
        let bgcolor = user.bgcolor;

        allContacts.set(name, { name, bgcolor }); 
    }); 
}


async function renderContactsList() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';

    allContacts.forEach(({ name, bgcolor }) => {
        contactsList.appendChild(createContactElement(name, bgcolor));
    })
}


function createContactElement(name, bgcolor) {
    const contactDiv = createElement("div", "contact-item");
    contactDiv.appendChild(createAvatar(name, bgcolor)); 
        
    const nameSpan = createElement("span", "contact-name", name);
    contactDiv.appendChild(nameSpan); 
    
    const checkbox = createCheckbox(name);
    contactDiv.appendChild(checkbox); 
    
    return contactDiv; 
}


function updateSelectedContactsDisplay() {
    selectedContactsContainer.innerHTML = ""; 

    selectedContacts.forEach(({ name, bgcolor }) => {
        const avatar = createAvatar(name, bgcolor);
        selectedContactsContainer.appendChild(avatar);
    });
}


function toggleContactSelection(name, isChecked) {
    const contact = allContacts.get(name);
    if (!contact) return;

    if (isChecked) {
        selectedContacts.add(contact);
    } else {
        selectedContacts.forEach(c=> {
            if (c.name === name) {
                selectedContacts.delete(c);
            }
        });
    }
    updateSelectedContactsDisplay();
}


