var express = require("express");
var router = express.Router({mergeParams: true});
var Park = require("../models/park");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENT ROUTES   New
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find park by id
	Park.findById(req.params.id, function(err, park){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {park: park});
		}
	});
});

// Create Comments
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup park ID
	Park.findById(req.params.id, function(err, park){
		if(err){
			console.log(err);
			res.redirect("/parks");
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					re.flash("error", "Something bad happened");
					console.log(err);
				} else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					park.comments.push(comment);
					park.save();
					req.flash("success", "successfully added comment");
					res.redirect("/parks/" + park._id);
				}
			});
		}
	});
	//create new comment
	//connect comment to park and redirect back 
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {park_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/parks/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
		   req.flash("success", "comment deleted");
           res.redirect("/parks/" + req.params.id);
       }
    });
});

module.exports = router;