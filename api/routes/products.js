const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");


// ===== Image File upload API ======
router.post("/uploadImage", ProductsController.products_upload_image);

// ===== Product API =========

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, ProductsController.products_create);

router.get("/:productId", ProductsController.products_find_by_id);

router.patch("/:productId", checkAuth, ProductsController.products_update);

router.delete("/:productId", checkAuth, ProductsController.products_delete);

module.exports = router;
