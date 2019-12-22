const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    invoiceAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      street: { type: String, required: true },
      zipCode: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String },
      mobile: { type: String, required: true },
      phone: { type: String }
    },
    deliveryType: { type: String, required: true },
    deliveryAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      street: { type: String, required: true },
      zipCode: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String },
      mobile: { type: String, required: true },
      phone: { type: String }
    },
    deliveryDate: { type: Date, required: true },
    invoiceRef: { type: String, required: true },
    orderStatus: { type: String, required: true },
    feedback: { type: String },
    cart: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
