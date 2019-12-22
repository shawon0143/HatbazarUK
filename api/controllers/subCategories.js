const mongoose = require("mongoose");
const SubCategory = require("../models/subCategories");
const Category = require("../models/categories");
const Product = require("../models/product");

exports.subCategories_create = (req, res, next) => {
   Category.findById(req.body.categoryId)
      .exec()
      .then(result => {
         if (!result) {
            return res.status(404).json({
               message: "Category not found"
            });
         }
         // category is ok, so we create new subcategory
         const subCategory = new SubCategory({
            _id: new mongoose.Types.ObjectId(),
            categoryId: req.body.categoryId,
            name: req.body.name,
            imageURL: req.body.imageURL
         });
         subCategory
            .save()
            .then(result => {
               res.status(201).json({
                  message: "Sub Category created",
                  createdSubCategory: {
                     name: result.name,
                     categoryId: result.categoryId,
                     imageURL: result.imageURL,
                     _id: result._id
                  },
                  request: {
                     type: "GET",
                     url: "http://localhost:3000/subCategories/" + result._id
                  }
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

exports.subCategories_get_all = (req, res, next) => {
   SubCategory.find()
      .select("_id categoryId name imageURL createdAt updatedAt")
      .exec()
      .then(docs => {
         const response = {
            count: docs.length,
            subCategories: docs.map(doc => {
               return {
                  _id: doc._id,
                  name: doc.name,
                  imageURL: doc.imageURL,
                  categoryId: doc.categoryId,
                  createdAt: doc.createdAt,
                  updatedAT: doc.updatedAt,
                  request: {
                     type: "GET",
                     url: "http://localhost:3000/categories/" + doc._id
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

exports.subCategories_find_by_id = (req, res, next) => {
   const id = req.params.subCategoryId;
   SubCategory.findById(id)
      .select("_id categoryId name imageURL")
      .exec()
      .then(doc => {
         if (doc) {
            res.status(200).json({
               subCategory: doc,
               request: {
                  type: "GET",
                  url: "http://localhost:3000/subCategories"
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

exports.subCategories_update = (req, res, next) => {
   const id = req.params.subCategoryId;
   // const updateOps = {};
   // console.log(req.body);
   // for (let ops in req.body) {
   //    updateOps[ops.propName] = ops.value;
   // }
   // console.log(updateOps);
   SubCategory.update({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
         console.log(result);
         res.status(200).json({
            message: "Sub Category Updated",
            request: {
               type: "GET",
               url: "http://localhost:3000/subCategories/" + id
            }
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.subCategories_delete = (req, res, next) => {
   const id = req.params.subCategoryId;
   // console.log(id);
   // First check if this subcategory has products linked
   // if exists ask user to delete that first
   Product.find({ subCategoryId: id })
      .exec()
      .then(result => {
         if (result.length > 0) {
            return res.status(401).json({
               message:
                  "Products linked with this sub category, delete them first",
               productList: result.map(doc => {
                  return {
                     _id: doc._id,
                     name: doc.name
                  };
               })
            });
         }

         SubCategory.remove({ _id: id })
            .exec()
            .then(result => {
               res.status(200).json({
                  message: "Subcategory deleted"
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
