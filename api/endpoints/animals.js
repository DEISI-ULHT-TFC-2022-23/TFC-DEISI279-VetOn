const express = require("express");
const router = express.Router();
const db = require("../models");
const jwt = require("jsonwebtoken");

async function getUserData(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, (error, userData) => {
        if (error) {
          throw error;
        }
        resolve(userData);
      });
    } else {
      reject("no token provided");
    }
  });
}

router.get("/animals", async (req, res) => {
  const animals = await db.Animal.find({});
  res.json({ animals: animals });
});

router.get("/user-animals", async (req, res) => {
  const userData = await getUserData(req);

  const animals = await db.Animal.find({ owner_id: userData.userId });
  res.json({ animals: animals });
});

router.post("/add-animal", async (req, res) => {
  const { name, type, race, weight, gender, birth_date, skin_type } = req.body;
  const userData = await getUserData(req);

  await db.Animal.create({
    name: name,
    type: type,
    race: race,
    weight: weight,
    gender: gender,
    birth_date: birth_date,
    skin_type: skin_type,
    owner_id: userData.userId,
  });
  res.json({ message: "Animal criado com sucesso" });
});

router.post("/edit-animal/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, race, weight, gender, birth_date, skin_type } = req.body;

  try {
    await db.Animal.findByIdAndUpdate(id, {
      name: name,
      type: type,
      race: race,
      weight: weight,
      gender: gender,
      birth_date: birth_date,
      skin_type: skin_type,
    });
    res.json({ message: "Animal editado com sucesso" });
  } catch (error) {
    res.json({ error: error });
  }
});

router.delete("/delete-animal/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.Animal.findByIdAndDelete(id);
    res.json({ message: "Animal eliminado com sucesso" });
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
