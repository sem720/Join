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
function toggleDropdown() {
    const isOpen = dropdownContainer.classList.toggle("open");
    dropdownList.style.display = isOpen ? "block" : "none";
    dropdownBtn.querySelector("img").src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
  
    if (isOpen) {
      resetDropdown();
    }
}


/**
 * Handles the selection of a category from the dropdown.
 * Updates the dropdown button text and the selected category value.
 * 
 * @param {HTMLElement} option - The selected option element from the dropdown list.
 */
function selectCategory(option) {
    const selectedText = option.textContent;
    const selectedValue = option.getAttribute("data-value");
    
    updateDropdownHTML(selectedText);
  
    selectedCategory.value = selectedValue;
    console.log("🟢 Updated selected-category value:", selectedCategory.value);
    dropdownContainer.classList.remove("open");
    dropdownList.style.display = "none";

    clearError("#selected-category");
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
