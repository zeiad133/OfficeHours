var express = require("express"),
	router = express.Router(),
	jwt = require("jsonwebtoken"),
	cloudinary = require('cloudinary'),
	multer  = require('multer'),
	cloudinaryStorage = require('multer-storage-cloudinary'),
	path = require('path'),
	express = require('express'),
	app = express();
	cloudinary.config({  //Your Cloudinary API Data
	  cloud_name: 'dgwildqsv',
	  api_key: '885116352125168',
	  api_secret: 'dwvBE716ok5Aoh0m2PSWDXIkLCM'
	});
	reservationCtrl = require("../controllers/reservation.controller"),
	authCtrl = require("../controllers/auth.controller"),
	requestCtrl = require("../controllers/application.controller"),
	userCtrl = require("../controllers/user.controller"),
	topicCtrl = require("../controllers/topic.controller"),
	scheduleCtrl = require("../controllers/schedule.controller"),
	expertCtrl = require("../controllers/expert.controller"),
	requestselectCtrl = require("../controllers/requestselecting.controller"),
	questionCtrl = require("../controllers/question.controller");
adminCtrl = require("../controllers/admin.controller");
acceptedrequestCtrl = require("../controllers/acceptedRequest.controller");
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var url = "mongodb://localhost:27017/office-hours";
// 	var path = require('path');
//   var fs = require('fs');
//   var crypto = require('crypto');
//   var path = require('path')
//   var multer = require('multer')

//   var storage = multer.diskStorage({
// 	destination: './public/images/',
// 	filename: function (req, file, cb) {
// 	  crypto.pseudoRandomBytes(16, function (err, raw) {
// 		if (err) return cb(err);

// 		cb(null, raw.toString('hex') + path.extname(file.originalname));
// 	  })
// 	}
//   })

//   var upload = multer({ storage: storage })

//   router.get('/', function (req, res) {
// 	  res.render('register');
//   });

var isAuthenticated = function(req, res, next) {
	var token = req.headers["authorization"];
	if (!token) {
		return res.status(401).json({
			error: null,
			msg: "You have to login first before you can access your lists.",
			data: null
		});
	}
	jwt.verify(token, req.app.get("secret"), function(err, decodedToken) {
		if (err) {
			return res.status(401).json({
				error: err,
				msg: "Login timed out, please login again.",
				data: null
			});
		}
		req.decodedToken = decodedToken;
		next();
	});
};

var isNotAuthenticated = function(req, res, next) {
	// Check that the request doesn't have the JWT in the authorization header
	var token = req.headers["authorization"];
	if (token) {
		return res.status(403).json({
			error: null,
			msg: "You are already logged in.",
			data: null
		});
	}
	next();
};

//-----------------------------Authentication Routes-------------------------
router.post("/auth/register", isNotAuthenticated, authCtrl.register);
router.post("/auth/login", isNotAuthenticated, authCtrl.login);
router.post(
	"/auth/googlereg",
	isNotAuthenticated,
	authCtrl.authenticateWithGoogle
);
router.post("/auth/login", isNotAuthenticated, authCtrl.login);
router.post("/auth/googlelogin", isNotAuthenticated, authCtrl.googleLogin);

//----------------------------Schedule----------------------------------
router.post(
	"/schedule/createSchedule",
	isAuthenticated,
	scheduleCtrl.createSchedule
);
router.get(
	"/schedule/getSchedules",
	isAuthenticated,
	scheduleCtrl.getSchedules
);
router.get(
	"/schedule/getSchedule/:scheduleId",
	isAuthenticated,
	scheduleCtrl.getSchedule
);
router.delete(
	"/schedule/deleteSchedule/:scheduleId",
	isAuthenticated,
	scheduleCtrl.deleteSchedule
);
router.delete(
	"/schedule/deleteSchedules",
	isAuthenticated,
	scheduleCtrl.deleteSchedules
);
router.patch(
	"/schedule/updateSchedule/:scheduleId",
	isAuthenticated,
	scheduleCtrl.updateSchedule
);

//---------------------------Sending slots--------------------------------------
router.post(
	"/user/sendingSlots",
	isAuthenticated,
	acceptedrequestCtrl.sendingSlots
);

