const mongoose = require("mongoose");

const Requirement = require("../models/Requirements");

const allowedCategories = ["planner", "performer", "crew"];

const requiredFields = [
  "eventName",
  "eventType",
  "startDate",
  "endDate",
  "location",
  "category",
];

const createRequirement = async (req, res, next) => {
  try {
    const missingFields = requiredFields.filter((field) => {
      const value = req.body[field];

      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      );
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        fields: missingFields,
      });
    }

    const {
      eventName,
      eventType,
      startDate,
      endDate,
      location,
      venue,
      category,
      categoryDetails,
    } = req.body;

    const normalizedCategory = String(category).trim().toLowerCase();

    if (!allowedCategories.includes(normalizedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
        allowedCategories,
      });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid startDate or endDate",
      });
    }

    if (parsedEndDate < parsedStartDate) {
      return res.status(400).json({
        success: false,
        message: "endDate cannot be before startDate",
      });
    }

    const requirement = await Requirement.create({
      eventName,
      eventType,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      location,
      venue,
      category: normalizedCategory,
      categoryDetails: categoryDetails || {},
    });

    return res.status(201).json({
      success: true,
      message: "Requirement created successfully",
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

const getRequirementById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid requirement ID",
      });
    }

    const requirement = await Requirement.findById(id);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequirement,
  getRequirementById,
};