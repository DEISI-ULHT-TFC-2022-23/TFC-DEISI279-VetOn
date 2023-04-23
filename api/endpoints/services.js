const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/services", async (req, res) => {
  const services = await db.Service.find({});
  res.json({ services: services });
});

module.exports = router;
