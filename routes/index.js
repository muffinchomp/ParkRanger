var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
});

//Auth Routes
router.get("/register", function(req,res){
	res.render("register");
});

//Sign Up
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "welcome" + user.username);
			res.redirect("/parks");
		});
	});
});

//login form
router.get("/login", function(req, res){
	res.render("login");
});
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/parks",
		failureRedirect: "/login"
	}),	function(req, res){
});
//lougout from
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "logged out");
	res.redirect("/parks");
});


module.exports = router;