const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    eventType: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    venue: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["planner", "performer", "crew"],
      lowercase: true,
      trim: true,
    },

    categoryDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Requirement", requirementSchema);