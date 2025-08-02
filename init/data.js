const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo connection failed", err));

const seedListings = async () => {
  await Listing.deleteMany({});

  const defaultUser = await User.findOne(); // pick any user as owner

  const listings = [
    {
      title: "Beachside Bliss",
      description: "Relax at this stunning beachside home.",
      image: {
        url: "https://res.cloudinary.com/demo/image/upload/v1711675612/sample.jpg",
        filename: "sample.jpg",
      },
      price: 3000,
      location: "Goa",
      country: "India",
      owner: defaultUser?._id,
    },
    {
      title: "Mountain Retreat",
      description: "Cozy cabin with a view of the Himalayas.",
      image: {
        url: "https://res.cloudinary.com/demo/image/upload/v1711675612/sample.jpg",
        filename: "sample.jpg",
      },
      price: 2500,
      location: "Manali",
      country: "India",
      owner: defaultUser?._id,
    },
    {
      title: "Urban Loft",
      description: "Modern loft in the heart of the city.",
      image: {
        url: "https://res.cloudinary.com/demo/image/upload/v1711675612/sample.jpg",
        filename: "sample.jpg",
      },
      price: 4000,
      location: "Bangalore",
      country: "India",
      owner: defaultUser?._id,
    },
  ];

  await Listing.insertMany(listings);
  console.log("Database seeded with listings ✅");
};

seedListings().then(() => mongoose.connection.close());
