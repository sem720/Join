let editContactsContainer;
let editContactsList;
let dropdownIcon;


function initEditContacts() {
    editContactsContainer = document.getElementById("edit-contacts-container");
    editContactsList = document.getElementById("edit-contacts-list");

    dropdownIcon = document.getElementById("dropdown-icon");
    const editAssignmentBtn = document.getElementById("toggle-contacts-btn");


    console.log("Button found:", editAssignmentBtn); // Debugging

    editAssignmentBtn.addEventListener("click", (event) => {
        console.log("button clicked");
        event.stopPropagation();
        toggleEditContacts();
    });

    document.addEventListener("click", closeOnOutsideClick);
}

function toggleEditContacts() {
    editContactsContainer = document.getElementById("edit-contacts-container");
    editContactsList = document.getElementById("edit-contacts-list");
    const isOpen = editContactsContainer.classList.contains("visible");
    isOpen ? closeEditContacts() : openEditContacts();
}

function openEditContacts() {
    editContactsContainer.classList.add("visible");
    editContactsContainer.classList.remove("hidden");
    editContactsList.classList.add("visible");
    editContactsList.classList.remove("hidden");
    updateDropdownIcon(true);
}

function closeEditContacts() {
    editContactsContainer.classList.add("hidden");
    editContactsContainer.classList.remove("visible");
    editContactsList.classList.add("hidden");
    editContactsList.classList.remove("visible");
    updateDropdownIcon(false);
}

function updateDropdownIcon(isOpen) {
    const dropdownIcon = document.getElementById("dropdown-icon");
    dropdownIcon.src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
}

function closeOnOutsideClick(event) {
    const editAssignmentBtn = document.querySelector(".assignment-btn");
    if (!editAssignmentBtn.contains(event.target) && !editContactsContainer.contains(event.target)) {
        closeEditContacts();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("🟢 DOM fully loaded!");
    initEditContacts();
});
