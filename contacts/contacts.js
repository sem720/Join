const BASE_URL = 'https://join-c8725-default-rtdb.europe-west1.firebasedatabase.app/contacts/';

/**
 * Fetches contacts from a specified URL and transforms the data into an array of contact objects.
 *
 * This function retrieves contact data from a JSON endpoint, processes the data to extract relevant
 * information, and generates an array of contact objects containing the contact's id, background color,
 * name, email, telephone number, and initials.
 *
 * @param {string} url - The base URL to fetch contacts from (without the '.json' extension).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of contact objects.
 * @returns {string} returns[].id - The unique identifier for the contact.
 * @returns {string} returns[].bgcolor - The background color for the contact.
 * @returns {string} returns[].name - The full name of the contact.
 * @returns {string} returns[].email - The email address of the contact.
 * @returns {string} returns[].tel - The telephone number of the contact.
 * @returns {string} returns[].initials - The initials of the contact, derived from their name.
 *
 * @throws {Error} Throws an error if the fetch operation fails or if the response is not valid JSON.
 */
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
        }); // console.log("Geladene Kontakte:", contactsArray);
        return contactsArray;
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontakte:', error);
        return [];
    }
}

/**
 * Fetches and renders a list of contacts in a grouped and sorted format.
 *
 * This function retrieves contacts from a specified base URL, groups them by the first letter of their 
 * names, sorts these groups and the contacts within them, and then updates the DOM to display the 
 * contacts in a structured format. Each contact element is set up with an event listener to fetch 
 * and display detailed information when clicked.
 *
 * @returns {Promise<void>} A promise that resolves when the contacts have been rendered.
 *
 * @throws {Error} Throws an error if the fetching or rendering of contacts fails.
 */
