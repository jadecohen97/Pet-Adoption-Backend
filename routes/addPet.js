const express = require("express");
const { pool, query } = require("../lib/database");
const SQL = require("@nearform/sql");
const router = express.Router();
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  //     const id = req.user.id;
  //     const sql = SQL`SELECT * FROM pets WHERE id = ${id}`;
  //   await query(sql);
  //   if (signup.role !== 'admin') {
  //     res.status(403).send({ message: 'Only admin can get all products' });
  //     return;
  //   }
  //   const userId = req.user.id;
  //   console.log(userId);
  //   const sql = SQL`SELECT * FROM signup WHERE id = ${userId}`;
  const petResults = await query(SQL`SELECT * FROM pets`);
  //   const rows = await query(sql);
  // console.log("results", results);
  res.send({ pets: petResults });
});

router.post("/", auth, async (req, res) => {
  //   const { authorization } = req.headers;
  //   if (!authorization) {
  //     res.status(401).send({ message: "no authorization header" });
  //     return;
  //   }
  //   const token = authorization.replace("Bearer ", "");
  //   console.log(token);
  const {
    type,
    name,
    adoption_Status,
    picture_url,
    height,
    weight,
    color,
    bio,
    hypoallergenic,
    dietary_restrictions,
    breed,
  } = req.body;
  const id = uuid();
  const userId = req.user.id;
  // console.log("id:", id);
  // console.log("userId:", userId);
  const sql = SQL`INSERT INTO pets (
        id,
        type, 
        name, 
        adoption_Status, 
        picture_url,
        height,
        weight,
        color,
        bio,
        hypoallergenic,   
        dietary_restrictions,
        breed,
        userId
        ) VALUES (${id}, ${type}, ${name}, ${adoption_Status}, ${picture_url}, ${height},${weight},${color},${bio},${hypoallergenic},${dietary_restrictions},${breed}, ${userId})`;
  await query(sql);
  //   console.log(id);
  //   console.log(sql);
  res.send({
    pets: {
      id,
      type,
      name,
      adoption_Status,
      picture_url,
      height,
      weight,
      color,
      bio,
      hypoallergenic,
      dietary_restrictions,
      breed,
      userId,
    },
  });
});

// //WIP: ???
router.get("/:id", auth, async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  const petInfo = await query(SQL`SELECT * FROM pets WHERE id = ${id}`);
  console.log(petInfo[0]);
  res.send(petInfo[0]);
});

module.exports = router;
