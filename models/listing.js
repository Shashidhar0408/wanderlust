const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// Add virtual to auto-generate thumbnail URL (optional, for UI use)
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
  image: {
  type: ImageSchema,
  required: true, // Ensures every listing must have a valid image object
}

  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Cascade delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
