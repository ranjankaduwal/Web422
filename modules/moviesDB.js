const mongoose = require('mongoose');

// Define the schema for the Movie collection
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    plot: String,
    rated: String,
    poster: String,
    genres: [String]
});

// Create a Movie model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = class MoviesDB {
    constructor() {
        this.Movie = null;
    }

    // Initialize the database connection
    async initialize(connectionString) {
        await mongoose.connect(connectionString);
        this.Movie = Movie;
    }

    // Add a new movie to the collection
    async addNewMovie(data) {
        const newMovie = new this.Movie(data);
        return newMovie.save();
    }

    // Get all movies with pagination and optional title filtering
    async getAllMovies(page, perPage, title) {
        let findByTitle = {};
        if (title) {
            findByTitle = { title: new RegExp(title, 'i') };
        }
        const movies = await this.Movie.find(findByTitle)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ year: 1 });
        return movies;
    }

    // Get a single movie by ID
    async getMovieById(id) {
        return this.Movie.findById(id);
    }

    // Update a movie by ID
    async updateMovieById(data, id) {
        return this.Movie.updateOne({ _id: id }, { $set: data });
    }

    // Delete a movie by ID
    async deleteMovieById(id) {
        return this.Movie.deleteOne({ _id: id });
    }
};
