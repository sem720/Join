function openAddContactTemp() {
    return `    
                <div class="addContact-titles">
                    <img src="../assets/imgs/logo-white-blue.png" />
                    <h1>Add Contact</h1>
                    <p>Tasks are better with a team!</p>
                    <div class="blue-line"></div>
                </div>

                <div class="addContact-container">
                    <div class="close" onclick="closeAddContact()">x</div>
                    <div>
                        <img class="contact-image" src="../assets/imgs/add-contact.png" />
                    </div>
                    <form class="addContact-content" onsubmit="">
                        <div class="inputs-container">
                            <div class="addContact-input">
                                <input required id="newContactName" class="input-standard contact-name"
                                    placeholder="Name" type="text" />
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
                            <button type="button" onclick="closeAddContact()" class="btn-bright">
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

function openEditContactTemp() {
    return `    
                <div class="editContact-titles">
                    <img src="../assets/imgs/logo-white-blue.png" />
                    <h1>Edit Contact</h1>
                    <div class="blue-line"></div>
                </div>

                <div class="editContact-container">
                    <div class="close" onclick="closeEditContact()">x</div>
                    <div>
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
                            <button type="button" onclick="closeEditContact()" class="btn-bright">
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