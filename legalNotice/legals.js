function checkNavigationVisibility() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navContainer = document.getElementById("div-navigation");

  if (!user) {
    navContainer.style.display = "none";
    navConOut.style.display = "block";
  } else {
    navContainer.style.display = "block";
    navConOut.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", checkNavigationVisibility);
