const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const parser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const ws = require("ws");
const fs = require("fs");
const db = require("../api/models");

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT,
  })
);
app.use(parser());
app.use("/uploads", express.static(__dirname + "/uploads"));
const salt = bcrypt.genSaltSync(10);
mongoose.connect(process.env.MONGO_URL);

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

app.get("/test", (req, res) => {
  res.json("ok");
});

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await db.User.create({
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
          throw error;
        }
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({ user_id: createdUser._id });
      }
    );
  } catch (error) {
    if (error) {
      throw error;
    }
    res.status(500).json("Utilizador nao foi criado");
  }
});

app.post("/login", async (req, res) => {
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
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            user_id: user._id,
          });
        }
      );
    } else {
      res.status(422).json("Utitlizador ou password incorretas");
    }
  } else {
    res.status(422).json("Utitlizador ou password incorretas");
  }
});

app.get("/user-data", (req, res) => {
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

app.get("/clients", async (req, res) => {
  const clients = await db.User.find({}, { _id: 1, username: 1 });
  res.json(clients);
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserData(req);

  const messages = await db.Message.find({
    sender: { $in: [userId, userData.userId] },
    recipient: { $in: [userId, userData.userId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get("/logout", (req, res) => {
  res
    .cookie("token", "", { sameSite: "none", secure: true })
    .json("Logged out");
});

const server = app.listen(4000);

const jwtSecret = process.env.JWT_SECRET;

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;

    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log("file saved:" + path);
      });
    }

    if (recipient && (text || file)) {
      const messageDoc = await db.Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  notifyAboutOnlinePeople();
});
