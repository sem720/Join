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


function toggleEditDeleteMenu() {
    const menu = document.getElementById('editDeleteMenu');
    if (!menu.classList.contains('active')) {
        menu.classList.add('active');
        menu.style.display = 'flex';
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
        menu.style.display = 'none';
    }, 500);
    document.removeEventListener('click', closeMenuOnClickOutside);
}

function closeMenuOnClickOutside(event) {
    const menu = document.getElementById('editDeleteMenu');
    const moreBtn = document.getElementById('moreBtn');

    if (!menu.contains(event.target) && !moreBtn.contains(event.target)) {
        closeMenu();
    }
}