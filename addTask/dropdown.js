const selectedCategory = document.getElementById('selected-category');
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownList = document.getElementById('dropdown-list');
const dropdownContainer = document.querySelector('.dropdown-container');
const defaultText = "Select a category";

function toggleDropdown() {
    const isOpen = dropdownContainer.classList.toggle("open");
    dropdownList.style.display = isOpen ? "block" : "none";
    dropdownBtn.querySelector("img").src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
  
    if (isOpen) {
      resetDropdown();
    }
}
    
function selectCategory(option) {
    const selectedText = option.textContent;
    const selectedValue = option.getAttribute("data-value");
    
    dropdownBtn.innerHTML = `
      ${selectedText}
      <span class="icon-container">
        <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">
      </span>
    `;
  
    selectedCategory.value = selectedValue;
    console.log("🟢 Updated selected-category value:", selectedCategory.value);
    dropdownContainer.classList.remove("open");
    dropdownList.style.display = "none";

    console.log("✅ Selected Category Updated:", selectedCategory); 
  
    clearError("#selected-category");
}
  
function resetDropdown() {
    dropdownBtn.innerHTML = `
      ${defaultText}
      <span class="icon-container">
        <img src="/assets/imgs/dropdown-upwards.png" alt="Dropdown Icon" id="dropdown-icon">
      </span>
    `;
    selectedCategory.value = "";
}
  
  
  