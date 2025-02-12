function openAddContactTemp() {
    return `
            <div class="addContact" id="addContact">
                <div class="addContact-titles">
                    <img src="../assets/imgs/logo-white-blue.png" />
                    <h1>Add Contact</h1>
                    <p>Tasks are better with a team</p>
                    <div class="blue-line"></div>
                </div>
                <div class="addContact-container">
                    <div class="close" onclick="closeAddContact()">x</div>
                    <div class="addContact-content">
                        <div>
                            <img class="contact-image" src="../assets/imgs/add-contact.png" />
                        </div>
                        <form class="contact-form" onsubmit="">
                            <div class="inputs-container">
                                <input required id="newContactName" class="input-standard addContact-input contact-name"
                                    placeholder="Name" type="text" />
                                <input required id="newContactEmail"
                                    class="input-standard addContact-input contact-email" placeholder="Email"
                                    type="email" />
                                <input required id="newContactPhone"
                                    class="input-standard addContact-input contact-phone" placeholder="Phone"
                                    type="number" />
                            </div>
                    </div>
                    <div class="buttons-addContact">
                        <button type="button" onclick="closeAddContact()" class="btn-bright">
                            Cancel &nbsp; x
                        </button>
                        <button type="submit" class="btn-dark">
                            Create Contact &nbsp;
                            <img src="../assets/imgs/check-white.png" />
                        </button>
                    </div>
                    </form>
                </div>
            </div>
`
}