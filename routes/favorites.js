const express = require("express");
const Property = require("../models/Property");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Add to favorites
router.post("/:propertyId", auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!req.user.favorites.includes(propertyId)) {
      req.user.favorites.push(propertyId);
      await req.user.save();
    }
    res.json({ message: "Added to favorites" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add favorite", error: err.message });
  }
});

// Get favorites
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites);
});

// Remove from favorites
router.delete("/:propertyId", auth, async (req, res) => {
  try {
    req.user.favorites = req.user.favorites.filter(
      (id) => id.toString() !== req.params.propertyId
    );
    await req.user.save();
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

module.exports = router;
