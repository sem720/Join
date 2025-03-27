function checkNavigationVisibility() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navContainer = document.getElementById("div-navigation");
  const navConOut = document.getElementById("div-nav-out");

  if (!user) {
    navContainer.style.display = "none";
    navConOut.style.display = "flex";
  } else {
    navContainer.style.display = "flex";
    navConOut.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", checkNavigationVisibility);
