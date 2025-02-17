const allContacts = new Map();
const selectedContacts = new Set();
const contactsContainer = document.getElementById('contacts-container');
const assignmentButton = document.getElementById('assignment-btn');
const selectedContactsContainer = document.createElement("div");
selectedContactsContainer.id = "selected-contacts-container"; 
selectedContactsContainer.classList.add("selected-contacts-container");
assignmentButton.insertAdjacentElement("afterend", selectedContactsContainer);

assignmentButton.addEventListener('click', () => {
    contactsContainer.classList.toggle('hidden');

    if (contactsContainer.classList.contains("hidden")) {
        updateSelectedContactsDisplay();
    }
});

async function fetchContacts() {
    const response = await fetch('https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/users.json');
    const data = await response.json();

    if (!data) return console.error("Keine Nutzerdaten gefunden.");
        
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    allContacts.clear();

    Object.values(data).forEach(user => {
        let name = capitalizeName(user.name);
        let bgcolor = user.bgcolor;

        allContacts.set(name, { name, bgcolor }); 
    
        contactsList.appendChild(createContactElement(name, bgcolor));
    }); 
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

function createCheckbox(name) {
    const checkbox = createElement("input", "contact-checkbox");
    checkbox.type = "checkbox";
    checkbox.dataset.contactId = name;
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
            if (c.id === id) {
                selectedContacts.delete(c);
            }
        });
    }
    updateSelectedContactsDisplay();
}

function updateSelectedContactsDisplay() {
    selectedContactsContainer.innerHTML = "";

    selectedContacts.forEach(({ name, bgcolor }) => {
        const avatar = createAvatar(name, bgcolor);
        selectedContactsContainer.appendChild(avatar);
    });
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

document.addEventListener("DOMContentLoaded", fetchContacts);