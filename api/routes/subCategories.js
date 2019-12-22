const express = require("express");
const router = express.Router();


const checkAuth = require("../middleware/check-auth");

const SubCategoriesController = require("../controllers/subCategories");

// create new categories
router.post("/", checkAuth, SubCategoriesController.subCategories_create);

router.get("/", SubCategoriesController.subCategories_get_all);

router.get("/:subCategoryId", SubCategoriesController.subCategories_find_by_id);

router.patch("/:subCategoryId", checkAuth, SubCategoriesController.subCategories_update );

router.delete("/:subCategoryId", checkAuth, SubCategoriesController.subCategories_delete);

module.exports = router;
