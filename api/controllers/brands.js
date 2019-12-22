const mongoose = require("mongoose");
const Brand = require("../models/brands");
const Product = require("../models/product");

exports.brands_create = (req, res, next) => {
   const brand = new Brand({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      imageURL: req.body.imageURL
   });
   brand
      .save()
      .then(result => {
         res.status(201).json({
            message: "Brand created",
            createdBrand: {
               name: result.name,
               imageURL: result.imageURL,
               _id: result._id
            },
            request: {
               type: "GET",
               url: "http://localhost:3000/brands/" + result._id
            }
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};


exports.brands_get_all = (req, res, next) => {
   Brand.find()
      .select("_id name imageURL createdAt updatedAt")
      .exec()
      .then(docs => {
         const response = {
            count: docs.length,
            brands: docs.map(doc => {
               return {
                  _id: doc._id,
                  name: doc.name,
                  imageURL: doc.imageURL,
                  createdAt: doc.createdAt,
                  updatedAT: doc.updatedAt,
                  request: {
                     type: "GET",
                     url: "http://localhost:3000/brands/" + doc._id
                  }
               };
            })
         };
         res.status(200).json(response);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.brands_find_by_id = (req, res, next) => {
   const id = req.params.brandId;
   Brand.findById(id)
      .select("_id categoryId name imageURL")
      .exec()
      .then(doc => {
         if (doc) {
            res.status(200).json({
               brand: doc,
               request: {
                  type: "GET",
                  url: "http://localhost:3000/brands"
               }
            });
         } else {
            res.status(404).json({
               error: "No valid entry found for subcategoryId"
            });
         }
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.brands_update = (req, res, next) => {
   const id = req.params.brandId;
   // const updateOps = {};
   // console.log(req.body);
   // for (let ops in req.body) {
   //    updateOps[ops.propName] = ops.value;
   // }
   // console.log(updateOps);
   Brand.update({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
         console.log(result);
         res.status(200).json({
            message: "Brand Updated",
            request: {
               type: "GET",
               url: "http://localhost:3000/brands/" + id
            }
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.brands_delete = (req, res, next) => {
   const id = req.params.brandId;
   // console.log(id);
   // First check if this subcategory has products linked
   // if exists ask user to delete that first
   Product.find({ brandId: id })
      .exec()
      .then(result => {
         if (result.length > 0) {
            return res.status(401).json({
               message:
                  "Products linked with this brand, delete them first",
               productList: result.map(doc => {
                  return {
                     _id: doc._id,
                     name: doc.name
                  };
               })
            });
         }

         Brand.remove({ _id: id })
            .exec()
            .then(result => {
               res.status(200).json({
                  message: "Brand deleted"
               });
            })
            .catch(err => {
               console.log(err);
               res.status(500).json({ error: err });
            });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};