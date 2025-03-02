function executeWithLoadingState(actionFunction) {
  const buttons = document.querySelectorAll("button");

  buttons.forEach((button) => (button.disabled = true));

  const result = actionFunction();

  if (result instanceof Promise) {
    result.finally(() => {
      buttons.forEach((button) => (button.disabled = false));
    });
  } else {
    buttons.forEach((button) => (button.disabled = false));
  }
}

function attachLoadingStateToButtons() {
  document.querySelectorAll("button:not(.no-loading)").forEach((button) => {
    console.log("Checking button:", button, "Has no-loading class?", button.classList.contains("no-loading"));
    console.log("✅ Applying loading state to:", button); // Debugging Log
    const originalOnClick = button.onclick;

    if (originalOnClick) {
      button.onclick = function (event) {
        event.preventDefault();
        executeWithLoadingState(() => originalOnClick.call(button, event));
      };
    }
  });
}


window.addEventListener("DOMContentLoaded", attachLoadingStateToButtons);
