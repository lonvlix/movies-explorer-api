const moviesRouter = require('express').Router();

const {
  getSavedMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/movies', getSavedMovies);
moviesRouter.post('/movies', validateMovie, saveMovie);
moviesRouter.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;