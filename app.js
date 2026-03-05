if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter =  require("./routes/listing.js") 
const reviewRouter =  require("./routes/review.js")
const userRouter =  require("./routes/user.js")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //Storing data for user
passport.deserializeUser(User.deserializeUser()); //Removing session data of the user after logout

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// });


// app.get("/", (req,res) => {
//     res.send("Hi, I am root");
// });


// const validateListing = (req,res,next) =>{
//         let {error} = listingSchema.validate(req.body);
//         if(error){
//             let errMsg = error.details.map((el)=>el.message).join(",");
//             throw new ExpressError(400,error);
//         } else{
//             next();
//         }
// }




app.use("/listings", listingRouter );
app.use("/listings/:id/reviews", reviewRouter );
app.use("/", userRouter );

app.all("*all", (req,res,next) =>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err, message });
});

app.listen(8080, () => {
    console.log("App is listening to port 8080");
});

// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description:"BY the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Successful Testing");
// });