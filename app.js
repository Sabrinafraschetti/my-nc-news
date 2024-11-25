const express = require("express")
const { getApi } = require("./controllers/app.controller")
const { getTopics } = require("./controllers/topics.controller")
const app = express()

app.use((req, res, next) => 
    next()
)

app.get("/api", getApi)

app.get("/api/topics", getTopics)



app.use('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
})

app.use((err, req, res, next) => {
    if (err.status){
      res.status(err.status).send({ msg: err.msg })
    } else next(err)
  })
  
  app.use((err, req, res, next) => {
    //console.log(err.code)
    if (err.code){
      res.status(400).send({ msg: 'Bad request' })
    } else next(err)
  })
  
  app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' })
  })

module.exports = app
