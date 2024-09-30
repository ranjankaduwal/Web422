/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ranjan Kaduwal Student ID: 126578228 Date: 30th September, 2024
*  Githun Link: https://github.com/ranjankaduwal/Web422.git
*
********************************************************************************/ 

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const MoviesDB = require('./modules/moviesDB.js');
const app = express();
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Test route to check if the API is running
app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

// Route to add a new movie
app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body).then((newMovie) => {
        res.status(201).json(newMovie);
    }).catch(err => res.status(500).json({ error: err.message }));
});

// Route to get all movies (with pagination & optional title filtering)
app.get('/api/movies', (req, res) => {
    const { page = 1, perPage = 5, title } = req.query;
    db.getAllMovies(page, perPage, title).then((movies) => {
        res.json(movies);
    }).catch(err => res.status(500).json({ error: err.message }));
});

// Route to get a movie by ID
app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id).then((movie) => {
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ error: "Movie not found" });
        }
    }).catch(err => res.status(500).json({ error: err.message }));
});

// Route to update a movie by ID
app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id).then(() => {
        res.status(204).end();
    }).catch(err => res.status(500).json({ error: err.message }));
});

// Route to delete a movie by ID
app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id).then(() => {
        res.status(204).end();
    }).catch(err => res.status(500).json({ error: err.message }));
});

// Initialize the DB and start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server running on port ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
