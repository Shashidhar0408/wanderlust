const express = require("express");
const router = express.Router();
const  wrapAsync = require("../utils/wrapAsync.js")
// const Listing = require("../models/listing.js");
const {isLoggedIn,  isOwner, validateListing}  = require("../middleware.js")
const listingController = require("../controller/listings.js")





// INDEX ROUTE 

router.get("/", wrapAsync(listingController.index));
  
    // NEW ROUTE 
  router.get("/new", isLoggedIn, listingController.renderNewForm);
  
 
  // SHOW ROUTE 
  router.get("/:id",wrapAsync(listingController.renderNewForm));
  

    // Create ROute 
    router.post(
      "/", 
      isLoggedIn,
      validateListing,
      wrapAsync(listingController.createListing ));
 
  // edit route 
  router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing ));
  
  
  // update route 
  router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
     wrapAsync(listingController.updateListing));
  
  
  // delete route 
  router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
     wrapAsync( listingController.deleteListing));


  module.exports = router;