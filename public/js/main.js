/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Ranjan Kaduwal Student ID: 126578228 Date: 10th October, 2024
*
********************************************************************************/ 

let page = 1;
const perPage = 10;

// Function to load movies from the API
function loadMovies(title = null) {
    let url = `/api/movies?page=${page}&perPage=${perPage}`;
    if (title && title.trim() !== "") {
        url += `&title=${encodeURIComponent(title)}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#moviesTable tbody');
            
            // Check if there are any movies in the result
            if (data.length > 0) {
                tbody.innerHTML = data.map(movie => `
                    <tr data-id="${movie._id}">
                        <td>${movie.year}</td>
                        <td>${movie.title}</td>
                        <td>${movie.plot ? movie.plot : 'N/A'}</td>
                        <td>${movie.rated ? movie.rated : 'N/A'}</td>
                        <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
                    </tr>
                `).join('');
            } else {
                // If no movies are found, show a message in the table
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">No results found</td></tr>`;
            }

            // Update the pagination
            document.querySelector('#current-page').innerText = page;
        })
        .catch(err => console.error('Error loading movies:', err));
}

// Function to load movie details for the modal
function loadMovieDetails(movieId) {
    fetch(`/api/movies/${movieId}`)
        .then(res => res.json())
        .then(movie => {
            document.querySelector('#movieModalLabel').innerText = movie.title;
            document.querySelector('#moviePoster').src = movie.poster;
            document.querySelector('#movieDescription').innerText = movie.fullplot;
            document.querySelector('#movieDirector').innerText = movie.directors.join(', ');
            document.querySelector('#movieCast').innerText = movie.cast ? movie.cast.join(', ') : 'N/A';
            document.querySelector('#movieAwards').innerText = movie.awards.text;
            document.querySelector('#movieRating').innerText = `${movie.imdb.rating} (${movie.imdb.votes} votes)`;

            const modal = new bootstrap.Modal(document.getElementById('movieModal'));
            modal.show();
        })
        .catch(err => console.error('Error loading movie details:', err));
}

// Event listener for row clicks to show modal with movie details
document.querySelector('#moviesTable tbody').addEventListener('click', function (event) {
    const movieId = event.target.closest('tr').dataset.id;
    loadMovieDetails(movieId);
});

// Event listener for pagination buttons
document.getElementById('previous-page').addEventListener('click', () => {
    if (page > 1) {
        page--;
        loadMovies();
    }
});
document.getElementById('next-page').addEventListener('click', () => {
    page++;
    loadMovies();
});

// Event listener for search form submission
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    loadMovies(title); 
});

// Event listener for clear button
document.getElementById('clearForm').addEventListener('click', function () {
    document.getElementById('title').value = '';
    loadMovies();
});

// Load movies on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
});