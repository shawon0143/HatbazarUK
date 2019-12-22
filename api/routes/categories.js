const express = require("express");
const router = express.Router();


const checkAuth = require("../middleware/check-auth");

const CategoriesController = require("../controllers/categories");

// create new categories
router.post("/", checkAuth, CategoriesController.categories_create);

router.get("/", CategoriesController.categories_get_all);

router.get("/:categoryId", CategoriesController.categories_find_by_id);

router.patch("/:categoryId", checkAuth, CategoriesController.categories_update );

router.delete("/:categoryId", checkAuth, CategoriesController.categories_delete);

module.exports = router;
