/**
 * Adds a hover effect to a button.
 * 
 * @param {HTMLElement} button The button element to add the hover effect to.
 * @param {string} hoverSrc The source URL of the image to display on hover.
 * @param {string} defaultSrc The source URL of the default image to display.
 * 
 * @description This function adds a hover effect to a button by changing the source of the image inside the button.
 * 
 * @example
 * addHoverEffect(document.querySelector('.edit-icon').parentElement, '../assets/imgs/edit_blue.svg', '../assets/imgs/edit.svg');
 */
function addHoverEffect(button, hoverSrc, defaultSrc) {
    button.addEventListener('mouseover', function () {
        this.querySelector('img').src = hoverSrc;
    });

    button.addEventListener('mouseout', function () {
        this.querySelector('img').src = defaultSrc;
    });
}
addHoverEffect(document.querySelector('.edit-icon').parentElement, '../assets/imgs/edit_blue.svg', '../assets/imgs/edit.svg');
addHoverEffect(document.querySelector('.delete-icon').parentElement, '../assets/imgs/delete-blue.png', '../assets/imgs/delete.svg');