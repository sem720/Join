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
    const addContactOverlay = document.getElementById(`addContactOverlay`);
    addContactOverlay.classList.add("overlay", "animateRightToLeft");
    addContactOverlay.innerHTML += openAddContactTemp();
    addContact.addEventListener('click', (e) => {
        e.stopPropagation()
    })
}

/**
 * Close the new contact overlay.
 */
function closeAddContact() {
    const addContactOverlay = document.getElementById(`addContactOverlay`);
    addContactOverlay.classList.remove("overlay", "animateRightToLeft");
    addContactOverlay.innerHTML = "";
}


