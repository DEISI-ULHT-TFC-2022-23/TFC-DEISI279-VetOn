const express = require("express");
const router = express.Router();
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

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

router.post("/edit-email", async (req, res) => {
  const { email: newEmail } = req.body;
  const userData = await getUserData(req);

  try {
    const newUser = await db.User.findByIdAndUpdate(userData.userId, {
      email: newEmail,
    });

    jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      {},
      (error, token) => {
        if (error) {
          console.log(error);
        }
        res.cookie("token", token, { sameSite: "none", secure: true }).json({
          user_id: newUser._id,
          message: "Email alterado com sucesso",
        });
      }
    );
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/edit-username", async (req, res) => {
  const { username: newUsername } = req.body;
  const userData = await getUserData(req);

  try {
    const newUser = await db.User.findByIdAndUpdate(userData.userId, {
      username: newUsername,
    });

    res.cookie("token", "", { sameSite: "none", secure: true });
    jwt.sign(
      { userId: newUser._id, username: newUsername },
      process.env.JWT_SECRET,
      {},
      (error, token) => {
        if (error) {
          console.log(error);
        }
        res.cookie("token", token, { sameSite: "none", secure: true }).json({
          user_id: newUser._id,
          message: "Username alterado com sucesso",
        });
      }
    );
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/edit-password", async (req, res) => {
  const { currentPassword, password: newPassword } = req.body;
  const userData = await getUserData(req);

  try {
    const user = await db.User.findById(userData.userId);

    const correctPassword = bcrypt.compareSync(currentPassword, user.password);

    if (correctPassword) {
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      const newUser = await db.User.findByIdAndUpdate(userData.userId, {
        password: hashedPassword,
      });
      jwt.sign(
        { userId: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) {
            console.log(error);
          }
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            user_id: newUser._id,
            message: "Password alterada com sucesso",
          });
        }
      );
    } else {
      res.json({ error: "password atual incorreta" });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
