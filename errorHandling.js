exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502'){
      res.status(400).send({ msg: 'Bad request' })
    } else if (err.code === '23503'){
      res.status(404).send({msg: 'Not found'})
    }
     else next(err)
  }

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({ msg: err.msg })
      } else next(err)
    }

exports.serverErrorHandler = (err, req, res) => {
    res.status(500).send({ msg: 'Internal Server Error' })
  }

