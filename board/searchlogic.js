/**
 * Input field for task search.
 * @type {HTMLInputElement}
 */
const searchInput = document.getElementById('findTask');

/**
 * List of task cards.
 * @type {NodeListOf<Element>}
 */
const taskCards = document.querySelectorAll('.task-card');

/**
 * Message displayed when no results are found.
 * @type {HTMLElement}
 */
const noResultsMessage = document.getElementById('no-results');

/**
 * Search icon element.
 * @type {HTMLElement}
 */
const searchIcon = document.querySelector('.search-icon');

/**
 * Filters task cards based on the search query.
 * Uses a timeout to simulate debounce behavior.
 * 
 * @param {string} searchQuery - The search query input by the user.
 */
function filterTaskCards(searchQuery) {
    setTimeout(() => {
        const taskCards = document.querySelectorAll('.task-card');  
        const resultsFound = processTaskCards(taskCards, searchQuery);
        updateNoResultsMessage(resultsFound); 
    }, 200); 
}


/**
 * Processes task cards and determines visibility based on the search query.
 * 
 * @param {NodeListOf<Element>} taskCards - Collection of task cards to filter.
 * @param {string} searchQuery - The search query input by the user.
 * @returns {boolean} - Returns true if at least one result is found, otherwise false.
 */
function processTaskCards(taskCards, searchQuery) {
    let resultsFound = false;

    taskCards.forEach(card => {
        const taskTitle = card.querySelector('.task-title')?.textContent.trim().toLowerCase(); 
        if (!taskTitle) return;
         
        const isMatch = taskTitle.includes(searchQuery);
        card.style.display = isMatch ? 'block' : 'none'; 
        if (isMatch) resultsFound = true;
    });

    return resultsFound;
}


/**
 * Updates the visibility of the "no results" message based on search results.
 * 
 * @param {boolean} resultsFound - Whether any matching task was found.
 */
function updateNoResultsMessage(resultsFound) {
    document.getElementById('no-results').style.display = resultsFound ? 'none' : 'block';
}


/**
 * Handles the search process when called.
 * Retrieves the input value, processes it, and updates the task display accordingly.
 */
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


/**
 * Handles keypress events in the search input.
 * Triggers the search when the Enter key is pressed.
 * 
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleEnterKeyPress(event) {
    console.log("🔍 Key pressed:", event.key, " | Code:", event.code); // Debugging log
    
    if (event.key === 'Enter' || event.code === 'Enter') {
        event.preventDefault(); // Prevents form submission
        console.log("✅ Enter key detected! Calling findTask...");
        findTask();
    }
}


/**
 * Sets up event listeners for search functionality.
 * Adds listeners for clicking the search icon and pressing Enter in the search input.
 */
function setupSearchEventListeners() {
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('findTask'); // Ensure it exists

    if (!searchIcon) return console.error("❌ searchIcon not found!"); // Debugging log
    if (!searchInput) return console.error("❌ searchInput not found!");

    searchIcon.addEventListener('click', () => {
        console.log("🖱️ Search icon clicked! Calling resetSearch...");
        resetSearch();
    });

    searchInput.addEventListener('keydown', handleEnterKeyPress);
}


/**
 * Resets the search input and restores visibility of all task cards.
 */
function resetSearch() {
    console.log("✅ resetSearch function is running..."); // Debugging log
    searchInput.value = '';
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => card.style.display = 'block');
    noResultsMessage.style.display = 'none';
}


// Initialize search event listeners
setupSearchEventListeners();

