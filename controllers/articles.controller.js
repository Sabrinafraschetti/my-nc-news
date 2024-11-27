const { fetchArticleById, fetchArticles, updateArticleVotesById, checkIfArticleExists } = require("../models/articles.model")
const { checkIfAuthorExists } = require("../models/user.models")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    const { author, topic, sort_by, order } = req.query
    const promises =  [fetchArticles(author, topic, sort_by, order)]

    if (author){
        promises.push(checkIfAuthorExists(author))
    }
    Promise.all(promises)
    .then(([articles]) => {
         res.status(200).send({ articles })
    }) 
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVotesById = (req, res, next) => {
    const { article_id } = req.params
    const body = req.body

      checkIfArticleExists(article_id)
      .then(() => {
        return updateArticleVotesById(body, article_id).then((article) => {
            res.status(200).send({ article })
        })
      })
    .catch((err) => {
        next(err)
    })
}
