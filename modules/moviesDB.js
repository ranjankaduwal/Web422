const mongoose = require('mongoose');

// Define the Movie schema
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    plot: String,
    fullplot: String,
    rated: String,
    runtime: Number,
    poster: String,
    directors: [String],
    cast: [String],
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    },
    imdb: {
        rating: Number,
        votes: Number
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = class MoviesDB {
    async initialize(connectionString) {
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async getAllMovies(page, perPage, title) {
        const skip = (page - 1) * perPage;
        let query = {};
        if (title) {
            query.title = { $regex: title, $options: 'i' }; 
        }
        const movies = await Movie.find(query).skip(skip).limit(perPage).sort({ year: 1 });
        return movies;
    }

    async getMovieById(id) {
        return Movie.findById(id);
    }
};