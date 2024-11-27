const { fetchCommentsById, addCommentById, checkIfCommentExists, removeCommentById} = require("../models/comments.models")
const { checkIfArticleExists } = require("../models/articles.model")
const { checkIfUserExists } = require("../models/user.models")

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


exports.postCommentById = (req, res, next) => {
    const { body: commentBody } = req;
    const { article_id } = req.params;
  
    checkIfArticleExists(article_id)
      .then(() => {
        return addCommentById(commentBody, article_id);
      })
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
        next(err)
      });
  };

  exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params

    checkIfCommentExists(comment_id)
      .then(() => {
        return removeCommentById(comment_id).then(() => {
            res.status(204).send()
        })
      })
    .catch((err) => {
        next(err)
    })
}