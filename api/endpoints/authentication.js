const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");

const salt = bcrypt.genSaltSync(10);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

const sendResetEmail = (id, email) => {
  const url = "http://127.0.0.1:5173";

  const uniqueString = uuidv4() + id;

  const mailOptions = {
    from: "veton.verify.users@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `<p>Pediste para redefinir a password da tua conta no site da VetOn</p><p><b>Este link expira em 6 horas</b></p><p>Clica aqui <a href=${
      url + "/reset-password/" + id + "/" + uniqueString
    }>link</a> para a redefinires</p>`,
  };

  bcrypt.hash(uniqueString, salt).then(async (hashedUniqueString) => {
    await db.ResetVerification.create({
      userId: id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
    });

    transporter.sendMail(mailOptions);
  });
};

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const createdUser = await db.User.create({
      type: "user",
      email,
      username,
      password: hashedPassword,
    });

    jwt.sign(
      { userId: createdUser._id, username },
      process.env.JWT_SECRET,
      {},
      (error, token) => {
        if (error) {
          console.log(error);
        }
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .json({ user_id: createdUser._id });
      }
    );
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email === 1) {
        res.json({ error: "Existe uma conta com o email " + email });
      } else if (error.keyPattern.username === 1) {
        res.json({ error: "Existe uma conta com o username " + username });
      }
    }
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.User.findOne({ username });

  if (user) {
    const correctPassword = bcrypt.compareSync(password, user.password);

    if (correctPassword) {
      jwt.sign(
        { userId: user._id, username },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) {
            console.log(error);
          }
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            user_id: user._id
          });
        }
      );
    }
  }
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", { sameSite: "none", secure: true })
    .json("Logged out");
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ email: email });
    if (user) {
      const userId = user._id;
      const userEmail = user.email;
      sendResetEmail(userId, userEmail);
      res.json({ message: "Email enviado" });
    } else {
      res.json({ error: "Nao existe conta com o email " + email });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/reset-password/:id/:uniqueString", async (req, res) => {
  const userId = req.params.id;
  const uniqueString = req.params.uniqueString;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const verification = await db.ResetVerification.findOne({ userId: userId });
    if (verification) {
      bcrypt.compare(uniqueString, verification.uniqueString).then((result) => {
        if (result) {
          db.User.updateOne({ _id: userId }, { password: hashedPassword }).then(
            () => {
              db.ResetVerification.deleteOne({ userId });
            }
          );
          res.json({ message: "Password redefinida com sucesso" });
        } else {
          res.json({ error: "Verificacao invalida" });
        }
      });
    } else {
      res.json({ error: "Nao foi enviado o email de verificacao" });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
