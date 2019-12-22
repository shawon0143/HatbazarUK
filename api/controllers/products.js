const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const Product = require("../models/product");

// ====================================
// ===== Multer configuration =========
// ====================================
// Set storage engine ------
const storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, "./public/uploads/");
   },
   filename: function(req, file, cb) {
      cb(
         null,
         file.originalname
            .substring(0, file.originalname.lastIndexOf("."))
            .replace(/\s+/g, "") +
            "-" +
            Date.now() +
            path.extname(file.originalname)
      );
   }
});
const fileFilter = (req, file, cb) => {
   // Allowed ext
   const fileTypes = /jpeg|jpg|png|gif/;
   // check ext
   const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
   );
   // Check mimetype
   const mimeType = fileTypes.test(file.mimetype);
   if (extname && mimeType) {
      return cb(null, true);
   } else {
      cb("Error: Something went wrong");
   }
};

// Init upload --------
const upload = multer({
   storage: storage,
   fileFilter: fileFilter,
   limits: { fileSize: 1024 * 1024 * 5 } // only accepts files upto 5MB size
}).array("imageFile", 4);

// ====================================
// ====== END of Multer configuration =
// ====================================

exports.products_upload_image = (req, res, next) => {
   upload(req, res, err => {
      if (err) {
         return res.status(500).json({ error: err });
      }
      // console.log(req.files);
      // get file links array
      let fileLinks = [];
      if (req.files && req.files.length > 0) {
         req.files.forEach(file => {
            fileLinks.push(
               "http://localhost:3000/uploads/" +
                  file.filename.replace(/\s+/g, "") // trim all spaces in the filename
            );
         });
      }
      res.status(201).json({
         message: "Image uploaded",
         fileLinks: fileLinks
      });
   });
};

exports.products_get_all = (req, res, next) => {
   Product.find()
      .select(
         "_id sku name images brandId isActive variants stockUnit categoryId price productLink description " +
            "isAvailable customField preOrderOnly attributes shipping isThisBestSeller isThisUserFavourite createdAt updatedAt"
      )
      .exec()
      .then(docs => {
         const data = {
            count: docs.length,
            products: docs.map(doc => {
               return {
                  _id: doc._id,
                  sku: doc.sku,
                  name: doc.name,
                  images: doc.images,
                  brandId: doc.brandId,
                  isActive: doc.isActive,
                  variants: doc.variants,
                  stockUnit: doc.stockUnit,
                  subCategoryId: doc.subCategoryId,
                  price: doc.price,
                  productLink: doc.productLink,
                  description: doc.description,
                  isAvailable: doc.isAvailable,
                  customField: doc.customField,
                  preOrderOnly: doc.preOrderOnly,
                  attributes: doc.attributes,
                  shipping: doc.shipping,
                  isThisBestSeller: doc.isThisBestSeller,
                  isThisUserFavourite: doc.isThisUserFavourite,
                  createdAt: doc.createdAt,
                  updatedAT: doc.updatedAt,
                  request: {
                     type: "GET",
                     url: "http://localhost:3000/products/" + doc._id
                  }
               };
            })
         };
         res.status(200).json(data);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.products_create = (req, res, next) => {
   // TODO: check if brandId and subCategoryId exist in the database

   const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      sku: req.body.sku,
      name: req.body.name,
      images: req.body.images,
      brandId: req.body.brandId,
      subCategoryId: req.body.subCategoryId,
      isActive: req.body.isActive,
      variants: req.body.variants,
      stockUnit: req.body.stockUnit,
      price: req.body.price,
      productLink: req.body.productLink,
      description: req.body.description,
      isAvailable: req.body.isAvailable,
      customField: req.body.customField,
      preOrderOnly: req.body.preOrderOnly,
      attributes: req.body.attributes,
      shipping: req.body.shipping,
      isThisBestSeller: req.body.isThisBestSeller,
      isThisUserFavourite: req.body.isThisUserFavourite
   });
   product
      .save()
      .then(result => {
         // console.log(result);
         res.status(201).json({
            message: "Created product",
            createdProduct: {
               name: result.name,
               price: result.price,
               _id: result._id,
               request: {
                  type: "GET",
                  url: "http://localhost:3000/products/" + result._id
               }
            }
         });
      })
      .catch(error => {
         console.log(error);
         res.status(500).json({ error: error });
      });
};

exports.products_find_by_id = (req, res, next) => {
   const id = req.params.productId;
   Product.findById(id)
      .select(
         "_id sku name images brandId isActive variants stockUnit categoryId price productLink description " +
            "isAvailable customField preOrderOnly attributes shipping isThisBestSeller isThisUserFavourite createdAt updatedAt"
      )
      .exec()
      .then(doc => {
         console.log(doc);
         if (doc) {
            res.status(200).json({
               product: doc,
               request: {
                  type: "GET",
                  url: "http://localhost:3000/products"
               }
            });
         } else {
            res.status(404).json({
               error: "No valid entry found for provided Id"
            });
         }
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.products_update = (req, res, next) => {
   const id = req.params.productId;
   // const updateOps = {};
   // for (const ops in req.body) {
   //    updateOps[ops.propName] = ops.value;
   // }
   Product.update({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
         console.log(result);
         res.status(200).json({
            message: "Product updated",
            request: {
               type: "GET",
               url: "http://localhost:3000/products/" + id
            }
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.products_delete = (req, res, next) => {
   const id = req.params.productId;
   Product.remove({ _id: id })
      .exec()
      .then(result => {
         res.status(200).json({
            message: "Product deleted"
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};
