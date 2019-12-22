const express = require("express");
const router = express.Router();


const checkAuth = require("../middleware/check-auth");

const BrandController = require("../controllers/brands");

// create new categories
router.post("/", checkAuth, BrandController.brands_create);

router.get("/", BrandController.brands_get_all);

router.get("/:brandId", BrandController.brands_find_by_id);
//
router.patch("/:brandId", checkAuth, BrandController.brands_update );
//
router.delete("/:brandId", checkAuth, BrandController.brands_delete);

module.exports = router;