function dateInput() {
    const dateInput = document.getElementById("due-date");
  
    if (!dateInput) {
      console.error("Element with ID 'due-date' not found.");
      return; // Exit if the element is missing
    }
  
    dateInput.addEventListener("input", function () {
      if (dateInput.value) {
        dateInput.classList.add("has-value"); 
      } else {
        dateInput.classList.remove("has-value"); 
      }
    });
}
  
function setupDateReset() {
    const dateInput = document.getElementById("due-date");
    if (dateInput) {
      dateInput.addEventListener('click', (event) => handleDateReset(event, dateInput));
    }
}
  
function handleDateReset(event, input) {
    if (iconClicked(event, input)) {
       setTimeout(() => resetDateInput(input), 0);
    }
}
  
function iconClicked(event, input) {
    const rect = input.getBoundingClientRect();
    return event.clientX > rect.right - 30;
}
  
  
  
  
  
  
  
  