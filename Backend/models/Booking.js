const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookingDate: {
      type: String,
      required: true
    },
    bookingTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);