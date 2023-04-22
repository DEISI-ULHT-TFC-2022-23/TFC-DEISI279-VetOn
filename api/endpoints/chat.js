const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../models");

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

router.get("/clients", async (req, res) => {
  const clients = await db.User.find({});
  res.json(clients);
});

router.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserData(req);

  const messages = await db.Message.find({
    sender: { $in: [userId, userData.userId] },
    recipient: { $in: [userId, userData.userId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

module.exports = router;
