const usersRouter = require('express').Router();

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', validateUserUpdate, updateUser);

module.exports = usersRouter;