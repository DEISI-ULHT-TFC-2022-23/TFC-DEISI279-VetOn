const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const parser = require("cookie-parser");
const ws = require("ws");
const fs = require("fs");
const db = require("./models");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

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

const server = app.listen(4000);
const photosMiddleware = multer({ dest: "/tmp" });
const jwtSecret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);
const url = process.env.CLIENT;
const bucket = "vet-on";

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

async function getUserData(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, jwtSecret, {}, (error, userData) => {
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

app.post(
  "/api/upload",
  photosMiddleware.array("photo", 1),
  async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { path, originalname, mimetype } = req.files[0];
    try {
      const url = await uploadToS3(path, originalname, mimetype);
      res.json([url]);
    } catch (error) {
      res.json({ error: "Falha ao enviar foto" });
    }
  }
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

// user endpoints

app.get("/api/user-data", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const token = req.cookies?.token;

  try {
    if (token) {
      jwt.verify(token, jwtSecret, {}, (error, userData) => {
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
    res.status(401).json({ error: "no token provided" });
  }
});

app.get("/api/users", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const users = await db.User.find({});
  res.json({ users: users });
});

app.get("/api/users/:username", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const username = req.params.username;
  const user = await db.User.findOne({ username: username });
  res.json(user);
});

app.post("/api/edit-email", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email: newEmail } = req.body;
  const userData = await getUserData(req);
  const oldUser = await db.User.findById(userData.userId);

  if (newEmail == "") {
    res.json({ error: "Preencha o campo corretamente" });
  } else if (newEmail == oldUser.email) {
    res.json({ error: "Não pode mudar para o mesmo email" });
  } else {
    try {
      const newUser = await db.User.findByIdAndUpdate(userData.userId, {
        email: newEmail,
      });

      jwt.sign(
        { userId: newUser._id, username: newUser.username },
        jwtSecret,
        {},
        (error, token) => {
          if (error) {
            console.log(error);
          }
          res
            .cookie("token", token, {
              path: "/",
              secure: true,
            })
            .json({
              user_id: newUser._id,
              message: "Email alterado com sucesso",
            });
        }
      );
    } catch (error) {
      res.json({ error: error });
    }
  }
});

app.post("/api/edit-username", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { username: newUsername } = req.body;
  const userData = await getUserData(req);
  const oldUser = await db.User.findById(userData.userId);

  if (newUsername == "") {
    res.json({ error: "Preencha o campo corretamente" });
  } else if (newUsername == oldUser.username) {
    res.json({ error: "Não pode mudar para o mesmo username" });
  } else {
    try {
      const newUser = await db.User.findByIdAndUpdate(userData.userId, {
        username: newUsername,
      });

      jwt.sign(
        { userId: newUser._id, username: newUsername },
        jwtSecret,
        {},
        (error, token) => {
          if (error) {
            console.log(error);
          }
          res
            .cookie("token", token, {
              path: "/",
              secure: true,
            })
            .json({
              user_id: newUser._id,
              message: "Username alterado com sucesso",
            });
        }
      );
    } catch (error) {
      res.json({ error: error });
    }
  }
});

app.post("/api/edit-password", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { currentPassword, password: newPassword } = req.body;
  const userData = await getUserData(req);

  if (newPassword == "" || currentPassword == "") {
    res.json({ error: "Preencha os campos corretamente" });
  } else if (newPassword == currentPassword) {
    res.json({ error: "Não pode mudar para a mesma password" });
  } else {
    try {
      const user = await db.User.findById(userData.userId);

      const correctPassword = bcrypt.compareSync(
        currentPassword,
        user.password
      );

      if (correctPassword) {
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        const newUser = await db.User.findByIdAndUpdate(userData.userId, {
          password: hashedPassword,
        });
        jwt.sign(
          { userId: newUser._id, username: newUser.username },
          jwtSecret,
          {},
          (error, token) => {
            if (error) {
              console.log(error);
            }
            res
              .cookie("token", token, {
                path: "/",
                secure: true,
              })
              .json({
                user_id: newUser._id,
                message: "Password alterada com sucesso",
              });
          }
        );
      } else {
        res.json({ error: "Password atual incorreta" });
      }
    } catch (error) {
      res.json({ error: error });
    }
  }
});

