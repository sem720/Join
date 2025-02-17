const BASE_URL = 'https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/contacts/';

async function fetchContacts(url) {
    try {
        const response = await fetch(url + '.json');
        const contacts = await response.json();

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
        contactList.innerHTML = ""; // Reset list

        // Kontakte nach dem ersten Buchstaben des Vornamens gruppieren
        const groupedContacts = contactsArray.reduce((acc, contact) => {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(contact);
            return acc;
        }, {});

        // Gruppen alphabetisch nach dem ersten Buchstaben des Vornamens sortieren
        const sortedGroups = Object.keys(groupedContacts).sort().reduce((acc, key) => {
            acc[key] = groupedContacts[key];
            return acc;
        }, {});

        // Innerhalb jeder Gruppe Kontakte nach dem vollständigen Namen sortieren
        Object.entries(sortedGroups).forEach(([initial, contacts]) => {
            contacts.sort((a, b) => a.name.localeCompare(b.name));
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



function validateContactForm(event) {
    event.preventDefault();

    const name = document.getElementById("newContactName").value.trim();
    const email = document.getElementById("newContactEmail").value.trim();
    const phone = document.getElementById("newContactPhone").value.trim();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?$/;
    const phonePattern = /^(\\+|0)[0-9]+$/;

    if (!name || name.length < 3) {
        alert("Bitte einen gültigen Namen mit mindestens 3 Zeichen eingeben.");
        return false;
    }
    if (!emailPattern.test(email)) {
        alert("Bitte eine gültige E-Mail-Adresse eingeben");
        return false;
    }
    if (!phonePattern.test(phone)) {
        alert("Bitte eine gültige Telefonnummer eingeben.");
        return false;
    }
    saveContactToFirebase({ name, email, phone });
}



async function saveContactToFirebase(validatedData) {
    if (!validatedData) return;

    const newContact = {
        name: validatedData.name,
        email: validatedData.email,
        tel: validatedData.phone,
        bgcolor: getRandomColor(),
    };

    try {
        const response = await fetch(BASE_URL + ".json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newContact),
        });

        if (!response.ok) {
            throw new Error("Fehler beim Speichern des Kontakts.");
        }

        alert("Kontakt erfolgreich gespeichert!");
        closeAddContact();
        renderContacts();
    } catch (error) {
        console.error("Fehler beim Speichern des Kontakts:", error);
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