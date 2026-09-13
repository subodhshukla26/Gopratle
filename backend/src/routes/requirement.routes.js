const express = require("express");

const {
  createRequirement,
  getRequirementById,
} = require("../controllers/requirement.controller");

const router = express.Router();

router.post("/", createRequirement);
router.get("/:id", getRequirementById);

module.exports = router;