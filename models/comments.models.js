const db = require("../db/connection")
const format = require("pg-format");

exports.fetchCommentsById = (article_id, sort_by = "created_at", order = 'desc') => {
    const validSortBy = ["created_at", "author", "votes"]
    if (!validSortBy.includes(sort_by)){
        return Promise.reject({ status: 400, msg: "Bad request" })
    }

    const validOrderBy = ["asc", "desc"]
    if (!validOrderBy.includes(order)){
        return Promise.reject({ status: 400, msg: "Bad request" })
    }
    const queryValues = [article_id]

    let sqlQuery = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE comments.article_id = $1`

    sqlQuery += `
    ORDER BY ${sort_by} ${order}; `

    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        return rows
  })
}

exports.addCommentById = (commentBody, article_id) => {
    const { username, body } = commentBody
    const values = [body, article_id, username]

    return db.query(`
        INSERT INTO comments (body, article_id, author)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, values)
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.checkIfCommentExists = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: 'Comment not found' });
        }
      })
  }

  exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
  }