//----------------------------FavoriteExpert----------------------------------
router.post(
	"/user/AddFavoriteExpert",
	isAuthenticated,
	userCtrl.AddFavoriteExpert
);
router.get("/user/getfavExperts", isAuthenticated, userCtrl.getfavExperts);
router.delete(
	"/user/deleteFavoriteExpert/:username",
	isAuthenticated,
	userCtrl.deleteFavoriteExpert
);
router.post("/user/AddNote", isAuthenticated, userCtrl.AddNote);
router.get(
	"/user/getfavExpertsByUsername/:keyword",
	isAuthenticated,
	userCtrl.getfavExpertsByUsername
);

//---------------------------SelectTopic--------------------------------------
router.post(
	"/user/createTopicfortesting",
	isAuthenticated,
	userCtrl.createTopicfortesting
);
router.post(
	"/user/ExpertSelectTopic",
	isAuthenticated,
	userCtrl.ExpertSelectTopic
);


//-------------------------------Application Routes-----------------------------------
router.get(
	"/application/getApplications",
	isAuthenticated,
	requestCtrl.getApplications
);
router.post(
	"/application/applyForExpert",
	isAuthenticated,
	requestCtrl.applyForExpert
);
router.delete(
	"/application/deleteApplication/:requestId",
	isAuthenticated,
	requestCtrl.deleteApplication
);
// router.post(
// 	"/request/AddingExpert/:requestId",
// 	isAuthenticated,
// 	requestselectCtrl.AddExpertToReq
// );

//-------------------------------Question Routes--------------------------------------
router.post(
	"/question/createQuestion",
	isAuthenticated,
	questionCtrl.createQuestion
);

router.post(
	"/question/createFeedback",
	isAuthenticated,
	questionCtrl.createFeedback
);
router.get(
	"/question/getQuestionsByStatus/:status",
	isAuthenticated,
	questionCtrl.getQuestionsByStatus
);
router.delete(
	"/question/deleteQuestion/:questionId",
	isAuthenticated,
	questionCtrl.deleteQuestion
);
router.patch(
	"/question/sendMessage/:questionId",
	isAuthenticated,
	questionCtrl.sendMessage
);
router.patch(
	"/question/updateQuestion/:questionId",
	isAuthenticated,
	questionCtrl.updateQuestion
);

router.patch(
	"/question/addSlots/:questionId",
	isAuthenticated,
	questionCtrl.addSlots
);

router.patch(
	"/question/selectSlot/:questionId",
	isAuthenticated,
	questionCtrl.selectSlot
);

router.patch(
	"/question/addroom/:questionId",
	isAuthenticated,
	questionCtrl.addroom
);
router.post(
	"/question/getroom",

	questionCtrl.getroom
);

router.patch(
	"/question/acceptQuestion/:questionId",
	isAuthenticated,
	questionCtrl.acceptRequest
);

router.patch(
	"/question/rejectQuestion/:questionId",
	isAuthenticated,
	questionCtrl.rejectRequest
);

router.get(
	"/question/getQuestionUser",
	isAuthenticated,
	questionCtrl.getQuestionsByUsername
);

router.get(
	"/question/getQuestionsByRoomUser/:sessionRoom",
	isAuthenticated,
	questionCtrl.getQuestionsByRoomUser
);

router.get(
	"/question/getQuestionExp",
	isAuthenticated,
	questionCtrl.getQuestionsByExpert
);

router.get(
	"/question/getQuestionsByRoomEx/:sessionRoom",
	isAuthenticated,
	questionCtrl.getQuestionsByRoomEx
);

