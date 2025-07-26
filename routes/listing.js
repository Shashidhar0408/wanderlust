const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary"); // ✅ Import cloudinary config
const upload = multer({ storage }); // ✅ Use Cloudinary storage

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");

// INDEX ROUTE
router.get("/", wrapAsync(listingController.index));

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// CREATE ROUTE ✅ Updated with Cloudinary Upload
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"), // ✅ image upload field
  validateListing,
  wrapAsync(listingController.createListing)
);

// SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// UPDATE ROUTE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"), // ✅ Optional image update
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
