const express = require("express");
const router = express.Router();
const db = require("../models");
const jwt = require("jsonwebtoken");

router.get("/users", async (req, res) => {
  const users = await db.User.find({});
  res.json({ users: users });
});

router.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  const user = await db.User.findOne({ username: username });
  res.json(user);
});

router.get("/user-data", (req, res) => {
  const token = req.cookies?.token;

  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, (error, userData) => {
        if (error) {
          throw error;
        }
        res.json(userData);
      });
    }
  } catch (error) {
    if (error) {
      throw error;
    }
    res.status(401).json("no token provided");
  }
});

module.exports = router;
