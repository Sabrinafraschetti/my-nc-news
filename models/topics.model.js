const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

exports.checkIfTopicExists = (topics) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topics])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: 'Topic not found' });
        }
      });
  };