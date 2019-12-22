const mongoose = require("mongoose");
const Category = require("../models/categories");
const SubCategory = require("../models/subCategories");

exports.categories_create = (req, res, next) => {
   const category = new Category({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      imageURL: req.body.imageURL
   });
   category
      .save()
      .then(result => {
         res.status(201).json({
            message: "Category created",
            createdCategory: {
               name: result.name,
               imageURL: result.imageURL,
               _id: result._id
            },
            request: {
               type: "GET",
               url: "http://localhost:3000/categories/" + result._id
            }
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.categories_get_all = (req, res, next) => {
   Category.find()
      .select("_id name imageURL createdAt updatedAt")
      .exec()
      .then(docs => {
         const response = {
            count: docs.length,
            categories: docs.map(doc => {
               return {
                  _id: doc._id,
                  name: doc.name,
                  imageURL: doc.imageURL,
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

exports.categories_find_by_id = (req, res, next) => {
   const id = req.params.categoryId;
   Category.findById(id)
      .select("_id name imageURL")
      .exec()
      .then(doc => {
         if (doc) {
            res.status(200).json({
               category: doc,
               request: {
                  type: "GET",
                  url: "http://localhost:3000/categories"
               }
            });
         } else {
            res.status(404).json({
               error: "No valid entry found for categoryId"
            });
         }
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.categories_update = (req, res, next) => {
   const id = req.params.categoryId;
   // const updateOps = {};
   // console.log(req.body);
   // for (let ops in req.body) {
   //    updateOps[ops.propName] = ops.value;
   // }
   // console.log(updateOps);
   Category.update({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
         console.log(result);
         res.status(200).json({
            message: "Category Updated",
            request: {
               type: "GET",
               url: "http://localhost:3000/categories/" + id
            }
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.categories_delete = (req, res, next) => {
   const id = req.params.categoryId;
   // First check if this category has sub category
   // if exists ask user to delete that first
   SubCategory.find({ categoryId: id })
      .exec()
      .then(result => {
         if (result.length > 0) {
            return res.status(401).json({
               message:
                  "Sub Categories linked with this category, delete them first",
               subCategoryList: result.map(doc => {
                  return {
                     _id: doc._id,
                     name: doc.name
                  };
               })
            });
         }
         Category.remove({ _id: id })
            .exec()
            .then(result => {
               res.status(200).json({
                  message: "Category deleted"
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
