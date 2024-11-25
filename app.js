const express = require("express")
const { getApi } = require("./controllers/app.controller")
const { getTopics } = require("./controllers/topics.controller")
const { getArticleById } = require("./controllers/articles.controller")
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./errorHandling")
const app = express()


app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)



app.use('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
})

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app
