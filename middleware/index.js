var Park = require("../models/park");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkParkOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Park.findById(req.params.id, function(err, foundPark){
           if(err){
			   req.flash("error", "park not found");
               res.redirect("back");
           }  else {
               // does user own the park?
            if(foundPark.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "permission required")
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "you need to login")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "permission required");
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "you need to login");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please login first!");
    res.redirect("/login");
}

module.exports = middlewareObj;