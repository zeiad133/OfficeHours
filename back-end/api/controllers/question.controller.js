var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	Expert = mongoose.model("Expert"),
	User = mongoose.model("User"),
	nodemailer = require("nodemailer"),
	xoauth2 = require("xoauth2"),
	Question = mongoose.model("Question");
	Feedback = mongoose.model("Feedback");


/**
	let the user create question and add it to the DB
	@param{String} question and user token
	@return JSON{String } respons data nad msg
	**/

module.exports.createQuestion = function(req, res, next) {
	var valid =
		req.body.questionSubject &&
		Validations.isString(req.body.questionSubject) &&
		req.body.questionContent &&
		Validations.isString(req.body.questionContent);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"questionSubject(String) and questionContent(String) are required fields.",
			data: null
		});
	}

	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		Question.create(req.body, function(err, question) {
			if (err) {
				return next(err);
			}
			res.status(201).json({
				err: null,
				msg: "Question was created successfully.",
				data: question
			});
		});
	});
};





//--------------------------

module.exports.createFeedback = function(req, res, next) {
	var valid =
		req.body.feedback &&
		Validations.isString(req.body.feedback) 
		
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"questionSubject(String) and questionContent(String) are required fields.",
			data: null
		});
	}

	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		Feedback.create(req.body, function(err, feedback) {
			if (err) {
				return next(err);
			}
			res.status(201).json({
				err: null,
				msg: "Feedback was submitted successfully.",
				data: feedback
			});
		});
	});
};

/**
 * Updates details of question
 * @param {string} question
 * @return: json {error} or {message, reservation}
 */

module.exports.updateQuestion = function(req, res, next) {
	var valid =
		req.body.questionSubject &&
		Validations.isString(req.body.questionSubject) &&
		req.body.questionContent &&
		Validations.isString(req.body.questionContent);
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"questionSubject(String) and questionContent(String) are required fields.",
			data: null
		});
	}

	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
	});

	Question.findByIdAndUpdate(
		req.params.questionId,
		{
			$set: { status: req.body.questionContent }
		},
		{ new: true }
	).exec(function(err, updatedQuestion) {
		if (err) {
			return next(err);
		}
		if (!updatedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "Question was updated successfully.",
			data: updatedQuestion
		});
	});
};

//--------------------------

module.exports.getQuestionsByUsername = function(req, res, next) {
	Question.find({ "user._id": req.decodedToken.user._id }).exec(function(
		err,
		question
	) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Expert Info retrieved successfully.",
			data: question
		});
	});
};


module.exports.getQuestionsByRoomUser = function(req, res, next) {
	Question.find({ "user._id": req.decodedToken.user._id,"sessionRoom":req.params.sessionRoom }).exec(function(
		err,
		question
	) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Questions Info retrieved successfully.",
			data: question
		});
	});
};




//This method returns the questions with a certain status:
module.exports.getQuestionsByStatus = function(req, res, next) {
	Question.find({ status: req.params.status }).exec(function(err, question) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Questions retrieved successfully",
			data: question
		});
	});
};

module.exports.getQuestionsByExpert = function(req, res, next) {
	Question.find({
		"expert._id": req.decodedToken.user._id
	}).exec(function(err, question) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Expert Info retrieved successfully.",
			data: question
		});
	});
};

module.exports.getQuestionsByRoomEx = function(req, res, next) {
	Question.find({
		"expert._id": req.decodedToken.user._id,"sessionRoom": req.params.sessionRoom
	}).exec(function(err, question) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Expert Info retrieved successfully.",
			data: question
		});
	});
};

module.exports.deleteQuestion = function(req, res, next) {
	if (!Validations.isObjectId(req.params.questionId)) {
		return res.status(422).json({
			err: null,
			msg: "questionId parameter must be a valid ObjectId.",
			data: null
		});
	}

	Question.findByIdAndRemove(req.params.questionId).exec(function(
		err,
		deletedQuestion
	) {
		if (err) {
			return next(err);
		}
		if (!deletedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "Question was deleted successfully.",
			data: deletedQuestion
		});
	});
};
/**
 * This method enables the experts to accept a user's question and send an email to user with the response.
 * @param questionId
 * @return json file of updated question**/
