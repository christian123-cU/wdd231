// navigation.js
// Toggles the hamburger icon AND the nav visibility on small screens.

const navButton = document.querySelector('#nav-button');
const navBar = document.querySelector('#nav-bar');

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');  // switches ☰ ↔ ×
  navBar.classList.toggle('show');     // shows/hides the nav links
});
