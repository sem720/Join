// const BASE_URL = 'https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/contacts/';
// const myArr = []
// async function fetchContacts(url) {
//     try {
//         const response = await fetch(url + '.json');
//         const contacts = await response.json();
//         const contactListElement = document.getElementById('contactList');
//         console.log(contacts);
//         myArr.push(contacts)

//         myArr.forEach((contact) => {
//             console.log(contact.contact1.email);
//         });
//     } catch (error) {
//         console.error('Fehler beim Fetchen der Kontakte:', error);
//     }
// }
// fetchContacts(BASE_URL)


/**
 * Open the new contact overlay.
 */
function openAddContact() {
    addContactOverlay.classList.add("overlay", "active");
    addContactOverlay.classList.remove("closing");
    addContact.innerHTML += openAddContactTemp();
    addContact.addEventListener('click', (e) => {
        e.stopPropagation()
    })
}

/**
 * Close the new contact overlay.
 */
function closeAddContact() {
    addContactOverlay.classList.add("closing");
    addContact.classList.add("closing-to-right");
    setTimeout(() => {
        addContactOverlay.classList.remove("overlay", "active", "closing");
        addContact.classList.remove("closing-to-right");
        addContact.innerHTML = "";
    }, 500);
}

/**
 * Open the edit contact overlay.
 */
function openEditContact() {
    editContactOverlay.classList.add("overlay", "active");
    editContactOverlay.classList.remove("closing");
    editContact.innerHTML += openEditContactTemp();
    editContact.addEventListener('click', (e) => {
        e.stopPropagation()
    })
}

/**
 * Close the edit contact overlay.
 */
function closeEditContact() {
    editContactOverlay.classList.add("closing");
    editContact.classList.add("closing-to-right");
    setTimeout(() => {
        editContactOverlay.classList.remove("overlay", "active", "closing");
        editContact.classList.remove("closing-to-right");
        editContact.innerHTML = "";
    }, 500);
}