module.exports.acceptRequest = function(req, res, next) {
	Question.findByIdAndUpdate(
		req.params.questionId,
		{
			$set: { status: "accepted" }
		},
		{ new: true }
	).exec(function(err, updatedQuestion) {
		if (err) {
			return next(err);
		}
		if (!updatedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}

		const transporter = nodemailer.createTransport({
			port: 25,
			service: "gmail",
			secure: false,
			auth: {
				//type: 'OAuth2',
				user: "officehours111@gmail.com",
				pass: "officehours_111"
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		let mailoption = {
			from: '"office hours" <officehours111@gmail.com>',
			to: updatedQuestion.user.email,
			subject: "Acceptance mail",
			text: "The request is accepted by expert "
		};
		transporter.sendMail(mailoption, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("asd");
		});
		res.status(200).json({
			err: null,
			msg: "Question was accepted successfully.",
			data: updatedQuestion
		});
	});
};

/**
 * This method enables the experts to reject a user's question and send an email to user with the response..
 * @param questionId
 * @return json file of updated question**/
module.exports.rejectRequest = function(req, res, next) {
	Question.findByIdAndUpdate(
		req.params.questionId,
		{
			$set: { status: "rejected" }
		},
		{ new: true }
	).exec(function(err, updatedQuestion) {
		if (err) {
			return next(err);
		}
		if (!updatedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}

		const transporter = nodemailer.createTransport({
			port: 25,
			service: "gmail",
			secure: false,
			auth: {
				//type: 'OAuth2',
				user: "officehours111@gmail.com",
				pass: "officehours_111"
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		let mailoption = {
			from: '"office hours" <officehours111@gmail.com>',
			to: updatedQuestion.user.email,
			subject: "Rejection mail",
			text: "The request is rejected by expert "
		};
		transporter.sendMail(mailoption, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("asd");
		});
		res.status(200).json({
			err: null,
			msg: "Question was rejected successfully.",
			data: updatedQuestion
		});
	});
};

/**
 * this meathod is used by the expert to send 3 slots to a user
 * @param slots
 * @return json {error} or {message , updatedQuestion}
 */
//
module.exports.addSlots = function(req, res, next) {
	Question.findByIdAndUpdate(
		req.params.questionId,
		{
			$set: { slots: req.body.slots }
		},
		{ new: true }
	).exec(function(err, updatedQuestion) {
		if (err) {
			return next(err);
		}
		if (!updatedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}
		// transporter and mailoption are used to send email to user
		const transporter = nodemailer.createTransport({
			port: 25,
			service: "gmail",
			secure: false,
			auth: {
				//type: 'OAuth2',
				user: "officehours111@gmail.com",
				pass: "officehours_111"
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		let mailoption = {
			from: '"office hours" <officehours111@gmail.com>',
			to: updatedQuestion.user.email,
			subject: "Slots mail from Expert",
			text: "The slots offered by expert are " + req.body.slots
		};
		transporter.sendMail(mailoption, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("asd");
		});
		res.status(200).json({
			err: null,
			msg: "Slots added successfully",
			data: updatedQuestion
		});
	});
};

module.exports.selectSlot = function(req, res, next) {
	Question.findByIdAndUpdate(
		req.params.questionId,
		{
			$set: { selectedSlot: req.body.selectedSlot }
		},
		{ new: true }
	).exec(function(err, updatedQuestion) {
		if (err) {
			return next(err);
		}
		if (!updatedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}

		const transporter = nodemailer.createTransport({
			port: 25,
			service: "gmail",
			secure: false,
			auth: {
				//type: 'OAuth2',
				user: "officehours111@gmail.com",
				pass: "officehours_111"
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		let mailoption = {
			from: '"office hours" <officehours111@gmail.com>',
			to: updatedQuestion.expert.email,
			subject: "Selected Slot mail",
			text: "The session room will be at " + req.body.selectedSlot
		};
		transporter.sendMail(mailoption, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("asd");
		});
		res.status(200).json({
			err: null,
			msg: "Selected Slot added successfully",
			data: updatedQuestion
		});
	});
};

module.exports.addroom = function(req, res, next) {
	Question.findByIdAndUpdate(
		req.params.questionId,
		{
			$set: {
				sessionRoom: req.body.sessionRoom,
				typeOfSession: req.body.typeOfSession
			}
		},
		{ new: true }
	).exec(function(err, updatedQuestion) {
		if (err) {
			return next(err);
		}
		if (!updatedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}

		const transporter = nodemailer.createTransport({
			port: 25,
			service: "gmail",
			secure: false,
			auth: {
				//type: 'OAuth2',
				user: "officehours111@gmail.com",
				pass: "officehours_111"
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		let mailoption = {
			from: '"office hours" <officehours111@gmail.com>',
			to: updatedQuestion.user.email,
			subject: "confirmation mail",
			text:
				"Your session room will be " +
				req.body.sessionRoom +
				" and the Type of the Session will be " +
				req.body.typeOfSession
		};
		transporter.sendMail(mailoption, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("asd");
		});

		res.status(200).json({
			err: null,
			msg: "room added successfully",
			data: updatedQuestion
		});
	});
};

module.exports.getroom = function(req, res, next) {
	Question.findOne({
		sessionRoom: req.body.sessionRoom.trim().toLowerCase()
	}).exec(function(err, chat) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "chats retrieved successfully.",
			data: chat
		});
	});
};

module.exports.sendMessage = function(req, res, next) {
	Question.findByIdAndUpdate(
		req.params.questionId,
		{
			$set: { message: req.body.message }
		},
		{ new: true }
	).exec(function(err, updatedQuestion) {
		if (err) {
			return next(err);
		}
		if (!updatedQuestion) {
			return res
				.status(404)
				.json({ err: null, msg: "Question not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "Meesage Sent successfully",
			data: updatedQuestion
		});
	});
};