async function renderContacts() {
    try {
        const contactsArray = await fetchContacts(BASE_URL) || [];
        const contactList = document.getElementById("contactList");
        contactList.innerHTML = ""; // console.log("Geladene Render Kontakte:", contactsArray);

        const groupedContacts = contactsArray.reduce((acc, contact) => {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(contact);
            return acc;
        }, {});

        const sortedGroups = Object.keys(groupedContacts).sort().reduce((acc, key) => {
            acc[key] = groupedContacts[key];
            return acc;
        }, {});

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

/**
 * Fetches and displays detailed information for a specific contact.
 *
 * This function retrieves contact data from a specified URL using the provided contact ID,
 * and updates the DOM to display the contact's details using the contact details template.
 *
 * @param {string} contactId - The unique identifier for the contact whose details are to be fetched.
 * @param {string} initial - The initials of the contact, used for display purposes.
 * @returns {Promise<void>} A promise that resolves when the contact details have been rendered.
 *
 * @throws {Error} Throws an error if the fetch operation fails or if the response is not valid JSON.
 */
async function fetchContactDetails(contactId, initial) {
    try {
        const response = await fetch(`${BASE_URL}${contactId}.json`);
        const contact = await response.json();
        if (contact) {
            const contactDetails = document.getElementById("contentDetails");
            contactDetails.innerHTML = contactDetailsTemplate(contact, initial);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontaktinformationen:", error);
    }
}

/**
 * Toggles the display of detailed information for a specific contact.
 *
 * This function highlights the selected contact by changing its background color and text color,
 * and displays the contact's details. It also manages the visibility of other contacts and the
 * details section based on the screen size.
 *
 * @param {string} contactId - The unique identifier for the contact whose details are to be toggled.
 * @param {string} initial - The initials of the contact, used for display purposes.
 *
 * @returns {void}
 */
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

/**
 * Creates a new contact in Firebase if the contact form is valid.
 *
 * This function validates the input fields of the contact form, and if all fields are valid,
 * it constructs a new contact object and sends a POST request to save it in Firebase. If the
 * contact is successfully saved, it updates the contact with the generated ID and refreshes the
 * contact list in the UI.
 *
 * @param {Event} event - The event object of the form submission.
 * @returns {Promise<void>} A promise that resolves when the contact has been saved and the UI is updated.
 *
 * @throws {Error} Throws an error if the fetch operation fails or if there are validation errors.
 */
async function saveNewContact(event) {
    event.preventDefault();
    let nameInput = document.getElementById("newContactName");
    let emailInput = document.getElementById("newContactEmail");
    let phoneInput = document.getElementById("newContactPhone");
    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let telError = document.getElementById("telError");

    let nameValue = nameInput.value.trim();
    let emailValue = emailInput.value.trim();
    let phoneValue = phoneInput.value.trim();

    let nameValid = nameValue.length >= 3;
    let emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
    let phoneValid = /^\+?[0-9\s-]+$/.test(phoneValue);

    let formValid = true;

    if (!nameValid) {
        nameError.classList.remove("d-none");
        formValid = false;
    } else {
        nameError.classList.add("d-none");
    }

    if (!emailValid) {
        emailError.classList.remove("d-none");
        formValid = false;
    } else {
        emailError.classList.add("d-none");
    }

    if (!phoneValid) {
        telError.classList.remove("d-none");
        formValid = false;
    } else {
        telError.classList.add("d-none");
    }

    if (!formValid) {
        console.log("Formular enthält Fehler! Neuer Kontakt wird nicht gespeichert.");
        return;
    }

    let newContact = {
        name: nameValue,
        email: emailValue,
        tel: phoneValue,
        bgcolor: getRandomColor()
    };

    try {
        let response = await fetch(BASE_URL + '.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        });
        let responseData = await response.json();
        let contactId = responseData.name;
        console.log("Kontakt erfolgreich gespeichert mit ID:", contactId);
        newContact.id = contactId;
        await fetch(`${BASE_URL}${contactId}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        });
        console.log("Kontakt mit ID aktualisiert:", newContact);

        await renderContacts();
        closeAddContact();
        nameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";

        let successAlert = document.getElementById("successAlert");
        successAlert.classList.add("success-animation");
        setTimeout(() => {
            successAlert.classList.remove("success-animation");
        }, 5000);
    } catch (error) {
        console.error("Fehler beim Speichern des Kontakts:", error);
    }
}

/**
 * Generates a random hexadecimal color code.
 *
 * This function creates a random color by generating a six-digit hexadecimal string,
 * which can be used for styling elements in a web application.
 *
 * @returns {string} A string representing a random color in hexadecimal format (e.g., "#etc").
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 6; i > 0; --i) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Saves the edited contact information to Firebase.
 *
 * This function prevents the default form submission behavior, retrieves the existing contact data
 * using the contact ID, merges it with the updated information from the form, and sends a PUT request
 * to update the contact in Firebase. It then refreshes the contact list in the UI and displays a success
 * message.
 *
 * @param {Event} event - The event object of the form submission.
 * @returns {Promise<void>} A promise that resolves when the contact has been updated and the UI is refreshed.
 *
 * @throws {Error} Throws an error if the fetch operation fails or if there is an issue with the network request.
 */
async function saveEditedContact(event) {
    event.preventDefault();
    const contactId = document.getElementById("editContact").getAttribute("data-contact-id");

    try {
        const response = await fetch(`${BASE_URL}${contactId}.json`);
        const existingContact = await response.json();

        const updatedContact = {
            name: document.getElementById("editContactName").value.trim(),
            email: document.getElementById("editContactEmail").value.trim(),
            tel: document.getElementById("editContactPhone").value.trim(),
        };

        const mergedContact = { ...existingContact, ...updatedContact };

        await fetch(`${BASE_URL}${contactId}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mergedContact),
        });
        console.log("✅ Kontakt erfolgreich aktualisiert:", mergedContact);

        await renderContacts();
        closeEditContact();

        editContactName.value = "";
        editContactEmail.value = "";
        editContactPhone.value = "";

        let successEditAlert = document.getElementById("successEditAlert");
        successEditAlert.classList.add("success-animation");
        setTimeout(() => {
            successEditAlert.classList.remove("success-animation");
        }, 5000);
    } catch (error) {
        console.error("Fehler beim Speichern des Kontakts:", error);
    }
}

/**
 * Deletes a contact from Firebase by its ID.
 *
 * This function sends a DELETE request to remove the specified contact from the database.
 * After successfully deleting the contact, it refreshes the contact list in the UI, 
 * clears the details section, and displays a success message.
 *
 * @param {string} contactId - The unique identifier of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves when the contact has been deleted and the UI is updated.
 *
 * @throws {Error} Throws an error if the fetch operation fails or if there is an issue with the network request.
 */
async function deleteContact(contactId) {
    try {
        await fetch(`${BASE_URL}${contactId}.json`, {
            method: "DELETE",
        });
        console.log(`Kontakt ${contactId} erfolgreich gelöscht`);
        await renderContacts();
        let contactsDetails = document.getElementById("contactsDetails");
        let contentDetails = document.getElementById("contentDetails");
        contactsDetails.classList.remove("active");
        contentDetails.innerHTML = "";

        let successDeleteAlert = document.getElementById("successDeleteAlert");
        successDeleteAlert.classList.add("success-animation");
        setTimeout(() => {
            successDeleteAlert.classList.remove("success-animation");
        }, 5000);

    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
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