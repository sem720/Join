/**
 * Navigates the browser back to the previous page.
 *
 * This function uses the `window.history.back()` method to navigate the browser back to the previous page.
 * If the previous page is not available in the browser's history, the function will not throw an error.
 *
 * @function toggleBack
 * @global
 */
function toggleBack() {
  window.history.back();
}
