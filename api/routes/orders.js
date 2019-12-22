const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/orders");

// Orders endpoints
router.get("/", checkAuth, OrdersController.orders_get_all_for_admin);

router.post("/", checkAuth, OrdersController.orders_create);

router.get("/:orderId", checkAuth, OrdersController.orders_find_by_id);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete);

// TODO: Create endpoints to view all orders that belongs to specific customer

module.exports = router;
