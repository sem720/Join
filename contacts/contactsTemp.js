/**
 * Opens and returns the HTML template for adding a new contact.
 * @returns {string} The HTML template for adding a contact.
 */
function openAddContactTemp() {
    return `    
                <div class="addContact-titles">
                    <img src="../assets/imgs/logo-white-blue.png" />
                    <h1>Add Contact</h1>
                    <p class="betterP">Tasks are better with a team!</p>
                    <div class="blue-line"></div>
                </div>

                <div class="addContact-container">
                    <div class="close" onclick="closeAddContact()">x</div>
                    <div class="contact-image-container">
                        <img class="contact-image" src="../assets/imgs/add-contact.png" />
                    </div>
                    <form class="addContact-content" onsubmit="validateContactForm()">
                        <div class="inputs-container">
                            <div class="addContact-input">
                                <input required id="newContactName" class="input-standard contact-name"
                                    placeholder="Name" type="text" minlength="3" />
                                <img src="../assets/imgs/input-name.png" alt="">
                            </div>
                            <div class="addContact-input">
                                <input required id="newContactEmail" class="input-standard contact-email"
                                    placeholder="Email" type="email" />
                                <img src="../assets/imgs/input-email.png" alt="">
                            </div>
                            <div class="addContact-input">
                                <input required id="newContactPhone" class="input-standard contact-phone"
                                    placeholder="Phone" type="tel" />
                                <img src="../assets/imgs/Input_Phone.png" alt="">
                            </div>
                        </div>
                        
                        <div class="buttons-addContact">
                            <button type="button" onclick="closeAddContact()" class="cancel btn-bright">
                                Cancel &nbsp; X
                            </button>
                            <button type="submit" class="btn-dark">
                                Create Contact &nbsp;
                                <img src="../assets/imgs/check-white.png" />
                            </button>
                        </div>
                    </form>
                </div>
`
}

/**
 * Opens and returns the HTML template for editing an existing contact.
 * @returns {string} The HTML template for editing a contact.
 */
function openEditContactTemp() {
    return `    
                <div class="editContact-titles">
                    <img src="../assets/imgs/logo-white-blue.png" />
                    <h1>Edit Contact</h1>
                    <div class="blue-line"></div>
                </div>

                <div class="editContact-container">
                    <div class="close" onclick="closeEditContact()">x</div>
                    <div class="contact-image-container">
                        <img class="contact-image" src="../assets/imgs/add-contact.png" />
                    </div>
                    <form class="editContact-content" onsubmit="">
                        <div class="inputs-container">
                            <div class="editContact-input">
                                <input required id="newContactName" class="input-standard contact-name"
                                    placeholder="Name" type="text" />
                                <img src="../assets/imgs/input-name.png" alt="">
                            </div>
                            <div class="editContact-input">
                                <input required id="newContactEmail" class="input-standard contact-email"
                                    placeholder="Email" type="email" />
                                <img src="../assets/imgs/input-email.png" alt="">
                            </div>
                            <div class="editContact-input">
                                <input required id="newContactPhone" class="input-standard contact-phone"
                                    placeholder="Phone" type="tel" />
                                <img src="../assets/imgs/Input_Phone.png" alt="">
                            </div>
                        </div>
                        
                        <div class="buttons-editContact">
                            <button type="button" onclick="closeEditContact()" class="cancel btn-bright">
                                Cancel &nbsp; X
                            </button>
                            <button type="submit" class="btn-dark">
                                Save &nbsp;
                                <img src="../assets/imgs/check-white.png" />
                            </button>
                        </div>
                    </form>
                </div>
`
}

function contactsListTemplate(initial, contacts) {
    return `
        <div class="contact-container">
            <h3 class="letter-underline">${initial}</h3>
            ${contacts.map(contact => `
                <div class="contact-content" data-id="${contact.id}" data-initial="${contact.initials}">
                    <div class="name-circle" style="background-color: ${contact.bgcolor};">${contact.initials}</div>
                    <div class="name-email">
                        <h4 class="name-in-list">${contact.name}</h4>
                        <h5>${contact.email}</h5>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function contactDetailsTemplate(contact, initial) {
    return `
        <div class="contact-name">
            <div class="name-circle-sec" style="background-color: ${contact.bgcolor};">${initial}</div>
            <div class="name-container">
                <div class="name">${contact.name}</div>
                <div class="btns-container">
                    <button id="edit" onclick="openEditContact()">
                        <img src="../assets/imgs/edit.svg" alt="" class="edit-icon">
                        Edit
                    </button>
                    <button id="delete">
                        <img src="../assets/imgs/delete.svg" alt="" class="delete-icon">
                        Delete
                    </button>
                </div>
            </div>
        </div>
        <h2>Contact Information</h2>
        <h3>Email</h3>
        <a href="mailto:${contact.email}">${contact.email}</a>
        <h3>Phone</h3>
        <a href="tel:${contact.tel}">${contact.tel}</a>
    `;
}

// toggleDetailsContact(${contact.id});
// fetchContactDetails(${contact.id});
// onclick = "fetchContactDetails(${contact.id});