app.post("/api/edit-photo", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { addedPhotos: newPhoto } = req.body;
  const userData = await getUserData(req);

  try {
    const newUser = await db.User.findByIdAndUpdate(userData.userId, {
      image: newPhoto,
    });

    jwt.sign(
      { userId: newUser._id, username: newUser.username },
      jwtSecret,
      {},
      (error, token) => {
        if (error) {
          console.log(error);
        }
        res
          .cookie("token", token, {
            path: "/",
            secure: true,
          })
          .json({
            user_id: newUser._id,
            message: "Foto alterada com sucesso",
          });
      }
    );
  } catch (error) {
    res.json({ error: error });
  }
});

app.get("/api/user-animals", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserData(req);
  const animals = await db.Animal.find({ owner_id: userData.userId });
  res.json({ animals: animals });
});

app.get("/api/user-animals/:username", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { username } = req.params;
  const user = await db.User.findOne({ username: username });
  const animals = await db.Animal.find({ owner_id: user._id });
  res.json({ animals: animals });
});

app.get("/api/user-appointments", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserData(req);
  const appointments = await db.Appointment.find({ owner: userData.userId });
  res.json({ appointments: appointments });
});

// animal endpoints

app.get("/api/animals", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const animals = await db.Animal.find({});
  res.json({ animals: animals });
});

app.get("/api/animals/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const animal = await db.Animal.findById(id);
  res.json({ animal: animal });
});

app.post("/api/add-animal", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    name,
    type,
    race,
    weight,
    gender,
    birth_date,
    skin_type,
    addedPhotos,
  } = req.body;
  const userData = await getUserData(req);

  let image = [];
  if (addedPhotos.length == 0) {
    image = ["https://vet-on.s3.amazonaws.com/default_profile.jpg"];
  } else {
    image = addedPhotos;
  }

  await db.Animal.create({
    name: name,
    type: type,
    race: race,
    weight: weight,
    gender: gender,
    birth_date: birth_date,
    skin_type: skin_type,
    image: image,
    owner_id: userData.userId,
  });
  res.json({ message: "Animal criado com sucesso" });
});

app.post("/api/edit-animal/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const { weight, skin_type, addedPhotos } = req.body;

  if (addedPhotos.length == 0) {
    try {
      await db.Animal.findByIdAndUpdate(id, {
        weight: weight,
        skin_type: skin_type,
      });
      res.json({ message: "Animal editado com sucesso" });
    } catch (error) {
      res.json({ error: error });
    }
  } else {
    try {
      await db.Animal.findByIdAndUpdate(id, {
        weight: weight,
        skin_type: skin_type,
        image: addedPhotos,
      });
      res.json({ message: "Animal editado com sucesso" });
    } catch (error) {
      res.json({ error: error });
    }
  }
});

app.delete("/api/delete-animal/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    await db.Animal.findByIdAndDelete(id);
    res.json({ message: "Animal eliminado com sucesso" });
  } catch (error) {
    res.json({ error: error });
  }
});

// appointment endpoints

app.get("/api/appointments", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const appointments = await db.Appointment.find({});
  res.json({ appointments: appointments });
});

app.get("/api/appointments/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const appointment = await db.Appointment.findById(id);
  res.json({ appointment: appointment });
});

const sendConfirmation = async (
  pet,
  appointmentType,
  email,
  date,
  hour,
  doctor
) => {
  const mailOptions = {
    from: "veton.verify.users@gmail.com",
    to: email,
    subject: "Marcou uma consulta com a VetOn",
    html: `<h3><b>Caro utilizador,</b></h3><p>Vimos por este meio informar que marcou uma consulta de <b>${appointmentType}</b> 
    para o ${pet} no dia <b>${date}</b> às <b>${hour}</b> com o/a <b>Dr./Dra. ${doctor}</b></p><p>Atenciosamente,</p><p><b>Equipa VetOn</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendConfirmationAdmin = async (
  pet,
  appointmentType,
  email,
  date,
  hour,
  doctor
) => {
  const mailOptions = {
    from: "veton.verify.users@gmail.com",
    to: email,
    subject: "Foi marcada uma consulta",
    html: `<h3><b>Caro utilizador,</b></h3><p>Vimos por este meio informar que foi marcada uma consulta de <b>${appointmentType}</b> 
    para o ${pet} no dia <b>${date}</b> às <b>${hour}</b> com o/a <b>Dr./Dra. ${doctor}</b></p><p>Atenciosamente,</p><p><b>Equipa VetOn</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};

app.post("/api/add-appointment", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserData(req);
  const { pet, appointmentType, doctorName, date, hour } = req.body;
  const user = await db.User.findById(userData.userId);
  sendConfirmation(pet, appointmentType, user.email, date, hour, doctorName);
  const doctor = await db.Doctor.findOne({ name: doctorName });

  await db.Appointment.create({
    clinic: "Hospital Veterinário da Universidade Lusófona",
    pet: pet,
    appointmentType: appointmentType,
    doctor: doctorName,
    date: date,
    hour: hour,
    owner: userData.userId,
  });

  await db.Doctor.findByIdAndUpdate(
    doctor._id,
    {
      $pull: {
        "timetable.$[day].hours": hour,
      },
    },
    { new: true, arrayFilters: [{ "day.dayString": date }] }
  );

  res.json({ message: "Consulta criada com sucesso" });
});

