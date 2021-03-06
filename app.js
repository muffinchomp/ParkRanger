var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	flash = require("connect-flash"),
	session = require('express-session'),
	MongoDBStore = require('connect-mongodb-session')(session),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Park = require("./models/park"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds"),
	store = new MongoDBStore({
  		uri: "mongodb+srv://devuser:C3Hfsx7gRbqe9yA@cluster0-oqra2.mongodb.net/test?retryWrites=true&w=majority",
  		collection: 'myParks'
	});

//Routes
var commentRoutes = require("./routes/comments"),
	parkRoutes = require("./routes/parks"),
	indexRoutes = require("./routes/index")

mongoose.connect("mongodb+srv://devuser:C3Hfsx7gRbqe9yA@cluster0-oqra2.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passport Congig
app.use(require("express-session")({
	secret: "Cane's chicken",
	store: store,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/parks/:id/comments", commentRoutes);
app.use("/parks", parkRoutes);




app.listen(3000, process.env.IP, function(){
	console.log("up");
});