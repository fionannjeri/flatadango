// Load data from db.json
let films = [];
let currentFilm;

async function loadData() {
  try {
    const response = await fetch('db.json');
    const data = await response.json();
    films = data.films;
    currentFilm = films[0];
    displayFirstFilm();
    displayFilmList();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function displayFirstFilm() {
  updateFilmDetails(currentFilm);
}

function displayFilmList() {
  const filmList = document.getElementById('films');
  if (filmList) {
    filmList.innerHTML = ''; // Clear any existing list items
    
    films.forEach(film => {
      const li = document.createElement('li');
      li.textContent = film.title;
      li.classList.add('film', 'item');
      if (film.capacity - film.tickets_sold === 0) {
        li.classList.add('sold-out');
      }
      
      li.addEventListener('click', () => {
        currentFilm = film;
        updateFilmDetails(film);
      });
      
      filmList.appendChild(li);
    });
  }
}

function updateFilmDetails(film) {
  const poster = document.getElementById('poster');
  const title = document.getElementById('title');
  const runtime = document.getElementById('runtime');
  const showtime = document.getElementById('showtime');
  const ticketNum = document.getElementById('ticket-num');
  const buyButton = document.getElementById('buy-ticket');

  if (poster) poster.src = film.poster;
  if (title) title.textContent = film.title;
  if (runtime) runtime.textContent = `${film.runtime} minutes`;
  if (showtime) showtime.textContent = film.showtime;
  if (ticketNum) ticketNum.textContent = film.capacity - film.tickets_sold;
  
  if (buyButton) {
    if (film.capacity - film.tickets_sold === 0) {
      buyButton.textContent = 'Sold Out';
      buyButton.disabled = true;
    } else {
      buyButton.textContent = 'Buy Ticket';
      buyButton.disabled = false;
    }
  }
}

function buyTicket() {
  if (currentFilm.tickets_sold < currentFilm.capacity) {
    currentFilm.tickets_sold++;
    updateFilmDetails(currentFilm);
    displayFilmList(); // Refresh the film list to update sold-out status
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  const buyButton = document.getElementById('buy-ticket');
  if (buyButton) {
    buyButton.addEventListener('click', buyTicket);
  }
});