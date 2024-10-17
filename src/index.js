// Global variables
let currentFilm;
const baseUrl = 'http://localhost:3000';

// Function to fetch and display the first film
async function displayFirstFilm() {
  const response = await fetch(`${baseUrl}/films/1`);
  currentFilm = await response.json();
  updateFilmDetails(currentFilm);
}

// Function to fetch and display all films
async function displayFilmList() {
  const response = await fetch(`${baseUrl}/films`);
  const films = await response.json();
  const filmList = document.getElementById('films');
  filmList.innerHTML = ''; // Clear any existing list items
  
  films.forEach(film => {
    const li = document.createElement('li');
    li.textContent = film.title;
    li.classList.add('film', 'item');
    if (film.capacity - film.tickets_sold === 0) {
      li.classList.add('sold-out');
    }
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteFilm(film.id));
    
    li.appendChild(deleteButton);
    filmList.appendChild(li);
  });
}

// Function to update film details in the DOM
function updateFilmDetails(film) {
  document.getElementById('poster').src = film.poster;
  document.getElementById('title').textContent = film.title;
  document.getElementById('runtime').textContent = `${film.runtime} minutes`;
  document.getElementById('showtime').textContent = film.showtime;
  document.getElementById('ticket-num').textContent = film.capacity - film.tickets_sold;
  
  const buyButton = document.getElementById('buy-ticket');
  if (film.capacity - film.tickets_sold === 0) {
    buyButton.textContent = 'Sold Out';
    buyButton.disabled = true;
  } else {
    buyButton.textContent = 'Buy Ticket';
    buyButton.disabled = false;
  }
}

// Function to handle ticket purchase
async function buyTicket() {
  if (currentFilm.tickets_sold < currentFilm.capacity) {
    currentFilm.tickets_sold++;
    
    // Update server
    await fetch(`${baseUrl}/films/${currentFilm.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold }),
    });
    
    // Post new ticket
    await fetch(`${baseUrl}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        film_id: currentFilm.id,
        number_of_tickets: 1,
      }),
    });
    
    updateFilmDetails(currentFilm);
    displayFilmList(); // Refresh the film list to update sold-out status
  }
}

// Function to delete a film
async function deleteFilm(id) {
  await fetch(`${baseUrl}/films/${id}`, { method: 'DELETE' });
  displayFilmList(); // Refresh the film list
  if (currentFilm.id === id) {
    displayFirstFilm(); // If the current film was deleted, show the first available film
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  displayFirstFilm();
  displayFilmList();
  document.getElementById('buy-ticket').addEventListener('click', buyTicket);
});