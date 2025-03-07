const searchInput = document.getElementById('findTask');
const taskCards = document.querySelectorAll('.task-card');
const noResultsMessage = document.getElementById('no-results');
const searchIcon = document.getElementById('search-icon');


function filterTaskCards(searchQuery) {
    setTimeout(() => {
      const taskCards = document.querySelectorAll('.task-card');  // Refresh task cards after rendering
      const resultsFound = processTaskCards(taskCards, searchQuery);
      updateNoResultsMessage(resultsFound); // Update the no results message based on the results found
    }, 200); // Wait 200ms after rendering before starting filtering
}


function processTaskCards(taskCards, searchQuery) {
    let resultsFound = false;

    taskCards.forEach(card => {
        const taskTitle = card.querySelector('.task-title')?.textContent.trim().toLowerCase(); 
        if (!taskTitle) return;
         
        const isMatch = taskTitle.includes(searchQuery);
        card.style.display = isMatch ? 'block': 'none'; // Show or hide task card based on search query
        if (isMatch) resultsFound = true;
    });

    return resultsFound;
}


function updateNoResultsMessage(resultsFound) {
    document.getElementById('no-results').style.display = resultsFound ? 'none' : 'block';
}


function findTask() {
    const searchQuery = searchInput.value.trim().toLowerCase();
    console.log("Search Term: ", searchQuery); // Debugging: Log the search term
    
    // If input is cleared, reset search
    if (searchQuery === '') {
        console.log('Search input cleared, showing all tasks'); 
        resetSearch(); // Reset instead of manually looping
        return;
    }

    filterTaskCards(searchQuery); // Call filterTaskCards to handle filtering
}


function setupSearchEventListeners() {
    // Event listener to handle input changes in real-time
  searchInput.addEventListener('input', () => {
    console.log("Input Event Triggered"); // Debugging
    findTask(); // Call findTask() to filter tasks as the user types
  });

  searchIcon.addEventListener('click', resetSearch);  
  console.log(resetSearch, "happening");
}


function resetSearch() {
    searchInput.value = '';
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => card.style.display = 'block');
    noResultsMessage.style.display = 'none';
}
  
  // Call the function to set up event listeners
  setupSearchEventListeners();
