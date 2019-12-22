const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
   {
      _id: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
      imageURL: { type: String }
   },
   { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
