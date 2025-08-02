const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // ✅ Cloudinary config
const upload = multer({ storage }); // ✅ Multer using Cloudinary

const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware.js");
const listingController = require("../controller/listings.js");

// ✅ INDEX: Show all listings
router.get("/", wrapAsync(listingController.index));

// ✅ NEW: Show form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ✅ CREATE: Create a listing with image upload
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"), // field name matches form input
  validateListing,
  wrapAsync(listingController.createListing)
);

// ✅ SHOW: Show individual listing
router.get("/:id", wrapAsync(listingController.showListing));

// ✅ EDIT: Show edit form (only if owner)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

// ✅ UPDATE: Update listing (image optional)
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"), // allow replacing image
  validateListing,
  wrapAsync(listingController.updateListing)
);

// ✅ DELETE: Delete listing (only owner)
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
