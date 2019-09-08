var express = require("express");
var router = express.Router();
var Park = require("../models/park");
var middleware = require("../middleware");

//INDEX - show all parks
router.get("/", function(req, res){
	//get all parks from db
	Park.find({}, function(err, allParks){
		if(err){
			console.log(err);
		} else{
			 res.render("parks/index", {parks: allParks});
		}
	});
});

//CREATE - add new parks to db
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to parks array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newPark = {name: name, image: image, description: description, author: author};
	//create a new park and save to db
	Park.create(newPark, function(err, newCreate){
		if(err){
			console.log(err);
		} else{
			console.log(newCreate);
			res.redirect("/parks");
		}
	});
});

//NEW - show form to create new park
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("parks/new");
});

//SHOW - show more info about park
router.get("/:id", function(req, res){
	//find park with ID
	Park.findById(req.params.id).populate("comments").exec(function(err, foundPark){
		if(err){
			console.log(err);
		} else{
			console.log(foundPark);
			//render show page view
			res.render("parks/show", {park: foundPark});
		}
	});
});

//EDIT 
router.get("/:id/edit", middleware.checkParkOwnership, function(req, res){
	Park.findById(req.params.id, function(err, foundPark){
		res.render("parks/edit", {park: foundPark});			
	});
});


//UPDATE
router.put("/:id", middleware.checkParkOwnership, function(req, res){
	//find and update page
	Park.findByIdAndUpdate(req.params.id, req.body.park, function(err, updatedPark){
		if(err){
			res.redirect("/parks");
		} else{
			res.redirect("/parks/" + req.params.id);
		}
	});
});

//DESTROY
router.delete("/:id", middleware.checkParkOwnership, function(req, res){
	Park.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/parks");
		} else{
			res.redirect("/parks");
		}
	});
});

module.exports = router;
