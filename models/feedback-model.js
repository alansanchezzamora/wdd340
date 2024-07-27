const pool = require("../database/");

/* *****************************
 *   Register new classification
 * *************************** */
async function addBug(user_name, bug_text) {
  try {
    const sql =
      "INSERT INTO bugs (user_name, bug_text) VALUES ($1, $2) RETURNING *";
    return await pool.query(sql, [user_name, bug_text]);
  } catch (error) {
    return error.message;
  }
}

module.exports = { addBug };
