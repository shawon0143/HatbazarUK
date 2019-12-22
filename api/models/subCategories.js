const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
   name: { type: String, required: true },
   imageURL: { type: String }
},  {timestamps: true});

module.exports = mongoose.model('SubCategory', subCategorySchema);