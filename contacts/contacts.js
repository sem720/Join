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

/**
 * Toggles CSS classes for various elements to change their appearance.
 */
function toggleDetailsContact() {
    if (window.innerWidth <= 1000) {
        contacts.classList.add('hidden');
        contactsDetails.classList.add('active');
    } else {
        contentDetails.classList.toggle("active");
        contactContent.classList.toggle("bgc-darkblue");
        nameInList.classList.toggle("color-white");
        nameCircle.classList.toggle("border-white");
    }
    if (window.innerWidth > 1000) {
        contacts.classList.remove('hidden');
    }
}

/** */
function checkWindowSize() {
    if (window.innerWidth <= 1000) {
        if (document.getElementById('contactsDetails').classList.contains('active')) {
            document.getElementById('contacts').classList.add('hidden');
        } else {
            document.getElementById('contacts').classList.remove('hidden');
        }
    } else {
        document.getElementById('contacts').classList.remove('hidden');
    }
}
window.addEventListener('resize', checkWindowSize);
checkWindowSize();


/**
 * Toggles the visibility of the contact list and details on smaller screens.
 * On screens with a width of 1000px or less, this function hides the contact list and shows the details when the back button is clicked.
 * @function toggleBack
 * @description Toggles the visibility of the contact list and details on smaller screens.
 */
function toggleBack() {
    if (window.innerWidth <= 1000) {
        // Details ausblenden und Kontaktliste anzeigen
        contacts.classList.remove('hidden');
        contactsDetails.classList.remove('active');
    }
}

function toggleEditDeleteMenu() {
    const menu = document.getElementById('editDeleteMenu');

    if (!menu.classList.contains('active')) {
        menu.classList.add('active');
        menu.style.display = 'flex'; // Sicherstellen, dass es angezeigt wird

        // Event-Listener hinzufügen, um das Menü bei Klick außerhalb zu schließen
        setTimeout(() => {
            document.addEventListener('click', closeMenuOnClickOutside);
        }, 10);
    } else {
        closeMenu();
    }
}

function closeMenu() {
    const menu = document.getElementById('editDeleteMenu');
    menu.classList.remove('active');
    setTimeout(() => {
        menu.style.display = 'none'; // Nach der Animation ausblenden
    }, 500); // Animation auf 0.5s verlängert
    document.removeEventListener('click', closeMenuOnClickOutside);
}

function closeMenuOnClickOutside(event) {
    const menu = document.getElementById('editDeleteMenu');
    const moreBtn = document.getElementById('moreBtn');

    if (!menu.contains(event.target) && !moreBtn.contains(event.target)) {
        closeMenu();
    }
}