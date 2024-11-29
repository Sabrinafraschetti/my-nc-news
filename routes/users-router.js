const usersRouter = require("express").Router()
const { getUsers, getUsersByUsername } = require("../controllers/users.controller")

usersRouter
  .route("/")
  .get(getUsers)

usersRouter
 .route("/:username")
 .get(getUsersByUsername)

module.exports = usersRouter