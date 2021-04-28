const express = require("express");
const { pool, query } = require("../lib/database");
const SQL = require("@nearform/sql");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const results = await query(SQL`SELECT * FROM signup`);
  res.send({ signup: results });
  console.log(results);
});

router.post("/", async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password_hash,
  } = req.body;
  bcrypt.hash(password_hash, 10, async (err, hash) => {
    if (err) next(err);
    else {
      const sql = SQL`INSERT INTO signup (first_name, last_name, email, phone_number, password_hash) VALUES (${first_name}, ${last_name}, ${email}, ${phone_number}, ${hash})`;
      await query(sql);
      res.send({
        signup: { first_name, last_name, email, phone_number },
      });
    }
  });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await query(SQL`SELECT * FROM signup WHERE email = ${email}`);
  if (!user) {
    res.status(404).send("User not found with this email");
    return;
  }
  bcrypt.compare(password, user[0].password_hash, (err, result) => {
    if (err) next(err);
    else {
      if (result) {
        const token = jwt.sign({ id: user[0].id }, "joqwjibedvbadhe4hfneir");
        res.send({
          token,
          user: {
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            email: user[0].email,
            phone_number: user[0].phone_number,
            id: user[0].id,
          },
        });
      } else {
        res.status(401).send({ message: "incorrect email or password" });
      }
    }
  });
});

module.exports = router;
