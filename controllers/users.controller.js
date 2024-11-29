const { fetchUsers, fetchUserByUsername } = require("../models/user.models")
 
exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUsersByUsername = (req, res, next) => {
    const { username } = req.params
    fetchUserByUsername(username).then((user) => {
        res.status(200).send({ user })
    })
    .catch((err) => {
        next(err)
    })
}