//-------------------------------User Routes--------------------------------------
router.get("/user/getUsers", isAuthenticated, userCtrl.getUsers);
router.get(
	"/user/getUserByUsername/:username",
	isAuthenticated,
	userCtrl.getUserByUsername
);
router.get(
	"/user/getUserByType/:type",
	isAuthenticated,
	userCtrl.getUserByType
);
router.get("/user/getUser", isAuthenticated, userCtrl.getUser);
router.get("/user/profile", isAuthenticated, userCtrl.profile);
router.delete("/user/deleteUser/:userId", isAuthenticated, userCtrl.deleteUser);
router.patch("/user/updateUser", isAuthenticated, userCtrl.updateUser);
router.patch(
	"/user/updateUserPassword",
	isAuthenticated,
	userCtrl.updateUserPassword
);
router.post(
	"/user/createExperience",
	isAuthenticated,
	userCtrl.createExperience
);
router.get("/user/getExperience", isAuthenticated, userCtrl.getExperience);
router.get("/user/getNotes", isAuthenticated, userCtrl.viewNotes);
router.post("/user/createNotes", isAuthenticated, userCtrl.createNotes);
router.patch(
	"/user/updateExperience/:expId",
	isAuthenticated,
	userCtrl.updateExperience
);
router.patch("/user/updateNotes", isAuthenticated, userCtrl.updateNotes);
router.patch(
	"/user/updateExperiences",
	isAuthenticated,
	userCtrl.updateExperiences
);
router.delete(
	"/user/deleteExperience/:expId",
	isAuthenticated,
	userCtrl.deleteExperience
);
router.delete(
	"/user/deleteNote/:notesId",
	isAuthenticated,
	userCtrl.deleteNote
);
router.patch("/user/rateUser", isAuthenticated, userCtrl.rateUser);
router.patch("/user/updatePrivacy/", isAuthenticated, userCtrl.updatePrivacy);
router.patch("/user/updateUser", isAuthenticated, userCtrl.updateUser);
router.post("/user/requestExpert", isAuthenticated, userCtrl.requestExpert);
router.patch("/user/addAvatar", isAuthenticated, userCtrl.setAvatar);
var mongoose = require("mongoose"),
	User = mongoose.model("User");

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "../front-end/src/assets/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "" + file.originalname);
	}
});
var upload = multer({ storage: storage });

var insertDocuments = function(req, res, next, db, filePath, callback) {
	User.findOneAndUpdate(
		{ _id: req.params.userId },
		{ $set: { profilePic: filePath } },
		{ new: true }
	).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		return res.status(200).json({
			err: null,
			msg: "User Image updated successfully.",
			data: user
		});
	});
};
router.post("/fileUpload/:userId", upload.single("image"), (req, res, next) => {
	console.log("HEY", req.body);
	MongoClient.connect(url, (err, db) => {
		assert.equal(null, err);
		insertDocuments(req, res, next, db, "assets/" + req.file.filename, () => {
			db.close();
			res.json({ message: "File uploaded successfully" });
		});
	});
});
//-------------------------------Reservations Routes-----------------------------------
router.get(
	"/reservation/getReservation",
	isAuthenticated,
	reservationCtrl.getReservation
);
router.post(
	"/reservation/createReservation",
	isAuthenticated,
	reservationCtrl.createReservation
);
router.delete(
	"/reservation/deleteReservation/:resvId",
	isAuthenticated,
	reservationCtrl.deleteReservation
);
router.patch(
	"/reservation/updateReservation/:reservationId",
	isAuthenticated,
	reservationCtrl.updateReservation
);
//------------------------------- Topics Routes ----------------------------------
router.post("/topic/createTopic", isAuthenticated, topicCtrl.createTopic);
router.get("/topic/getTopic/:topicId", isAuthenticated, topicCtrl.getTopic);
router.get("/topic/getTopics", isAuthenticated, topicCtrl.getTopics);
router.patch("/topic/addExpert/:topicId", isAuthenticated, topicCtrl.addExpert);
router.get(
	"/topic/getExpertsByTopic/:topicTitle",
	isAuthenticated,
	topicCtrl.getExpertsByTopic
);
// router.get(
// 	"/topic/sortTopicsbyTitle" ,
// 	isAuthenticated,
// 	topicCtrl.sortTopicsbyTitle
// );

//-------------------------------Expert Routes-----------------------------------
router.get(
	"/expert/getExpertByUsername/:username",
	isAuthenticated,
	expertCtrl.getExpertByUsername
);
router.get("/expert/getExperts", isAuthenticated, expertCtrl.getExperts);
router.get(
	"/expert/getExpert/:expertId",
	isAuthenticated,
	expertCtrl.getExpert
);
router.get(
	"/expert/getExpertsByUsername/:username",
	isAuthenticated,
	expertCtrl.getExpertsByUsername
);



router.get(
	"/expert/getExpertsByTopic/:title",
	isAuthenticated,
	expertCtrl.getExpertsByUsername
);
router.post("/expert/createExpert", isAuthenticated, expertCtrl.createExpert);
router.patch(
	"/expert/updateExpert/:expertId",
	isAuthenticated,
	expertCtrl.updateExpert
);
router.patch(
	"/expert/addTopic/:expertId",
	isAuthenticated,
	expertCtrl.addTopic
);
router.get(
	"/expert/getExpertTopics",
	isAuthenticated,
	expertCtrl.getExpertTopics
);
router.delete(
	"/expert/deleteExpert/:username",
	isAuthenticated,
	expertCtrl.deleteExpert
);
router.post("/expert/BlockUser", isAuthenticated, expertCtrl.BlockUser);
router.get(
	"/expert/getblockedusers",
	isAuthenticated,
	expertCtrl.getblockedusers
);
router.delete(
	"/expert/unblockuser/:userid",
	isAuthenticated,
	expertCtrl.unblockuser
);

