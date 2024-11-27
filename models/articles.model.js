const db = require("../db/connection")

exports.fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: 'article does not exist' })
          }
          return rows[0];
        });
}

exports.fetchArticles = (author, topic, sort_by = "created_at", order = "desc") => {
    const validSortBy = ["created_at", "title", "topic", "author", "votes", "comment_count"]
    if (!validSortBy.includes(sort_by)){
        return Promise.reject({ status: 400, msg: "Bad request" })
    }

    const validOrderBy = ["asc", "desc"]
    if (!validOrderBy.includes(order)){
        return Promise.reject({ status: 400, msg: "Bad request" })
    }
    const queryValues = []

    let sqlQuery = `SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id `
  if (author){
    queryValues.push(author);
    sqlQuery += `WHERE articles.author = $1 `
  }
  if (topic) {
    queryValues.push(topic)
    if (queryValues.length === 1) {
      sqlQuery += ` WHERE articles.topic = $1`
    } else {
      sqlQuery += ` AND articles.topic = $2`
    }
  }

  sqlQuery += `
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}; `

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    // if (rows.length === 0) {
    //   return Promise.reject({ status: 404, msg: `not found` })
    // }
    return rows
  });
};

exports.checkIfArticleExists = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
    });
};

exports.updateArticleVotesById = (body, article_id) => {
  const { inc_votes } = body
  const values = [inc_votes, article_id]
  
  return db.query(`UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `, values)
    .then(({ rows }) => {
      return rows[0]
    })
}