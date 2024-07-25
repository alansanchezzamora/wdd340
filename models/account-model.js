const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *********************************
 *  Check for existing email
 *  Unit 4, Stickiness Activity
 * ******************************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountByID(account_id) {
  try {
  //create the query to be used, passing in the account_id
  const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
  return result.rows[0]       //sends the first record, from the result set returned by the query, back to where this function is called
  } catch (error) {           
  return new Error("No matching account found")     //error if it fails
  }
}
/* *****************************
* Update account data
* ***************************** */
async function updateAccount (
  account_firstname,
  account_lastname,
  account_email,
  account_id,
) {
  try {
  const sql = 
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
  const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
  ])
  return data.rows[0]
  } catch (error) {
      console.error("model error: " + error)
      return new Error("No matching account found")
  }
}

/* *****************************
* Update account data
* ***************************** */
async function updatePassword (
  account_id,
  account_password
) {
  try {
  const sql = 
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
  const data = await pool.query(sql, [
      account_password,
      account_id
  ])
  return data.rows[0]
  } catch (error) {
      console.error("model error: " + error)
      return new Error("Can not update password")
  }
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountByID, updateAccount, updatePassword };
