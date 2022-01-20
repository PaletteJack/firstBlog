let currentTheme = localStorage.getItem("darkMode");

const body = document.querySelector('body');
const footer = document.querySelector('footer');
const nav = document.querySelector('nav');

if (currentTheme === 'enabled') {
  body.classList.add("dark-bg");
  nav.classList.replace('navbar-light', 'navbar-dark');
  footer.classList.replace('bg-light', 'bg-dark');
  nav.classList.replace('bg-light', 'bg-dark');
}

document.querySelector('#dmSwitch').addEventListener('click', () => {
  if (!document.querySelector('body').classList.contains('transit')) {
    document.querySelector('body').classList.add("transit");
    document.querySelector('nav').classList.add("transit");
    document.querySelector('footer').classList.add("transit");
  }

  body.classList.toggle('dark-bg');
  footer.classList.toggle('bg-light');
  footer.classList.toggle('bg-dark');
  nav.classList.toggle('bg-light');
  nav.classList.toggle('bg-dark');
  nav.classList.toggle('navbar-dark');
  nav.classList.toggle('navbar-light');

  if (body.classList.contains('dark-bg')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});
