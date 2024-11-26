const { fetchArticleById, fetchArticles } = require("../models/articles.model")

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
    fetchArticles(author, topic, sort_by, order).then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
}
