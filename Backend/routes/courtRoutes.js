const express = require("express");
const router = express.Router();

const {
  createCourt,
  getCourts,
  getCourtById,
  updateCourt,
  deleteCourt
} = require("../controllers/courtController");

const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(getCourts)
  .post(protect, createCourt);

router.route("/:id")
  .get(getCourtById)
  .put(protect, updateCourt)
  .delete(protect, deleteCourt);

module.exports = router;