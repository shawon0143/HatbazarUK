const mongoose = require("mongoose");
const Product = require("../models/product");
const Order = require("../models/orders");

exports.orders_get_all_for_admin = (req, res, next) => {
   Order.find()
      .select("invoiceRef orderStatus totalAmount cart _id createdAt updatedAt")
      .exec()
      .then(docs => {
         res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
               return {
                  _id: doc._id,
                  invoiceRef: doc.invoiceRef,
                  orderStatus: doc.orderStatus,
                  totalAmount: doc.totalAmount,
                  createdAt: doc.createdAt,
                  updatedAT: doc.updatedAt,
                  cart: doc.cart,
                  request: {
                     type: "GET",
                     url: "http://localhost:3000/orders/" + doc._id
                  }
               };
            })
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
};

exports.orders_create = (req, res, next) => {
   let allProductsIdArray = [];
   for (let key in req.body.cart) {
      allProductsIdArray.push(key);
   }

   Product.find({
      _id: { $in: allProductsIdArray }
   })
      .exec()
      .then(result => {
         if (!result) {
            return res.status(404).json({
               message: "Product not found"
            });
         }
         // all ids are ok. so we create new order
         const order = new Order({
            _id: mongoose.Types.ObjectId(),
            userId: req.body.userId,
            totalAmount: req.body.totalAmount,
            invoiceAddress: req.body.invoiceAddress,
            deliveryType: req.body.deliveryType,
            deliveryAddress: req.body.deliveryAddress,
            deliveryDate: req.body.deliveryDate,
            invoiceRef: req.body.invoiceRef,
            orderStatus: req.body.orderStatus,
            feedback: req.body.feedback,
            cart: req.body.cart
         });

         order
            .save()
            .then(result => {
               console.log(result);
               res.status(201).json({
                  message: "Order stored",
                  createdOrder: {
                     _id: result._id,
                     userId: result.userId,
                     totalAmount: result.totalAmount,
                     invoiceAddress: result.invoiceAddress,
                     deliveryType: result.deliveryType,
                     deliveryAddress: result.deliveryAddress,
                     deliveryDate: result.deliveryDate,
                     invoiceRef: result.invoiceRef,
                     orderStatus: result.orderStatus,
                     feedback: result.feedback,
                     cart: result.cart
                  },
                  request: {
                     type: "GET",
                     url: "http://localhost:3000/orders/" + result._id
                  }
               });
            })
            .catch(err => {
               console.log(err);
               res.status(500).json({ error: err });
            });
      })
      .catch(err => {
         res.status(500).json({
            message: "Product not found",
            error: err
         });
      });
};

exports.orders_find_by_id = (req, res, next) => {
   Order.findById(req.params.orderId)
      .exec()
      .then(order => {
         if (!order) {
            return res.status(404).json({
               message: "Order not found"
            });
         }
         res.status(200).json({
            order: order,
            request: {
               type: "GET",
               url: "http://localhost:3000/orders"
            }
         });
      })
      .catch(err => {
         res.status(500).json({
            error: err
         });
      });
};

exports.orders_delete = (req, res, next) => {
   Order.remove({ _id: req.params.orderId })
      .exec()
      .then(result => {
         res.status(200).json({
            message: "Order deleted"
         });
      })
      .catch(err => {
         res.status(500).json({
            error: err
         });
      });
};
