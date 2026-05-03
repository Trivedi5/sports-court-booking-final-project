const Booking = require("../models/Booking");
const Court = require("../models/Court");

const createBooking = async (req, res) => {
  try {
    const { court, bookingDate, bookingTime } = req.body;

    if (!court || !bookingDate || !bookingTime) {
      return res.status(400).json({
        message: "Court, booking date and booking time are required"
      });
    }

    const existingCourt = await Court.findById(court);

    if (!existingCourt) {
      return res.status(404).json({
        message: "Court not found"
      });
    }

    const booking = await Booking.create({
      court,
      user: req.user._id,
      bookingDate,
      bookingTime
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("court")
      .populate("user", "name email");

    const io = req.app.get("io");
    io.emit("bookingCreated", populatedBooking);

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id
    })
      .populate("court")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("court")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to view this booking"
      });
    }

    res.status(200).json({
      booking
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this booking"
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("court")
      .populate("user", "name email");

    const io = req.app.get("io");
    io.emit("bookingStatusUpdated", updatedBooking);

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this booking"
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Booking deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};