const Movie = require('../models/movie');
const {
  OK_CODE,
  CREATED_CODE,
} = require('../utils/constants');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getSavedMovies = (req, res, next) => Movie.find({ owner: req.user._id })
  .then((movies) => {
    if (!movies) {
      throw new NotFoundErr('Movies are not found');
    }
    return res.status(OK_CODE).send(movies);
  })
  .catch(next);

const saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((newMovie) => res.status(CREATED_CODE).send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Bad request. Incorrect data'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundErr('Movie not found');
      }
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenErr('No rights to delete. You can only delete your movies');
      }
      return Movie.deleteOne(movie)
        .then(() => res.status(OK_CODE).send(movie))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestErr('Bad request'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports = {
  getSavedMovies,
  saveMovie,
  deleteMovie,
};