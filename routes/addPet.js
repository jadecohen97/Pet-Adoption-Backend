const express = require("express");
const { pool, query } = require("../lib/database");
const SQL = require("@nearform/sql");
const router = express.Router();
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth");
const { uploadToCloudinary } = require("../lib/cloudinary");
const fs = require("fs");
const { upload } = require("../middlewares/multipart");
router.get("/", async (req, res) => {
  const petResults = await query(SQL`SELECT * FROM pets`);
  res.send({ pets: petResults });
});
router.post("/", auth, async (req, res) => {
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

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const petInfo = await query(SQL`SELECT * FROM pets WHERE id = ${id}`);
  res.send(petInfo[0]);
});

router.put("/picture/:id", auth, upload.single("image"), async (req, res) => {
  const result = await uploadToCloudinary(req.file.path);
  const id = req.params.id;
  const picture_url = result.secure_url;
  const updatePetPictureUrl = await query(
    SQL`UPDATE pets SET picture_url = ${picture_url} WHERE id =${id}`
  );
  fs.unlinkSync(req.file.path);
  res.send(picture_url);
});

router.post("/adopt/:id", auth, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user.id;
  const updateAdoptedPet = await query(
    SQL`UPDATE PETS SET adoptedBy =${userId}, adoption_Status='Adopted' WHERE id = ${petId}`
  );
  res.send(updateAdoptedPet);
});

router.post("/foster/:id", auth, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user.id;
  const updateFosteredPet = await query(
    SQL`UPDATE PETS SET fosteredBy = ${userId}, adoption_Status='Fostered' WHERE id = ${petId}`
  );
  res.send(updateFosteredPet);
});

router.post("/return/:id", auth, async (req, res) => {
  const petId = req.params.id;
  const returnPet = await query(
    SQL`UPDATE PETS SET fosteredBy = NULL, adoptedBy = NULL, adoption_Status='Available' WHERE id = ${petId}`
  );
  res.send(returnPet);
});

router.get("/user/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const usersPets = await query(
    SQL`SELECT * FROM pets WHERE adoptedBy = ${userId} or fosteredBy = ${userId}`
  );
  console.log("userid get adpt", userId);
  res.send(usersPets);
});

module.exports = router;

router.post("/save/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const petId = req.params.id;
  const savedPets = await query(SQL`INSERT INTO savedPets (
    savedBy,
    petId) VALUES (${userId}, ${petId})
  `);
  res.send({ savedPets, petId, userId });
});


router.get("/user/save/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const petId = req.params.id;
  const getSavedPets = await query(
    SQL`SELECT * FROM savedPets WHERE savedBy = ${userId} `
  );
  res.send(getSavedPets);
});

router.delete("/save/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const petId = req.params.id;
  const deleteSavedPet = await query(
    SQL`DELETE FROM savedPets WHERE savedBy = ${userId} AND petId = ${petId}`
  );
  res.send(deleteSavedPet);
});

router.get("/pet/:id", auth, async (req, res) => {
  const petId = req.params.id;
  const petInfo = await query(SQL`SELECT * FROM pets WHERE id = ${petId}`);
  res.send(petInfo);
});

router.get("/type/:type", async (req, res) => {
  const type = req.params.type;
  const string = `%${type}%`;
  const getPetType = await query(
    SQL`SELECT * FROM pets WHERE type LIKE ${string}`
  );
  res.send(getPetType);
});


