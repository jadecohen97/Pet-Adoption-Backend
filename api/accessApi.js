// const { query } = require("../lib/database");
// const SQL = require("@nearform/sql");

// function addUser(first_name, last_name, email, phone_number, hash) {
//   return query(
//     SQL`INSERT INTO signup (first_name, last_name, email, phone_number, password_hash) VALUES (${first_name}, ${last_name}, ${email}, ${phone_number}, ${hash})`
//   );
// }
// exports.addUser = addUser;

// async function getUserByEmail(email) {
//   const rows = await query(SQL`SELECT * FROM signup WHERE email = ${email}`);
//   console.log(rows[0]);
//   return rows[0];
// }
// exports.getUserByEmail = getUserByEmail;
