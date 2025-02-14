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

    Object.values(data).forEach(({ name }) => name && contactsList.appendChild(createContactElement(capitalizeName(name)))
    );
    console.log("API Respnse:", data)
    async function fetchContacts() {
        console.log("fetchContacts() wurde aufgerufen");
    }
    
}

function capitalizeName(name) {
    return name
        .toLowerCase() // Falls der Name komplett in Großbuchstaben gespeichert ist
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Erstes Zeichen groß
        .join(" ");
}


function createContactElement(name) {
    const contactDiv = createElement("div", "contact-item");
    contactDiv.appendChild(createAvatar(name)); 
        
    const nameSpan = createElement("span", "contact-name", name);
    contactDiv.appendChild(nameSpan); 
    
    const checkbox = createCheckbox(name);
    contactDiv.appendChild(checkbox); // Hier wird die Checkbox direkt hinzugefügt
    
    return contactDiv; 
}

function updateSelectedContactsDisplay() {
    selectedContactsContainer.innerHTML = ""; // Vorherige Avatare entfernen

    selectedContacts.forEach(name => {
        const avatar = createAvatar(name);
        selectedContactsContainer.appendChild(avatar);
    });
}

function createAvatar(name) {
    const avatar = createElement("div", "avatar", getInitials(name));
    avatar.style.backgroundColor = getRandomColor();
    return avatar;
}

function createCheckbox(name) {
    const checkbox = createElement("input", "contact-checkbox");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => toggleContactSelection(name, checkbox.checked));
    return checkbox;
}

function toggleContactSelection(name, isChecked) {
    isChecked ? selectedContacts.add(name) : selectedContacts.delete(name);
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

function getRandomColor() {
    const colors = ["#00bee8", "#ff7a00", "#9327ff", "#FF33A1", "#6e52ff", "#fc71ff", "#ffbb2b", "#1fd7c1", "#462f8a", "#ff4646"];
    return colors[Math.floor(Math.random() * colors.length)];
}

document.addEventListener("DOMContentLoaded", fetchContacts);