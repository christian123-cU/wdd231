// navigation.js
// Grabs the hamburger button and toggles the 'show' class
// on both the button (to switch the icon) and the nav (to show/hide links).

const navButton = document.querySelector('#nav-button');
const nav = document.querySelector('nav');

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
  nav.classList.toggle('show');
});
