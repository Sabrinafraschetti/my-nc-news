const express = require("express")
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./errorHandling")
const app = express()
const apiRouter = require("./routes/api-router")

app.use(express.json());

app.use("/api", apiRouter);

app.use('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
})

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app
