function checkNavigationVisibility() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navContainer = document.getElementById("div-navigation");

  if (!user) {
    navContainer.style.display = "none";
  } else {
    navContainer.style.display = "block"; // Setzt den ursprünglichen Wert zurück
    // Oder spezifisch: 'block', 'flex' etc. je nach Layout
  }
}

document.addEventListener("DOMContentLoaded", checkNavigationVisibility);
