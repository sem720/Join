function displayInitials() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name) {
    const initials = user.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2);

    document.getElementById("render-profile").innerText =
      initials.toUpperCase();
  } else {
    document.getElementById("render-profile").innerText = "G";
  }
}

function initNavbar() {
  displayInitials();
}

//Toggle Menu

function toggleMenu() {
  const menu = document.getElementById("menu");

  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
  } else {
    menu.classList.add("hidden");
  }
}

// Log out function

function logout() {
  localStorage.removeItem("user");

  window.location.href = "../index.html";
}
