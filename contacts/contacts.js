const BASE_URL = 'https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/contacts/';

async function fetchContacts(url) {
    try {
        const response = await fetch(url + '.json');
        const contacts = await response.json();

        if (!contacts) {
            console.log('Keine Kontakte gefunden.');
            return [];
        }

        const contactsArray = Object.entries(contacts).map(([id, contact]) => {
            const { bgcolor, name, email, tel } = contact;
            let initials = '';
            if (name) {
                const nameParts = name.split(' ');
                initials = nameParts.length > 1
                    ? nameParts[0][0] + nameParts[1][0]
                    : nameParts[0][0];
                initials = initials.toUpperCase();
            }
            return { id, bgcolor, name, email, tel, initials };
        });

        console.log("Geladene Kontakte:", contactsArray);
        return contactsArray;
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontakte:', error);
        return [];
    }
}

async function renderContacts() {
    try {
        const contactsArray = await fetchContacts(BASE_URL) || [];

        const contactList = document.getElementById("contactList");
        if (!contactList) {
            console.error("Fehler: Element mit ID 'contactList' nicht gefunden.");
            return;
        }

        const sortedContacts = contactsArray.sort((a, b) => a.initials[0].localeCompare(b.initials[0]));
        const groupedContacts = sortedContacts.reduce((acc, contact) => {
            const initial = contact.initials[0];
            if (!acc[initial]) {
                acc[initial] = [];
            }
            acc[initial].push(contact);
            return acc;
        }, {});

        Object.entries(groupedContacts).forEach(([initial, contacts]) => {
            contactList.innerHTML += contactsListTemplate(initial, contacts);
        });

        document.querySelectorAll('.contact-content').forEach(contactElement => {
            contactElement.addEventListener('click', () => {
                const contactId = contactElement.dataset.id;
                const initial = contactElement.dataset.initial;
                fetchContactDetails(contactId, initial);
                toggleDetailsContact(contactId, initial);
            });
        });
    } catch (error) {
        console.error("Fehler beim Rendern der Kontakte:", error);
    }
}

async function fetchContactDetails(contactId, initial) {
    try {
        const response = await fetch(`${BASE_URL}${contactId}.json`);
        const contact = await response.json();

        if (contact) {
            const contactDetails = document.getElementById("contentDetails");
            if (contactDetails) {
                contactDetails.innerHTML = contactDetailsTemplate(contact, initial);
            }
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontaktinformationen:", error);
    }
}


function toggleDetailsContact(contactId, initial) {
    const contactContent = document.querySelector(`.contact-content[data-id="${contactId}"]`);
    const contentDetails = document.getElementById('contentDetails');
    const nameInList = contactContent.querySelector('.name-in-list');
    const nameCircle = contactContent.querySelector('.name-circle');
    const isActive = contactContent.classList.contains('bgc-darkblue');

    document.querySelectorAll('.contact-content').forEach(contact => {
        contact.classList.remove('bgc-darkblue');
        const otherNameInList = contact.querySelector('.name-in-list');
        const otherNameCircle = contact.querySelector('.name-circle');
        otherNameInList.classList.remove('color-white');
        otherNameCircle.classList.remove('border-white');
    });

    if (!isActive) {
        contactContent.classList.add('bgc-darkblue');
        nameInList.classList.add('color-white');
        nameCircle.classList.add('border-white');
        contentDetails.classList.add('active');
        fetchContactDetails(contactId, initial);
    } else {
        contentDetails.classList.remove('active');
    }

    if (window.innerWidth <= 1000) {
        document.getElementById("contacts").classList.add('hidden');
        document.getElementById("contactsDetails").classList.add('active');
    } else {
        document.getElementById("contacts").classList.remove('hidden');
    }
}




function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color);
    return color;
}
// getRandomColor()




/**
 * Toggles the visibility of the contact list and details on smaller screens.
 * On screens with a width of 1000px or less, this function hides the contact list and shows the details when the back button is clicked.
 * @function toggleBack
 * @description Toggles the visibility of the contact list and details on smaller screens.
 */
function toggleBack() {
    if (window.innerWidth <= 1000) {
        contacts.classList.remove('hidden');
        contactsDetails.classList.remove('active');
    }
}