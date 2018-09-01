var mongoose = require('mongoose'),
moment = require('moment'),
Validations = require('../utils/Validations'),
nodemailer = require('nodemailer'),
xoauth2=require('xoauth2'),
Reservations = mongoose.model('reservation');
Expert = mongoose.model('Expert');
User = mongoose.model("User"),

/**
*lets the user view all his reservations
*@return: json {error} or {message,reservations}
*/
module.exports.getReservation = function(req, res, next) {
	Reservations.find({}).exec(function(err, reservations) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Reservation retrieved successfully.",
			data: reservations
		});
	});
};

/**
 * lets the user reserve a slot and it to the database and send a confirmation email to the user with the created reservation
 * @params {string} userName
 * @params {string} expertName
 * @params {string} type
 * @return json {error} or {message,reservation}
 */
module.exports.createReservation = function(req, res, next) {
	var valid =
		req.body.userName &&
		Validations.isString(req.body.userName) &&
		req.body.expertName &&
		Validations.isString(req.body.expertName);
		req.body.type &&
		Validations.isString(req.body.type);
		
	User.findOne({
		username: req.body.expertName
	}).exec(function(err, ex) {
		if (err) {
			return next(err);
		}
		var expert_email = ex.email;

		User.findOne({
			username: req.body.userName
		}).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			var user_email = user.email;

		// If user not found then he/she is not registered
		if (!exuser) {
			return res
				.status(203)
				.json({ err: null, msg: "Expert not found.", data: null });
		}
		if (!valid) {
			return res.status(422).json({
				err: null,
				msg:
					"userName(String), expertName(String) and type(String) are required fields.",
				data: null
			});
		}
		// Security Check
		delete req.body.reservationDate;

		Reservations.create(req.body, function(err, reservations) {
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

			const url = "http://localhost:4200";
			let mailoption = {
				from: '"office hours" <officehours111@gmail.com>',
				to: user_email,
				subject: "confirmation mail",
				text:
					"Reservation was created successfully , your session date will be on " +
					req.body.reservationDate +
					" do not forget to use this link to visit your chat room " +
					url
			};
			let expertoption = {
				from: '"office hours" <officehours111@gmail.com>',
				to: expert_email,
				subject: "confirmation mail",
				text:
					" Your reservation was created successfully , your session date will be on " +
					req.body.reservationDate +
					" do not forget to use this link to visit your chat room " +
					url
			};
			if (err) {
				return next(err);
			}
			transporter.sendMail(mailoption, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("sent to user");
			});
			transporter.sendMail(expertoption, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("sent to expert");
			});
			res.status(201).json({
				err: null,
				msg: "Reservation was created successfully.",
				data: reservations
			});
		});
	});
});

};

/**
 * lets the user delete a reserved slot
 * @param {ObjectId} reservationId
 * @return json {error} or {message, deletedreservation}
 */
module.exports.deleteReservation = function(req, res, next) {
	if (!Validations.isObjectId(req.params.reservationId)) {
		return res.status(422).json({
			err: null,
			msg: "reservationId parameter must be a valid ObjectId.",
			data: null
		});
	}

	Reservations.findByIdAndRemove(req.params.reservationId).exec(function(
		err,
		deletedReservation
	) {
		if (err) {
			return next(err);
		}
		if (!deletedReservation) {
			return res
				.status(404)
				.json({ err: null, msg: "Reservation not found.", data: null });
		}
		var uemail = deletedReservation.email;
		var expert = deletedReservation.expertName;
		console.log(uemail);
		console.log(expert);
		User.findOne({
			username: expert
		}).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			var expert_email = user.email;
			console.log(hoo);


			User.findById(
				req.decodedToken.user._id
			).exec(function(err, user2) {
				if (err) {
					return next(err);
				}
				var user_email = user2.email;
				console.log(hoo);

			// If user not found then he/she is not registered
			if (!user) {
				return res
					.status(203)
					.json({ err: null, msg: "User not found.", data: null });
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
				to: uemail,
				subject: "confirmation mail",
				text: "Reservation has canceled "
			};
			let expertoption = {
				from: '"office hours" <officehours111@gmail.com>',
				to: expert_email,
				subject: "confirmation mail",
				text: " the user has canceled the  Reservation"
			};
			transporter.sendMail(mailoption, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("sent to user");
			});
			transporter.sendMail(expertoption, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("sent to expert");
			});
			res.status(200).json({
				err: null,
				msg: "Reservation was deleted successfully.",
				data: deletedReservation
			});
		});
	});
});
};

/**
 * Updates details of Reservation and sends notifications to both user and expert.
 * @param {string} userName
 * @param {string} expertName
 * @param {string} type
 * @return: json {error} or {message, reservation}
 */

module.exports.updateReservation = function(req, res, next) {
	if (!Validations.isObjectId(req.params.reservationId)) {
		return res.status(422).json({
			err: null,
			msg: "reservationId parameter must be a valid ObjectId.",
			data: null
		});
	}
	var valid =
		req.body.userName &&
		Validations.isString(req.body.userName) &&
		req.body.expertName &&
		Validations.isString(req.body.expertName) &&
		req.body.type &&
		Validations.isString(req.body.type) &&
		req.body.email &&
		Validations.isString(req.body.email);
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"userName(String), expertName(String) and type(String)  are required fields.",
			data: null
		});
	}

	Reservations.findByIdAndUpdate(
		req.params.reservationId,
		{
			$set: req.body
		},
		{ new: true }
	).exec(function(err, updatedReservation) {
		if (err) {
			return next(err);
		}
		if (!updatedReservation) {
			return res.status(404).json({
				err: null,
				msg: "Reservation not found.",
				data: null
			});
		}

		var uemail = updatedReservation.email;
		var expert = updatedReservation.expertName;
		console.log(uemail);
		console.log(expert);
		User.findOne({
			username: expert
		}).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			// If user not found then he/she is not registered
			if (!user) {
				return res
					.status(203)
					.json({ err: null, msg: "User not found.", data: null });
			}

			var expert_email = user.email;
			console.log(expert_email);
           // giving the username and the password of the account that will be used to send notifications to expert and user
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

			let useroption = {
				from: '"office hours" <officehours111@gmail.com>',
				to: uemail,
				subject: "confirmation mail",
				text: "Reservation has been updated "
			};

			let expertoption = {
				from: '"office hours" <officehours111@gmail.com>',
				to: expert_email,
				subject: "confirmation mail",
				text: " the user has updated the  Reservation"
			};
           // sending mail to user to confirm updating reserved slot
			transporter.sendMail(useroption, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("sent to user");
			});
            // sending mail to expert to notify him that the slot has been updated
			transporter.sendMail(expertoption, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("sent to expert");
			});

			res.status(200).json({
				err: null,
				msg: "Reservation was updated successfully.",
				data: updatedReservation
			});
		});
	});
};
