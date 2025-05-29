const express = require("express");
const User = require("../models/User");
const Property = require("../models/Property");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Recommend a property
router.post("/:email/:propertyId", auth, async (req, res) => {
  try {
    const recipient = await User.findOne({ email: req.params.email });
    const property = await Property.findById(req.params.propertyId);
    if (!recipient || !property)
      return res.status(404).json({ error: "User or property not found" });

    recipient.recommendationsReceived.push(property._id);
    await recipient.save();
    res.json({ message: "Property recommended successfully" });
  } catch (err) {
    res.status(500).json({ error: "Recommendation failed" });
  }
});

// View recommendations received
router.get("/received", auth, async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "recommendationsReceived"
  );
  res.json(user.recommendationsReceived);
});

module.exports = router;