app.post("/api/add-appointment-admin", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { username, pet, appointmentType, doctorName, date, hour } = req.body;

  const doctor = await db.Doctor.findOne({ name: doctorName });
  const user = await db.User.findOne({ username: username });
  sendConfirmationAdmin(
    pet,
    appointmentType,
    user.email,
    date,
    hour,
    doctorName
  );
  await db.Appointment.create({
    clinic: "Hospital Veterinário da Universidade Lusófona",
    pet: pet,
    appointmentType: appointmentType,
    doctor: doctorName,
    date: date,
    hour: hour,
    owner: user._id,
  });

  await db.Doctor.findByIdAndUpdate(
    doctor._id,
    {
      $pull: {
        "timetable.$[day].hours": hour,
      },
    },
    { new: true, arrayFilters: [{ "day.dayString": date }] }
  );

  res.json({ message: "Consulta criada com sucesso" });
});

const sendConfirmationDelete = async (
  pet,
  appointmentType,
  email,
  date,
  hour,
  doctor
) => {
  const mailOptions = {
    from: "veton.verify.users@gmail.com",
    to: email,
    subject: "Desmarcou uma das suas consultas",
    html: `<h3><b>Caro utilizador,</b></h3><p>Vimos por este meio informar que desmarcou uma consulta de <b>${appointmentType}</b> 
    para o ${pet} no dia <b>${date}</b> às <b>${hour}</b> com o/a <b>Dr./Dra. ${doctor}</b></p><p>Atenciosamente,</p><p><b>Equipa VetOn</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};

app.delete("/api/delete-appointment/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    const appointment = await db.Appointment.findById(id);
    const user = await db.User.findById(appointment.owner);
    sendConfirmationDelete(
      appointment.pet,
      appointment.appointmentType,
      user.email,
      appointment.date,
      appointment.hour,
      appointment.doctor
    );
    await db.Doctor.findOneAndUpdate(
      { name: appointment.doctor },
      {
        $push: {
          "timetable.$[day].hours": appointment.hour,
        },
      },
      { new: true, arrayFilters: [{ "day.dayString": appointment.date }] }
    );

    await db.Appointment.findByIdAndDelete(id);
    res.json({ message: "Consulta eliminada com sucesso" });
  } catch (error) {
    res.json({ error: error });
  }
});

const sendConfirmationDeleteAdmin = async (
  pet,
  appointmentType,
  email,
  date,
  hour,
  doctor
) => {
  const mailOptions = {
    from: "veton.verify.users@gmail.com",
    to: email,
    subject: "Foi desmarcada uma das suas consultas",
    html: `<h3><b>Caro utilizador,</b></h3><p>Vimos por este meio informar que foi desmarcada uma consulta de <b>${appointmentType}</b> 
    para o ${pet} no dia <b>${date}</b> às <b>${hour}</b> com o/a <b>Dr./Dra. ${doctor}</b></p><p>Atenciosamente,</p><p><b>Equipa VetOn</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};

app.delete("/api/delete-appointment-admin/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;

  try {
    const appointment = await db.Appointment.findById(id);
    const user = await db.User.findById(appointment.owner);
    sendConfirmationDeleteAdmin(
      appointment.pet,
      appointment.appointmentType,
      user.email,
      appointment.date,
      appointment.hour,
      appointment.doctor
    );
    await db.Doctor.findOneAndUpdate(
      { name: appointment.doctor },
      {
        $push: {
          "timetable.$[day].hours": appointment.hour,
        },
      },
      { new: true, arrayFilters: [{ "day.dayString": appointment.date }] }
    );

    await db.Appointment.findByIdAndDelete(id);
    res.json({ message: "Consulta eliminada com sucesso" });
  } catch (error) {
    res.json({ error: error });
  }
});

// authentication

