// navigation.js — responsive hamburger menu toggle

const navButton = document.querySelector('#nav-button');
const navBar = document.querySelector('#nav-bar');

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');  // switches ☰ ↔ ×
  navBar.classList.toggle('show');     // shows / hides nav links
});
