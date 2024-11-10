const express = require("express");
const app  =  express();
const mongoose =require("mongoose");
const Listing = require("./models/listing.js");
const path =  require("path")
const methodOverride  = require("method-override");
const  ejsMate = require("ejs-mate");
const  wrapAsync = require("./utils/wrapAsync.js")
const  ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema}  = require("./schema.js")
const Review = require("./models/reviews.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(()  => {
  console.log("Connected to MongoDB");
})
.catch((err)  => {
  console.log(err);
})

async function main(){
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use (express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


app.get("/", (req, res)  => {
  res.send("hi iam root");
})


const validateListing = (req, res, next)  =>{
  let {error} =  listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg )
  }else{
    next();
  }
}


const validateReview = (req, res, next)  =>{
  let {error} =  reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg )
  }else{
    next();
  }
}


// INDEX ROUTE 

app.get("/listings", wrapAsync(async(req, res)  => {
  const allListings =  await Listing.find({});
  res.render("./listings/index.ejs", {allListings})
  }));

  // NEW ROUTE 
app.get("/listings/new", wrapAsync(async (req, res)  => {
  res.render("./listings/new.ejs")
}));

  // Create ROute 
  app.post("/listings", 
    validateListing,
    wrapAsync(async (req, res,next) =>{
      const newListing = new  Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
    
    }));

// SHOW ROUTE 
app.get("/listings/:id",wrapAsync( async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing})
}));

// edit route 
app.get("/listings/:id/edit",wrapAsync( async (req, res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", {listing})
}));


// update route 
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));


// delete route 
app.delete("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// REVIEWS  
// post route of  REVIEWS 
app.post("/listings/:id/reviews",validateReview,wrapAsync( async(req, res)  => {
 let listing = await Listing.findById(req.params.id)
 let newReview = new Review(req.body.review)

 listing.reviews.push(newReview)

 await newReview.save();
 await listing.save();

 res.redirect(`/listings/${listing._id}`)
}));



//  app.get("/testListing", async (req, res)  =>{
//   let sampleListing = new Listing({
//     title : "My New Villa",
//     description : "This is a beautiful villa with a pool and a garden",
//     price : 1000,
//     location : "Hyderabad", 
//     country : "India"

//   })
//  await sampleListing.save();
//  console.log("sample Was Saved");
//  res.send("successful")
 
// })
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"))
})

app.use((err, req, res, next)=>{
  let {statusCode = 500, message = "something went wrong!"} = err;
  res.status(statusCode).render("./listings/error.ejs", {err});
  // res.status(statusCode).send(message)
})


app.listen(8080 , () =>{
    console.log("server is listening to port 8080");
})