app.post("/api/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, username, password, addedPhotos } = req.body;
  const hashedPassword = bcrypt.hashSync(password, salt);

  let image = [];
  if (addedPhotos.length == 0) {
    image = ["https://vet-on.s3.amazonaws.com/default_profile.jpg"];
  } else {
    image = addedPhotos;
  }

  try {
    const createdUser = await db.User.create({
      type: "user",
      email,
      username,
      password: hashedPassword,
      image: image,
      failedAttempts: 0,
    });

    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (error, token) => {
        if (error) {
          console.log(error);
        }
        res
          .cookie("token", token, {
            path: "/",
            secure: true,
          })
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

app.post("/api/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { username, password } = req.body;

  const user = await db.User.findOne({ username });

  if (user) {
    const failedAttempts = user.failedAttempts;
    const correctPassword = bcrypt.compareSync(password, user.password);

    if (correctPassword) {
      if (failedAttempts >= 3) {
        res.json({
          error:
            "Conta bloqueada.\n\nEntre em contacto connosco através da secção de contacto",
        });
      } else {
        jwt.sign(
          { userId: user._id, username },
          jwtSecret,
          {},
          (error, token) => {
            if (error) {
              console.log(error);
            }
            res
              .cookie("token", token, {
                path: "/",
                secure: true,
              })
              .json({
                user_id: user._id,
                type: user.type,
              });
          }
        );
        await db.User.updateOne(
          { _id: user._id },
          {
            $set: {
              failedAttempts: 0,
            },
          }
        );
      }
    } else {
      if (failedAttempts >= 3) {
        res.json({
          error:
            "Conta bloqueada.\n\nEntre em contacto connosco através da secção de contacto",
        });
      } else {
        await db.User.updateOne(
          { _id: user._id },
          {
            $set: {
              failedAttempts: user.failedAttempts + 1,
            },
          }
        );
        res.json({ error: "Campos username ou password incorretos" });
      }
    }
  } else {
    res.json({ error: "Campos username ou password incorretos" });
  }
});

const sendResetEmail = async (id, email) => {
  const mailOptions = {
    from: "veton.verify.users@gmail.com",
    to: email,
    subject: "Redefinir Password",
    html: `<p>Pediste para redefinir a password da tua conta no site da VetOn</p><p>Clica aqui <a href=${
      url + "/reset-password/" + id
    }>link</a> para a redefinires</p>`,
  };

  await transporter.sendMail(mailOptions);
};

app.post("/api/forgot-password", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ email: email });
    if (user) {
      const userId = user._id;
      const userEmail = user.email;
      await sendResetEmail(userId, userEmail);
      res.json({ message: "Email enviado" });
    } else {
      res.json({ error: "Não existe conta com o email " + email });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

app.post("/api/reset-password/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userId = req.params.id;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await db.User.findById(userId);
  if (bcrypt.compareSync(password, user.password)) {
    res.json({ error: "Não pode mudar para a mesma password" });
  } else {
    try {
      await db.User.updateOne({ _id: userId }, { password: hashedPassword });
      res.json({ message: "Password redefinida com sucesso" });
    } catch (error) {
      res.json({ error: error });
    }
  }
});

// doctor endpoints

function generateUpdatedTimetable() {
  const timetable = [];

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const currentDay = new Date(currentDate);

  for (let i = 0; i < 30; i++) {
    const day = new Date(currentDay);
    day.setDate(currentDay.getDate() + i);

    const dayString = day.toLocaleDateString("pt", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const hours = [];
    for (let j = 9; j <= 20; j++) {
      if (j < 10) {
        hours.push("0" + j + ":00");
      } else {
        hours.push(j + ":00");
      }
    }

    timetable.push({ dayString, hours });
  }

  return timetable;
}

app.get("/api/doctors", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const doctors = await db.Doctor.find({});
  res.json({ doctors: doctors });
});

app.post("/api/add-doctor", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { addedPhotos, name, job, description, fb, li, insta } = req.body;

  let image = [];
  if (addedPhotos.length == 0) {
    image = ["https://vet-on.s3.amazonaws.com/default_profile.jpg"];
  } else {
    image = addedPhotos;
  }

  const randomUsername =
    name.split(" ")[1].toLowerCase() +
    "" +
    Math.floor(Math.random() * 2000).toString();

  const hashedPassword = bcrypt.hashSync(randomUsername, salt);
  try {
    await db.User.create({
      type: "doctor",
      email: randomUsername + "@veton.com",
      username: randomUsername,
      password: hashedPassword,
      image: image,
      failedAttempts: 0,
    });

    await db.Doctor.create({
      username: randomUsername,
      image: image,
      name: name,
      job: job,
      description: description,
      fb: fb,
      li: li,
      insta: insta,
      timetable: generateUpdatedTimetable(),
    });

    res.json({
      message: "Médico criado com sucesso",
    });
  } catch (error) {
    res.json(error);
  }
});

