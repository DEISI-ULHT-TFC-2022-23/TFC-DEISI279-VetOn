const express = require("express");
const router = express.Router();
const db = require("../models");

const today = new Date();
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];
const appointmentHours = [{ date: today, hours: hours }];

router.get("/doctors", async (req, res) => {
  const doctors = await db.Doctor.find({});
  res.json({ doctors: doctors });
});

router.post("/add-doctor", async (req, res) => {
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
  res.json({ message: "Doutor criado com sucesso" });
});

router.post("/remove-hours", async (req, res) => {
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

router.post("/add-hours", async (req, res) => {
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

module.exports = router;
