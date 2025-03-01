const allContacts = new Map();
const selectedContacts = new Set();

let contactsContainer;
let assignmentButton;
const selectedContactsContainer = document.getElementById("selected-contacts-container");

function initAddTaskContacts() {
    contactsContainer = document.getElementById('contacts-container');
    assignmentButton = document.getElementById('assignment-btn');

    fetchContacts();
}

function toggleContacts(event) {
    event.preventDefault();
    const contactsList = document.getElementById("contacts-list");
    const icon = document.getElementById("dropdown-icon");
    
    if (!contactsList) return console.error("❌ Element #contacts-list not found!");
        
    contactsList.classList.toggle("hidden");
    contactsList.classList.toggle("visible");

    const contactsContainer = contactsList.parentElement; // Adjust as needed
    if (contactsContainer) contactsContainer.classList.toggle("hidden");
    
    const isOpen = contactsList.classList.contains("visible");
    if (icon) icon.src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
    
    if (!isOpen) updateSelectedContactsDisplay();
}

async function fetchContacts() {
    const response = await fetch('https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/users.json');
  
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data) return console.error("Keine Nutzerdaten gefunden.");
        
    processContactsData(data); 
    renderContactsList();
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

function renderContactsList() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    console.log("🔹 Contacts to render:", contactsList);
    allContacts.forEach(({ name, bgcolor }) => {
        contactsList.appendChild(createContactElement(name, bgcolor));
    })
}

function capitalizeName(name) {
    return name
        .toLowerCase() 
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(" ");
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

function createAvatar(name, bgcolor) {
    const avatar = createElement("div", "avatar", getInitials(name));
    avatar.style.backgroundColor = bgcolor;
    return avatar;
}

function createCheckbox(name, avatar) {
    const checkbox = createElement("input", "contact-checkbox");
    checkbox.type = "checkbox";

    checkbox.dataset.contactName = name;
    checkbox.dataset.contactAvatar = avatar;
    checkbox.addEventListener("change", () => toggleContactSelection(name, checkbox.checked));
    return checkbox;
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

function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (text) element.innerText = text;
    return element;
}

function getInitials(name) {
    const parts = name.split(" ");
    return parts.map((part) => part[0]).join("").toUpperCase();
}