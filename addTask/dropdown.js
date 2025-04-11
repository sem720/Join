/**
 * The selectedCategory element that holds the current selected category value.
 * @type {HTMLInputElement}
 */
const selectedCategory = document.getElementById('selected-category');

/**
 * The dropdown button element that toggles the dropdown visibility.
 * @type {HTMLElement}
 */
const dropdownBtn = document.querySelector('.dropdown-btn');

/**
 * The dropdown list element containing all available options.
 * @type {HTMLUListElement}
 */
const dropdownList = document.getElementById('dropdown-list');

/**
 * The container that wraps the dropdown and controls its visibility.
 * @type {HTMLElement}
 */
const dropdownContainer = document.querySelector('.dropdown-container');

/**
 * The default placeholder text shown when no category is selected.
 * @type {string}
 */
const defaultText = "Select task category";


/**
 * Toggles the visibility of the dropdown list and updates the dropdown button icon.
 * When the dropdown is opened, it resets the selected category.
 */
function toggleDropdown(event) {
  event.stopPropagation();
  if (!dropdownContainer.classList.contains("open")) resetDropdown(); ; 
  
  const isOpen = toggleDropdownState();
  const iconImg = dropdownBtn.querySelector("img");
  const newSrc = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
  
  iconImg ? iconImg.src = newSrc : (() => { throw new Error('Icon image element not found'); })();

  setTimeout(checkFormValidity, 1);
  disableCreateButton();
}


/**
 * Handles the selection of a category from the dropdown.
 * Updates the dropdown button text and the selected category value.
 * 
 * @param {HTMLElement} option - The selected option element from the dropdown list.
 */
function selectCategory(option) {
  document.getElementById("selected-category").value = option.getAttribute("data-value");
  updateDropdownHTML(option.textContent);
  document.querySelector(".dropdown-container").classList.remove("open");
  document.getElementById("dropdown-list").style.display = "none";

  clearError("#selected-category");
  checkFormValidity();
}


/**
 * Updates the dropdown button's inner HTML to display the selected category.
 * 
 * @param {string} selectedText - The text of the selected category option.
 */
function updateDropdownHTML(selectedText) {
  dropdownBtn.innerHTML = `
    ${selectedText}
    <span class="icon-container">
      <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">
    </span>
  `;
}
  

/**
 * Resets the dropdown to its default state, showing the default text and clearing the selected category.
 */
function resetDropdown() {
    dropdownBtn.innerHTML = `
      ${defaultText}
      <span class="icon-container">
        <img src="/assets/imgs/dropdown-upwards.png" alt="Dropdown Icon" id="dropdown-icon">
      </span>
    `;
    selectedCategory.value = "";
}


/**
 * Toggles the dropdown state (open/close).
 * @returns {boolean} - The new state of the dropdown (open or closed).
 */
function toggleDropdownState() {
  const isOpen = dropdownContainer.classList.toggle("open");
  dropdownList.style.display = isOpen ? "block" : "none";
  return isOpen;
}



