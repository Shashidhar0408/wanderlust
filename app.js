const express = require("express");
const app  =  express();
const mongoose =require("mongoose");
const path =  require("path")
const methodOverride  = require("method-override");
const  ejsMate = require("ejs-mate");
const  ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")




app.use(express.static(path.join(__dirname,"/public")))


app.use (express.urlencoded({extended : true}));
app.use(methodOverride("_method"));


const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires: Date.now() + 7 * 24 * 60 * 1000,
    maxAge :  7 * 24 * 60 * 1000,
    httpOnly : true ,
  }
};


const  listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter  = require("./routes/user.js")


app.get("/", (req, res)  => {
  res.send("hi iam root");
});

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})
  

// app.get("/demouser", async(req, res)  => {
//   let fakeUser = new User({
//     email : "student@gmai.com",
//     username : "delta-student"
//   });

//  let registeredUser = await User.register(fakeUser, "helloworld")
//  res.send(registeredUser)
// })



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"))
})

app.use((err, req, res, next)=>{
  let {statusCode = 500, message = "something went wrong!"} = err;
  res.status(statusCode).render("./listings/error.ejs", {err});
  // res.status(statusCode).send(message)
})

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
app.engine("ejs", ejsMate);






app.listen(8080 , () =>{
    console.log("server is listening to port 8080");
})
