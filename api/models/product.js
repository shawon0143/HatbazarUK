const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: {
        retail: { type: Number, required: true },
        promo: { type: Number, default: 0},
        priceAfterDiscount: { type: Number, default: 0},
        discount: { type: Number, default: 0},
        isOnPromotion: { type: Boolean, default: false},
        isOnDiscount: { type: Boolean, default: false}
    },
    stockUnit: { type: Number, required: true},
    productLink: { type: String},
    description: { type: String },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    images: [{ type: String }],
    sku: { type: String },
    isActive: { type: Boolean, required: true },
    isAvailable: { type: Boolean },
    preOrderOnly: { type: Boolean },
    attributes: {
        tags: [{ type: String }],
        type: { type: String }
    },
    shipping: {
        weight: { type: Number, required: true },
        dimensions: {
            height: { type: Number },
            length: { type: Number },
            width: { type: Number }
        }
    },
    variants: [
        {
            name: { type: String },
            value: [ { type: String } ]
        }
    ],
    customField: [ { type: String} ],
    isThisBestSeller: { type: Boolean, default: false },
    isThisUserFavourite: { type: Boolean, default: false }
},  {timestamps: true});

module.exports = mongoose.model('Product', productSchema);