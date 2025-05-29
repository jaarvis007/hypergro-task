const express = require("express");
const Property = require("../models/Property");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const { searchProperties } = require("../Controller/propertyController");

// Create
router.post("/add", auth, async (req, res) => {
  try {
    const newProperty = new Property({ ...req.body, createdBy: req.user._id });
    const saved = await newProperty.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create property", error: err.message });
  }
});

// Get all (with optional filters)
router.get("/", async (req, res) => {
  try {
    const filters = { ...req.query };
    const properties = await Property.find(filters);
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});
router.get("/search", searchProperties);

router.get("/user", auth, async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user._id });
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user properties" });
  }
});

// Update
router.put("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property || property.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" });

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update property", err: err.message });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property || property.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" });

    await property.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete property" });
  }
});

module.exports = router;
