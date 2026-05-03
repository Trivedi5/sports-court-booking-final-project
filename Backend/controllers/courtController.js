const Court = require("../models/Court");

const createCourt = async (req, res) => {
  try {
    const { name, location, sportType, pricePerHour, imageUrl } = req.body;

    if (!name || !location || !sportType || !pricePerHour) {
      return res.status(400).json({
        message: "Name, location, sport type and price are required"
      });
    }

    const court = await Court.create({
      name,
      location,
      sportType,
      pricePerHour,
      imageUrl,
      owner: req.user._id
    });

    res.status(201).json({
      message: "Court created successfully",
      court
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCourts = async (req, res) => {
  try {
    const courts = await Court.find().populate("owner", "name email");

    res.status(200).json({
      count: courts.length,
      courts
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id).populate("owner", "name email");

    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }

    res.status(200).json({ court });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }

    if (court.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this court"
      });
    }

    const updatedCourt = await Court.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Court updated successfully",
      court: updatedCourt
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }

    if (court.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this court"
      });
    }

    await Court.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Court deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCourt,
  getCourts,
  getCourtById,
  updateCourt,
  deleteCourt
};