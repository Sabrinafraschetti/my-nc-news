const articlesRouter = require("express").Router()

const { getArticleById, getArticles, patchArticleVotesById } = require("../controllers/articles.controller")
const { getCommentsByArticleId, postCommentById } = require("../controllers/comments.controller")

articlesRouter
    .route("/")
    .get(getArticles);

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleVotesById);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentById);

module.exports = articlesRouter;
