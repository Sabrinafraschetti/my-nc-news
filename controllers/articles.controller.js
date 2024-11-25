const { fetchArticleById } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        console.log(article, "<--article")
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}
