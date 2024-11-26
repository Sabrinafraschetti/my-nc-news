const db = require("../db/connection")

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