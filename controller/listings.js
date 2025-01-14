const Listing = require("../models/listing");





// module for index route 
module.exports.index = async(req, res)  => {
    const allListings =  await Listing.find({});
    res.render("./listings/index.ejs", {allListings})
    }


// module for new form 
module.exports.renderNewForm = (req, res)  => {
    res.render("listings/new.ejs")
  }

//   module for showing the listings 
  module.exports.showListing =  async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
         populate : {path : "author"},
        })
    .populate("owner");
    if(!listing){
      req.flash("error", "listing you requested doesnot exist")
      res.redirect("/listings");
    };
    console.log(listing);
    res.render("./listings/show.ejs", {listing})
  }



//   module to create new listings 
  module.exports.createListing = async (req, res,next) =>{
    const newListing = new  Listing(req.body.listing);
    newListing.owner =req.user._id;
    await newListing.save();
    req.flash("success", "new listing created")
    res.redirect("/listings");
  }


// module for editing the listing 
  module.exports.editListing = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "listing you requested doesnot exist")
      res.redirect("/listings")
    };
    res.render("/listings/edit.ejs", {listing})    
  }


// module for updating the listing 
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success", "listing updated")
     res.redirect(`/listings/${id}`);
   }



//    module for deleting the listing 
   module.exports.deleteListing =async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted")
    res.redirect("/listings");
  }