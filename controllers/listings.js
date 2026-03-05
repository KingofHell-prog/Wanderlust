const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    // 1. Extract 'search' from the URL query string
    const { search } = req.query;
    let allListings;
    if (search) {
        // 2. Query the database using a Regular Expression (case-insensitive)
        allListings = await Listing.find({
            $or: [
                { location: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
    } else {
        // 3. If no search term, show all listings as usual
        allListings = await Listing.find({});
    }
    // 4. Handle "No results" by flashing an error and staying on the page
    if (allListings.length === 0 && search) {
        req.flash("error", "No listings found for that destination.");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate: {path: "author" }})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next) => {

    let response = await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send();

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success","New listing created !");
        res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs",{listing, originalImageURL});
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing} );

    if(typeof req.file!== undefined){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    };

    req.flash("success","Listing Upadated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted !");
    res.redirect("/listings");
};