const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK_CODE,
  CREATED_CODE,
} = require('../utils/constants');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');

const { JWT_SECRET, NODE_ENV } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((newUser) => {
          const { _id } = newUser;
          res.status(CREATED_CODE).send({
            name, email, _id,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictErr('The user with this email is already registered'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestErr('Bad request. Incorrect data'));
          }
          return next(err);
        });
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('User not found');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('User not found');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictErr('The user with this email is already registered'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Bad request. Incorrect data'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};