const Listing = require("../models/listing");
const { cloudinary } = require("../cloudinary");

// INDEX — Show all listings safely with fallback images
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});

  const allListings = listings.map((listing) => {
    // Convert legacy string image to object
    if (typeof listing.image === "string") {
      listing.image = {
        url: listing.image,
        filename: "default",
      };
    }

    // Assign default image if missing or malformed
    if (!listing.image || !listing.image.url) {
      listing.image = {
        url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
        filename: "default",
      };
    }

    return listing;
  });

  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE LISTING
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

// SHOW LISTING
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// EDIT LISTING
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

// DELETE LISTING
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
