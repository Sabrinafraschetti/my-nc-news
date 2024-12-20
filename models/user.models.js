const db = require("../db/connection")

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users;')
    .then(({ rows }) => {
      return rows;
    })
}

exports.checkIfAuthorExists = (author) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'User not found' });
      }
    });
};


exports.fetchUserByUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username])
  .then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: 'user does not exist' });
    }
    return rows[0]
  })
}