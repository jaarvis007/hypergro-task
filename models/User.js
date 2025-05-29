const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  recommendationsReceived: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  ],
});

module.exports = mongoose.model("User", UserSchema);
