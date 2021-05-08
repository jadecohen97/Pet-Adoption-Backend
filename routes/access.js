const express = require("express");
const { pool, query } = require("../lib/database");
const SQL = require("@nearform/sql");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  const results = await query(SQL`SELECT * FROM signup`);
  res.send({ signup: results });
});

router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password_hash,
  } = req.body;
  bcrypt.hash(password_hash, 10, async (err, hash) => {
    const sql = SQL`INSERT INTO signup (first_name, last_name, email, phone_number, password_hash) VALUES (${first_name}, ${last_name}, ${email}, ${phone_number}, ${hash})`;
    try {
      await query(sql);
    } catch (err) {
      return res
        .status(401)
        .send({ message: `cannot create user because: ${err.sqlMessage} ` });
    }
    res.send({
      signup: { first_name, last_name, email, phone_number },
    });
  });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await query(SQL`SELECT * FROM signup WHERE email = ${email}`);
    if (!user) {
      res.status(401).send({ message: "User not found with this email" });
    } else {
      bcrypt.compare(password, user[0].password_hash, (err, result) => {
        if (err) next(err);
        else {
          if (result) {
            const token = jwt.sign(
              { id: user[0].id },
              "joqwjibedvbadhe4hfneir"
            );
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
    }
  } catch (err) {
    res.status(401).send({ message: "incorrect email or password" });
  }
});

router.put("/user/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const {
    first_name,
    last_name,
    email,
    phone_number,
    bio,
    password_hash,
  } = req.body;
  bcrypt.hash(password_hash, 10, async (err, hash) => {
    const userInfo = await query(
      SQL`UPDATE signup SET first_name = ${first_name}, last_name =  ${last_name} , email = ${email}, phone_number=${phone_number}, bio = ${bio}, password_hash = ${hash}  WHERE id = ${userId}`
    );

    console.log("userinfo:", userInfo, req.body);
    res.send(req.body);
  });
});

router.get("/user/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const userInfo = await query(SQL`SELECT * FROM signup WHERE id = ${userId}`);
  console.log("userinfo:", userInfo);
  res.send(userInfo);
});

module.exports = router;