// Filtering experts part, when the user choose a a filter, one of the methods below is applied


/*Tested*/ router.get(
	"/expert/filterByOverview/:overview",
	isAuthenticated,
	expertCtrl.filterByOverview
);
/*Tested*/ router.get(
	"/expert/filterByTopicTitle/:title",
	isAuthenticated,
	expertCtrl.filterByTopicTitle
);
/*Tested*/ router.get(
	"/expert/filterByOverviewAndTitle/:overview/:title",
	isAuthenticated,
	expertCtrl.filterByOverviewAndTitle
);
/*Tested*/ router.get(
	"/expert/filterByTopicTitleAndRatingHighToLow/:title",
	isAuthenticated,
	expertCtrl.filterByTopicTitleAndRatingHighToLow
);
/*Tested*/ router.get(
	"/expert/filterByTopicTitleAndRatingLowToHigh/:title",
	isAuthenticated,
	expertCtrl.filterByTopicTitleAndRatingLowToHigh
);
/*Tested*/ router.get(
	"/expert/filterByOverviewAndRatingHighToLow/:overview",
	isAuthenticated,
	expertCtrl.filterByOverviewAndRatingHighToLow
);
/*Tested*/ router.get(
	"/expert/filterByOverviewAndRatingLowToHigh/:overview",
	isAuthenticated,
	expertCtrl.filterByOverviewAndRatingLowToHigh
);
/*Tested*/ router.get(
	"/expert/filterByOverviewAndTitleAndratingHighToLow/:overview/:title",
	isAuthenticated,
	expertCtrl.filterByOverviewAndTitleAndratingHighToLow
);
/*Tested*/ router.get(
	"/expert/filterByOverviewAndTitleAndRatingLowToHigh/:overview/:title",
	isAuthenticated,
	expertCtrl.filterByOverviewAndTitleAndRatingLowToHigh
);
// END OF FILTERING PART

//Additional filtering methods
/*Tested*/ router.get(
	"/expert/sortExpertsUsername/:type",
	isAuthenticated,
	expertCtrl.sortExpertsUsername
);

/*Tested*/ router.get(
    "/expert/sortExpertsRating/:type",

    expertCtrl.sortExpertsRating
);

//Search method but needs modification
/*Tested*/ router.get(
	"/expert/searchByUsername/:keyword",
	isAuthenticated,
	expertCtrl.searchByUsername
);
router.get(
	"/expert/filterByTopicTitleAndUsernameHighToLow/:title",
	isAuthenticated,
	expertCtrl.filterByTopicTitleAndUsernameHighToLow
);

router.get(
	"/expert/filterByTopicTitleAndUsernameLowToHigh/:title",
	isAuthenticated,
	expertCtrl.filterByTopicTitleAndUsernameLowToHigh
);

//-------------------------------Admin Routes-----------------------------------
router.post("/admin/addAdmin", isAuthenticated, adminCtrl.addAdmin);
router.post("/admin/removeAdmin", isAuthenticated, adminCtrl.removeAdmin);
router.patch("/admin/acceptExpert", isAuthenticated, adminCtrl.acceptExpert);
router.get("/admin/getFeedbacks", isAuthenticated, adminCtrl.getFeedbacks);
router.post("/admin/createFeedback", isAuthenticated, adminCtrl.createFeedback);
router.delete(
	"/admin/deleteFeedback/:feedbackId",
	isAuthenticated,
	adminCtrl.deleteFeedback
);
//---------------------------Avatar--------------------------------------
router.post("/user/setAvatar",  isAuthenticated,
multer({storage: cloudinaryStorage({
 cloudinary: cloudinary,
 allowedFormats: ['jpg', 'png'],
 destination: function (req, file, callback) { callback(null, './uploads');},
 filename: function (req, file, callback) { callback(null, req.decodedToken.user.username)}}) // Name of the image which will be uploaded to your Cloudinary storage
}).single('Image'), userCtrl.setAvatar
);
module.exports = router;
