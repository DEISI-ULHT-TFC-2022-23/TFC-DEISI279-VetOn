const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const parser = require("cookie-parser");
const ws = require("ws");
const fs = require("fs");
const db = require("./models");

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

mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;
const server = app.listen(4000);

const express = require("express");
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

app.get("/animals", async (req, res) => {
  const animals = await db.Animal.find({});
  res.json({ animals: animals });
});

app.get("/user-animals", async (req, res) => {
  const userData = await getUserData(req);

  const animals = await db.Animal.find({ owner_id: userData.userId });
  res.json({ animals: animals });
});

app.get("/user-animals/:username", async (req, res) => {
  const { username } = req.params;
  const user = await db.User.findOne({ username: username });
  const animals = await db.Animal.find({ owner_id: user._id });
  res.json({ animals: animals });
});

app.post("/add-animal", async (req, res) => {
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

app.post("/edit-animal/:id", async (req, res) => {
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

app.delete("/delete-animal/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.Animal.findByIdAndDelete(id);
    res.json({ message: "Animal eliminado com sucesso" });
  } catch (error) {
    res.json({ error: error });
  }
});

const express = require("express");
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

app.get("/appointments", async (req, res) => {
  const appointments = await db.Appointment.find({});
  res.json({ appointments: appointments });
});

app.get("/user-appointments", async (req, res) => {
  const userData = await getUserData(req);
  const appointments = await db.Appointment.find({ owner: userData.userId });
  res.json({ appointments: appointments });
});

app.post("/add-appointment", async (req, res) => {
  const userData = await getUserData(req);
  const { pet, appointmentType, doctorName, hour } = req.body;

  const doctor = await db.Doctor.findOne({ name: doctorName });

  await db.Appointment.create({
    clinic: "Hospital Veterinário da Universidade Lusófona",
    pet: pet,
    appointmentType: appointmentType,
    doctor: doctorName,
    hour: hour,
    owner: userData.userId,
  });

  await db.Doctor.findByIdAndUpdate(
    doctor._id,
    {
      $pull: {
        "appointmentHours.$[].hours": {
          $in: [hour],
        },
      },
    },
    { new: true }
  );

  res.json({ message: "Consulta criada com sucesso" });
});

app.post("/add-appointment-admin", async (req, res) => {
  const { username, pet, appointmentType, doctorName, hour } = req.body;

  const doctor = await db.Doctor.findOne({ name: doctorName });
  const user = await db.User.findOne({ username: username });

  await db.Appointment.create({
    clinic: "Hospital Veterinário da Universidade Lusófona",
    pet: pet,
    appointmentType: appointmentType,
    doctor: doctorName,
    hour: hour,
    owner: user._id,
  });

  await db.Doctor.findByIdAndUpdate(
    doctor._id,
    {
      $pull: {
        "appointmentHours.$[].hours": {
          $in: [hour],
        },
      },
    },
    { new: true }
  );

  res.json({ message: "Consulta criada com sucesso" });
});

app.delete("/delete-appointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await db.Appointment.findById(id);
    await db.Doctor.findOneAndUpdate(
      { name: appointment.doctor },
      {
        $push: {
          "appointmentHours.$[].hours": appointment.hour,
        },
      }
    );
    await db.Appointment.findByIdAndDelete(id);
    res.json({ message: "Consulta eliminada com sucesso" });
  } catch (error) {
    res.json({ error: error });
  }
});

app.patch("/update-hours", async (req, res) => {
  await db.Doctor.updateMany(
    {},
    {
      $pop: {
        appointmentHours: 1,
      },
      $push: {
        appointmentHours: {
          date: today,
          hours: hours,
        },
      },
    }
  );
});

const express = require("express");
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
  const url = process.env.CLIENT;

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

app.post("/register", async (req, res) => {
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
          if (error) {
            console.log(error);
          }
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            user_id: user._id,
            type: user.type,
          });
        }
      );
    } else {
      res.json({ error: "Campos username ou password incorretos" });
    }
  } else {
    res.json({ error: "Não existe conta com o username " + username });
  }
});

app.get("/logout", (req, res) => {
  res
    .cookie("token", "", { sameSite: "none", secure: true })
    .json("Logged out");
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ email: email });
    if (user) {
      const userId = user._id;
      const userEmail = user.email;
      sendResetEmail(userId, userEmail);
      res.json({ message: "Email enviado" });
    } else {
      res.json({ error: "Não existe conta com o email " + email });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

app.post("/reset-password/:id/:uniqueString", async (req, res) => {
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
          res.json({ error: "Verificação inválida" });
        }
      });
    } else {
      res.json({ error: "Não foi enviado o email de verificação" });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

const express = require("express");
const db = require("../models");

const today = new Date();
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];
const appointmentHours = [{ date: today, hours: hours }];

app.get("/doctors", async (req, res) => {
  const doctors = await db.Doctor.find({});
  res.json({ doctors: doctors });
});

app.post("/add-doctor", async (req, res) => {
  const { name, job, description, fb, li, insta } = req.body;

  await db.Doctor.create({
    name: name,
    job: job,
    description: description,
    fb: fb,
    li: li,
    insta: insta,
    appointmentHours: appointmentHours,
  });
  res.json({ message: "Médico criado com sucesso" });
});

app.post("/remove-hours", async (req, res) => {
  await db.Doctor.updateMany(
    {},
    {
      $unset: {
        appointmentHours: "",
      },
    }
  );
  res.json({ message: "Horas updated" });
});

app.post("/add-hours", async (req, res) => {
  await db.Doctor.updateMany(
    {},
    {
      $push: {
        appointmentHours: appointmentHours,
      },
    }
  );
  res.json({ message: "Horas updated" });
});

const express = require("express");
const db = require("../models");

app.get("/services", async (req, res) => {
  const services = await db.Service.find({});
  res.json({ services: services });
});

const express = require("express");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

app.get("/users", async (req, res) => {
  const users = await db.User.find({});
  res.json({ users: users });
});

app.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  const user = await db.User.findOne({ username: username });
  res.json(user);
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

app.post("/edit-email", async (req, res) => {
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

app.post("/edit-username", async (req, res) => {
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

app.post("/edit-password", async (req, res) => {
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

const express = require("express");
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

app.get("/clients", async (req, res) => {
  const clients = await db.User.find({});
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
