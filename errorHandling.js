exports.psqlErrorHandler = (err, req, res, next) => {
    console.log(err.code)
    if (err.code === '22P02'){
      res.status(400).send({ msg: 'Bad request' })
    } else next(err)
  }

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({ msg: err.msg })
      } else next(err)
    }
  
exports.serverErrorHandler = (err, req, res) => {
    res.status(500).send({ msg: 'Internal Server Error' })
  }

