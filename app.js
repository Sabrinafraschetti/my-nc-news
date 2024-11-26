const express = require("express")
const { getApi } = require("./controllers/api.controller")
const { getTopics } = require("./controllers/topics.controller")
const { getArticleById, getArticles, patchArticleVotesById } = require("./controllers/articles.controller")
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./errorHandling")
const { getCommentsByArticleId, postCommentById, deleteCommentById } = require("./controllers/comments.controller")
const { getUsers } = require("./controllers/users.controller")
const app = express()

app.use(express.json());

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentById)

app.patch("/api/articles/:article_id", patchArticleVotesById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)

app.use('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
})

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app
