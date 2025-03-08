const searchInput = document.getElementById('findTask');
const taskCards = document.querySelectorAll('.task-card');
const noResultsMessage = document.getElementById('no-results');
const searchIcon = document.querySelector('.search-icon');


function filterTaskCards(searchQuery) {
    setTimeout(() => {
      const taskCards = document.querySelectorAll('.task-card');  
      const resultsFound = processTaskCards(taskCards, searchQuery);
      updateNoResultsMessage(resultsFound); 
    }, 200); 
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
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach(card => card.style.display = 'block');
        noResultsMessage.style.display = 'none';
        return;
    }

    filterTaskCards(searchQuery); // Call filterTaskCards to handle filtering
}


function setupSearchEventListeners() {
    const searchIcon = document.getElementById('search-icon');
    if (!searchIcon) {
        console.error("❌ searchIcon not found!"); // Debugging log
        return;
    }

    console.log("✅ searchIcon found! Adding click event listener...");
    
    searchIcon.addEventListener('click', () => {
        console.log("🖱️ Search icon clicked! Calling resetSearch...");
        resetSearch();
    });
}


function resetSearch() {
    console.log("✅ resetSearch function is running..."); // Debugging log
    searchInput.value = '';
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => card.style.display = 'block');
    noResultsMessage.style.display = 'none';
}
  
  // Call the function to set up event listeners
setupSearchEventListeners();