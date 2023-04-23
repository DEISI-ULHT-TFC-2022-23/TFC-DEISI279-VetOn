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

router.get("/appointments", async (req, res) => {
  const appointments = await db.Appointment.find({});
  res.json({ appointments: appointments });
});

router.get("/user-appointments", async (req, res) => {
  const userData = await getUserData(req);
  const appointments = await db.Appointment.find({ owner: userData.userId });
  res.json({ appointments: appointments });
});

router.post("/add-appointment", async (req, res) => {
  const userData = await getUserData(req);
  const { pet, appointmentType, doctorName, hour } = req.body;

  const doctor = await db.Doctor.findOne({ name: doctorName });

  await db.Appointment.create({
    clinic: "Hospital Veterinario da Universidade Lusofona",
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

router.patch("/update-hours", async (req, res) => {
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

module.exports = router;