// services endpoints

app.get("/api/services", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const services = await db.Service.find({});
  res.json({ services: services });
});

app.post("/api/add-service", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, addedPhotos } = req.body;

  let image = [];
  if (addedPhotos.length == 0) {
    image = ["https://vet-on.s3.amazonaws.com/default_profile.jpg"];
  } else {
    image = addedPhotos;
  }

  await db.Service.create({
    name: name,
    image: image,
  });
  res.json({ message: "Serviço criado com sucesso" });
});

// random

const sendContactEmail = async (name, email, message) => {
  const mailOptions = {
    from: "veton.verify.users@gmail.com",
    to: "veton.verify.users@gmail.com",
    subject: "Recebeu um novo pedido de contacto",
    html: `<p>Foi submetido um novo form pelo ${name} com o email ${email}</p><p><b>Mensagem:</b></p><p>${message}</p>`,
  };

  await transporter.sendMail(mailOptions);
};

app.post("/api/contact", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, message } = req.body;
  await sendContactEmail(name, email, message);
  res.json({ message: "Email enviado com sucesso" });
});

// chat endpoints

// app.get("/api/support", async (req, res) => {
//   mongoose.connect(process.env.MONGO_URL);
//   const support = await db.User.find({});
//   res.json(support);
// });

// app.get("/api/messages/:userId", async (req, res) => {
//   mongoose.connect(process.env.MONGO_URL);
//   const { userId } = req.params;
//   const userData = await getUserData(req);

//   const messages = await db.Message.find({
//     sender: { $in: [userId, userData.userId] },
//     recipient: { $in: [userId, userData.userId] },
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });

// const wss = new ws.WebSocketServer({ server });
// wss.on("connection", (connection, req) => {
//   function notifyAboutOnlinePeople() {
//     [...wss.clients].forEach((client) => {
//       client.send(
//         JSON.stringify({
//           online: [...wss.clients].map((c) => ({
//             userId: c.userId,
//             username: c.username,
//           })),
//         })
//       );
//     });
//   }

//   connection.isAlive = true;

//   connection.timer = setInterval(() => {
//     connection.ping();
//     connection.deathTimer = setTimeout(() => {
//       connection.isAlive = false;
//       clearInterval(connection.timer);
//       connection.terminate();
//       notifyAboutOnlinePeople();
//     }, 1000);
//   }, 5000);

//   connection.on("pong", () => {
//     clearTimeout(connection.deathTimer);
//   });

//   const cookies = req.headers.cookie;
//   if (cookies) {
//     const tokenCookieString = cookies
//       .split(";")
//       .find((str) => str.startsWith("token="));
//     if (tokenCookieString) {
//       const token = tokenCookieString.split("=")[1];
//       if (token) {
//         jwt.verify(token, jwtSecret, {}, (err, userData) => {
//           if (err) throw err;
//           const { userId, username } = userData;
//           connection.userId = userId;
//           connection.username = username;
//         });
//       }
//     }
//   }

//   connection.on("message", async (message) => {
//     const messageData = JSON.parse(message.toString());
//     const { recipient, text, file } = messageData;
//     let filename = null;

//     if (file) {
//       const parts = file.name.split(".");
//       const ext = parts[parts.length - 1];
//       filename = Date.now() + "." + ext;
//       const path = __dirname + "/uploads/" + filename;
//       const bufferData = new Buffer(file.data.split(",")[1], "base64");
//       fs.writeFile(path, bufferData, () => {
//         console.log("file saved:" + path);
//       });
//     }

//     if (recipient && (text || file)) {
//       const messageDoc = await db.Message.create({
//         sender: connection.userId,
//         recipient,
//         text,
//         file: file ? filename : null,
//       });
//       [...wss.clients]
//         .filter((c) => c.userId === recipient)
//         .forEach((c) =>
//           c.send(
//             JSON.stringify({
//               text,
//               sender: connection.userId,
//               recipient,
//               file: file ? filename : null,
//               _id: messageDoc._id,
//             })
//           )
//         );
//     }
//   });

//   notifyAboutOnlinePeople();
// });
