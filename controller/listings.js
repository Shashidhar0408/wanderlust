const Listing = require("../models/listing");

// Module for index route 
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Module for new form 
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Module for showing a listing 
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings"); // ✅ Return to avoid sending multiple responses
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// Module to create a new listing 
// createListing
module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  listing.owner = req.user._id;
  await listing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect(`/listings/${listing._id}`);
};


// Module for editing a listing 
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings"); // ✅ Return added
  }

  res.render("listings/edit.ejs", { listing }); // ✅ Removed leading slash
};

// Module for updating a listing 
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

// Module for deleting a listing 
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
