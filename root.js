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
  document.querySelectorAll("button").forEach((button) => {
    const originalOnClick = button.onclick;
    button.onclick = function (event) {
      if (originalOnClick) {
        event.preventDefault();
        const result = originalOnClick.call(button, event);
        
        if (result instanceof Promise) {
          executeWithLoadingState(() => result);
        }
      }
    };
  });
}

window.addEventListener("DOMContentLoaded", attachLoadingStateToButtons);
