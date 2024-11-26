const { fetchCommentsById} = require("../models/comments.models")
const { checkIfArticleExists } = require("../models/articles.model")

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { sort_by, order } = req.query
    const promises = [fetchCommentsById(article_id, sort_by, order)]

    if (article_id) {
        promises.push(checkIfArticleExists(article_id))
    }

    Promise.all(promises)
    .then(([comments]) => {
    res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}