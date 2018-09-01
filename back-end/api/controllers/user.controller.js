var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	cloudinary = require('cloudinary'),
	multer  = require('multer'),
	cloudinaryStorage = require('multer-storage-cloudinary'),
	path = require('path'),
	User = mongoose.model("User"),
	Expert = mongoose.model("Expert"),
	Admin = mongoose.model("Admin"),
	Topic = mongoose.model("Topic");
var bodyParser = require("body-parser");
const express = require("express");
var app = express();
cloudinary.config({  //Your Cloudinary API Data
	cloud_name: 'dgwildqsv',
	api_key: '885116352125168',
	api_secret: 'dwvBE716ok5Aoh0m2PSWDXIkLCM'
});

(Topic = mongoose.model("Topic")),
	(Encryption = require("../utils/Encryption"));

module.exports.getUsers = function(req, res, next) {
	User.find({}).exec(function(err, users) {
		if (err) {
			return next(err);
		}
		if (!users) {
			return res
				.status(404)
				.json({ err: null, msg: "Users not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "Users retrieved successfully.",
			data: users
		});
	});
};

/**
 * Views all the users of a specific type(expert/user/admin)
 * @param type (String)
 * @return json {error} or{ message ,user}
 */
module.exports.getUserByType = function(req, res, next) {
	if (!Validations.isString(req.params.type)) {
		return res.status(422).json({
			err: null,
			msg: "type parameter must be a valid String.",
			data: null
		});
	}
	User.find({ type: req.params.type }).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "User Info retrieved successfully.",
			data: user
		});
	});
};

module.exports.getUserByUsername = function(req, res, next) {
	if (!Validations.isString(req.params.username)) {
		return res.status(422).json({
			err: null,
			msg: "type parameter must be a valid String.",
			data: null
		});
	}
	User.find({ username: req.params.username }).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Expert Info retrieved successfully.",
			data: user
		});
	});
};

/**
 * Views all the users that their privacy is only public
 * @param username (String)
 * @return json {error} or{ message ,user}
 */
module.exports.getUser = function(req, res, next) {
	var valid = req.body.username && Validations.isString(req.body.username);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "Username is a required field",
			data: null
		});
	}

	User.findOne({ username: req.body.username }).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		var privacy = user.privacy;
		var private = "private";

		if (privacy == private) {
			return res
				.status(422)
				.json({ err: null, msg: "User profile is private.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "User retrieved successfully.",
			data: user
		});
	});
};

/**
 * Views all the users' notes using the decoded login token
 * @param none
 * @return json {error} or{ message ,notes}
 */
module.exports.viewNotes = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "User Notes retrieved successfully.",
			data: user.notes
		});
	});
};

/**
 * Allows the user to edit his info like notes in his profile
 * @param {array} notes,
 * @return json {error} or{ message ,notes}
 */

module.exports.updateNotes = function(req, res, next) {
	var valid = req.body.notes && Validations.isArray(req.body.notes);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "notes(Array) is a required field.",
			data: null
		});
	}
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		console.log(user);
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		user.notes = req.body.notes;
		user.save(function(err) {
			if (err) {
				return next(err);
			}

			res.status(203).json({
				err: null,
				msg: "Notes were updated successfully.",
				data: user.notes
			});
		});
	});
};

// /**
//  * Allows the user to edit his info like notes in his profile
//  * @param {ObjectId} notesId
//  * @param {string} note,
//  * @param {string} noteTitle
//  * @return json {error} or{ message ,notes}
//  */
//
// module.exports.updateNotes = function(req, res, next) {
// 	if (!Validations.isObjectId(req.params.notesId)) {
// 		return res.status(422).json({
// 			err: null,
// 			msg: "notesId parameters must be valid ObjectIds.",
// 			data: null
// 		});
// 	}
//
// 	var valid =
// 		Validations.isString(req.body.note) &&
// 		Validations.isString(req.body.noteTitle);
//
// 	if (!valid) {
// 		return res.status(422).json({
// 			err: null,
// 			msg: "note has to be String and note title has to be a string",
// 			data: null
// 		});
// 	}
// 	User.findById(req.decodedToken.user._id).exec(function(err, user) {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!user) {
// 			return res
// 				.status(404)
// 				.json({ err: null, msg: "User not found.", data: null });
// 		}
//
// 		var notes = user.notes.id(req.params.notesId);
// 		if (!notes) {
// 			return res
// 				.status(404)
// 				.json({ err: null, msg: "note not found.", data: null });
// 		}
//
// 		notes.note = req.body.note;
// 		notes.noteTitle = req.body.noteTitle;
//
// 		user.save(function(err) {
// 			if (err) {
// 				return next(err);
// 			}
// 			res.status(200).json({
// 				err: null,
// 				msg: "Note was updated successfully.",
// 				data: notes
// 			});
// 		});
// 	});
// };

/**
 * Updates username of user
 * @param {string} username
 * @return json {error} or{ message ,user}
 */
module.exports.updateUser = function(req, res, next) {
	var username = req.decodedToken.user.username;
	User.findByIdAndUpdate(
		req.decodedToken.user._id,
		{
			$set: req.body
		},
		{ new: true }
	).exec(function(err, updatedUser) {
		if (err) {
			return next(err);
		}
		if (!updatedUser) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		Expert.findOneAndUpdate(
			{ username: username },
			{ $set: req.body },
			{ new: true }
		).exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			if (!expert) {
				Admin.findOneAndUpdate(
					{ username: username },
					{ $set: req.body },
					{ new: true }
				).exec(function(err, admin) {
					if (err) {
						return next(err);
					}
					res.status(200).json({
						err: null,
						msg: "User was updated successfully.",
						data: updatedUser
					});
				});
			}
		});
	});
};

// module.exports.updateUser = function(req, res, next) {
// 	if (!Validations.isObjectId(req.decodedToken.user._id)) {
// 		return res.status(422).json({
// 			err: null,
// 			msg: "User not found",
// 			data: null
// 		});
// 	}
// 	User.findOneAndUpdate(
// 		{ _id: req.decodedToken.user._id },
// 		{
// 			$set: req.body.data
// 		},
// 		{ new: false }
// 	).exec(function(err, previousUser) {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!previousUser) {
// 			return res
// 				.status(404)
// 				.json({ err: null, msg: "User not found.", data: null });
// 		}
// 		Expert.findOneAndUpdate(
// 			{ username: previousUser.username },
// 			{ $set: { username: req.body.data.username } },
// 			{ new: true }
// 		).exec(function(err, updatedExpert) {
// 			if (err) {
// 				return next(err);
// 			}
// 			res.status(200).json({
// 				err: null,
// 				msg: "User was updated successfully.",
// 				data: previousUser
// 			});
// 		});
// 	});
// };

module.exports.updateUserPassword = function(req, res, next) {
	if (!Validations.isObjectId(req.decodedToken.user._id)) {
		return res.status(422).json({
			err: null,
			msg: "User not found",
			data: null
		});
	}

	var valid =
		req.body.email &&
		Validations.isString(req.body.email) &&
		req.body.password &&
		Validations.isString(req.body.password) &&
		req.body.newPassword &&
		Validations.isString(req.body.newPassword) &&
		req.body.confirmPassword &&
		Validations.isString(req.body.confirmPassword);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"email(String and of valid email format), password(String) , confirmPassword(String) and newPassword(String) are required fields.",
			data: null
		});
	}
	var password = req.body.newPassword.trim();
	if (password.length < 8) {
		return res.status(203).json({
			err: null,
			msg: "Password must be of length 8 characters or more.",
			data: null
		});
	}
	// Check that password matches confirmPassword
	if (password !== req.body.confirmPassword.trim()) {
		return res.status(203).json({
			err: null,
			msg: "newPassword and confirmPassword does not match.",
			data: null
		});
	}
	User.findOne({
		email: req.body.email.trim().toLowerCase()
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

		// If user found then check that the password he entered matches the encrypted hash in the database
		Encryption.comparePasswordToHash(req.body.password, user.password, function(
			err,
			passwordMatches
		) {
			if (err) {
				return next(err);
			}
			// If password doesn't match then its incorrect
			if (!passwordMatches) {
				return res
					.status(203)
					.json({ err: null, msg: "Password is incorrect.", data: null });
			}
			var passwordHashed = req.body.confirmPassword;
			Encryption.hashPassword(passwordHashed, function(err, hash) {
				if (err) {
					return next(err);
				}
				if (hash) {
					req.body.password = hash;

					User.findByIdAndUpdate(
						req.decodedToken.user._id,
						{
							$set: req.body
						},
						{ new: true }
					).exec(function(err, updatedUser) {
						if (err) {
							return next(err);
						}
						if (!updatedUser) {
							return res
								.status(404)
								.json({ err: null, msg: "User not found.", data: null });
						}
						res.status(200).json({
							err: null,
							msg: "User was updated successfully.",
							data: updatedUser
						});
					});
				}
			});
		});
	});
};

/**
 * Allows the user to add info about his account like experience
 * @param {string} job
 * @param {string} Date
 * @param {string} Details
 * @param {string} CompanyName
 * @return: json {error} or{ message ,experience}
 */
module.exports.createExperience = function(req, res, next) {
	var valid =
		req.body.job &&
		req.body.date &&
		req.body.details &&
		req.body.companyName &&
		Validations.isString(req.body.job) &&
		Validations.isString(req.body.details) &&
		Validations.isString(req.body.companyName) &&
		Validations.isString(req.body.date);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"job(String), date(String), details(String) and companyName(String) are required fields.",
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

		var newExperience = user.experiences.create(req.body);
		user.experiences.push(newExperience);
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(201).json({
				err: null,
				msg: "Experience was created successfully.",
				data: newExperience
			});
		});
	});
};

//----------------------------

module.exports.getExperience = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "List of favourite experts retrieved successfully.",
			data: user.experiences
		});
	});
};

/**
 * Allows the user to add info about his account like notes
 * @param {string} note
 * @param {string} noteTitle
 * @return json {error} or{ message ,notes}
 */
module.exports.createNotes = function(req, res, next) {
	var valid =
		req.body.note &&
		req.body.noteTitle &&
		Validations.isString(req.body.note) &&
		Validations.isString(req.body.noteTitle);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"Note(String) is a required field and NoteTitle(String) is a required field.",
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
		var newNote = user.notes.create(req.body);
		user.notes.push(newNote);

		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Note was created successfully.",
				data: newNote
			});
		});
	});
};

/**
 * Allows the user to update his privacy either public or private
 * @param {string} privacy
 * @return json {error} or {message, user}
 */
module.exports.updatePrivacy = function(req, res, next) {
	var valid = Validations.isString(req.body.privacy);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "Privacy option has to be string either public or private",
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

		user.privacy = req.body.privacy;

		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Privacy was updated successfully.",
				data: user
			});
		});
	});
};

/**
 * Allows the user to edit his info, editing his experience
 * @param {ObjectId} expId,
 * @param {string} job,
 * @param {string} Details,
 * @param {string} CompanyName,
 * @param {string} Date
 * @return json {error} or{ message ,updatedexperience}
 */
module.exports.updateExperience = function(req, res, next) {
	if (!Validations.isObjectId(req.params.expId)) {
		return res.status(422).json({
			err: null,
			msg: "experienceId parameters must be valid ObjectIds.",
			data: null
		});
	}

	var valid =
		Validations.isString(req.body.job) &&
		Validations.isString(req.body.Details) &&
		Validations.isString(req.body.CompanyName) &&
		Validations.isString(req.body.Date);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"Job(String), Details(String), CompanyName(String), Date(String) are required",
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

		var Experience = user.experiences.id(req.params.expId);
		if (!Experience) {
			return res
				.status(404)
				.json({ err: null, msg: "Experience not found.", data: null });
		}

		Experience.job = req.body.job;
		Experience.Details = req.body.Details;
		Experience.CompanyName = req.body.CompanyName;
		Experience.Date = req.body.Date;

		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Experience was updated successfully.",
				data: Experience
			});
		});
	});
};

module.exports.getfavExpertsByUsername = function(req, res, next) {
	var valid = Validations.isString(req.params.keyword);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "username must be a String",
			data: null
		});
	}
	fexperts = [];
	User.findById(req.decodedToken.user._id).exec(function(err, requestor) {
		if (err) {
			return next(err);
		}
		if (!requestor) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		for (var i = 0; i < requestor.favExperts.length; i++) {
			fexperts.push(requestor.favExperts[i].name);
		}
		var expert;

		for (var j = 0; j < fexperts.length; j++) {
			if (fexperts[j] == req.params.keyword) {
				expert = fexperts[j];
				break;
			}
		}
		User.find({ username: expert }).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			if (user.length == 0) {
				return res
					.status(404)
					.json({ err: null, msg: "Expert not found.", data: null });
			}
			res.status(200).json({
				err: null,
				msg: "Expert retrieved successfully.",
				data: user
			});
		});
	});
};

module.exports.deleteExpert = function(req, res, next) {
	if (!Validations.isObjectId(req.params.expertId)) {
		return res.status(422).json({
			err: null,
			msg: "expertId parameter must be a valid ObjectId.",
			data: null
		});
	}

	Expert.findByIdAndRemove(req.params.expertId).exec(function(
		err,
		deletedExpert
	) {
		if (err) {
			return next(err);
		}
		if (!deletedExpert) {
			return res
				.status(404)
				.json({ err: null, msg: "Expert not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "Expert was deleted successfully.",
			data: deletedExpert
		});
	});
};

module.exports.deleteUser = function(req, res, next) {
	if (!Validations.isObjectId(req.decodedToken.user._id)) {
		return res.status(422).json({
			err: null,
			msg: "userId parameters must be valid ObjectIds.",
			data: null
		});
	}

	User.findByIdAndRemove(req.params.userId).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		Admin.findOneAndRemove({ username: user.username }).exec(function(
			err,
			deletedAdmin
		) {
			if (err) {
				return next(err);
			}
		});
		Expert.findOneAndRemove({ username: user.username }).exec(function(
			err,
			deletedExpert
		) {
			if (err) {
				return next(err);
			}
		});
		res.status(200).json({
			err: null,
			msg: "User was deleted successfully.",
			data: user
		});
	});
};

/**
 * Allows the user to delete experience field of his profile
 * @param {ObjectId} expId
 * @return json {error} or{ message ,deletedexperience}
 */
module.exports.deleteExperience = function(req, res, next) {
	if (!Validations.isObjectId(req.params.expId)) {
		return res.status(422).json({
			err: null,
			msg: "expId parameters must be valid ObjectIds.",
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

		var Experience = user.experiences.id(req.params.expId);
		if (!Experience) {
			return res
				.status(404)
				.json({ err: null, msg: "Experience not found.", data: null });
		}
		Experience.remove();

		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Experience was deleted successfully.",
				data: Experience
			});
		});
	});
};

/**
 * Allows the user to view the list of his/her favorite experts.
 * @param {ObjectId} decodedToken.user._id.
 * @return json {error} or {message, user.favExperts}
 */
module.exports.getfavExperts = function(req, res, next) {
	fexperts = [];
	User.findById(req.decodedToken.user._id).exec(function(err, requestor) {
		if (err) {
			return next(err);
		}
		if (!requestor) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		for (var i = 0; i < requestor.favExperts.length; i++) {
			fexperts.push(requestor.favExperts[i].name);
		}
		User.find()
			.where("username")
			.in(fexperts)
			.exec(function(err, user) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return res
						.status(404)
						.json({ err: null, msg: "User not found.", data: null });
				}
				res.status(200).json({
					err: null,
					msg: "Experts retrieved successfully.",
					data: user
				});
			});
	});
};

/**
 * Allows the user to delete notes field of his profile
 * @param {ObjectId} notesId
 * @return json {error} or{ message ,deletedNotes}
 */
module.exports.deleteNote = function(req, res, next) {
	if (!Validations.isObjectId(req.params.notesId)) {
		return res.status(422).json({
			err: null,
			msg: "notesId parameters must be valid ObjectIds.",
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

		var notes = user.notes.id(req.params.notesId);
		if (!notes) {
			return res
				.status(404)
				.json({ err: null, msg: "Note not found.", data: null });
		}
		notes.remove();

		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Note was deleted successfully.",
				data: notes
			});
		});
	});
};

/**
 * Creates a new Expert in the table of experts as well as change the type from "user" to "expert" in the general users table.
 * @param {string} username
 * @param {Object ID} userID
 * @return json {error} or {message, updateUserType}
 */
module.exports.acceptExpert = function(req, res, next) {
	if (!Validations.isObjectId(req.decodedToken.user._id)) {
		return res.status(422).json({
			err: null,
			msg: "User not found",
			data: null
		});
	}
	var valid = req.body.username && Validations.isString(req.body.username);
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "username is a required field.",
			data: null
		});
	}

	Expert.create(req.body, function(err, expert) {
		if (err) {
			return next(err);
		}

		User.findByIdAndUpdate(
			expert._id,
			{
				$set: { type: "expert" }
			},
			{ new: false }
		).exec(function(err, updateUserType) {
			if (err) {
				return next(err);
			}
			if (!updateUserType) {
				return res.status(404);
				(3).json({ err: null, msg: "User not found.", data: null });
			}
			res.status(200).json({
				err: null,
				msg: "User was updated successfully.",
				data: updateUserType
			});
		});
	});
};

/**
 * Uses the logged in user's id to add the selected expert username to the user's array of favourite experts(favExperts).
 * @param {ObjectId} req.decodedToken.user._id
 * @param {string} name //Expert's username
 * @return:json {error} or {message, expert}
 */
module.exports.AddFavoriteExpert = function(req, res, next) {
	var valid = req.body.name && Validations.isString(req.body.name);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: " expert name must be a string ",
			data: null
		});
	}
	Expert.find({ username: req.body.name }).exec(function(err, expert) {
		if (err) {
			return next(err);
		}
		if (expert.length == 0) {
			return res.status(404).json({
				err: null,
				msg: "Expert not found , Can't be add",
				data: null
			});
		}
		if (expert.length > 0) {
			User.findById(req.decodedToken.user._id).exec(function(err, user) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return res
						.status(404)
						.json({ err: null, msg: "User not found.", data: null });
				}
				var check = true;
				for (var i = 0; i < user.favExperts.length; i++) {
					if (user.favExperts[i].name == req.body.name) {
						check = false;
					}
				}
				if (check == true) {
					var fexpert = user.favExperts.create(req.body);
					user.favExperts.push(fexpert);

					user.save(function(err) {
						if (err) {
							return next(err);
						}
						res.status(201).json({
							err: null,
							msg: "Expert was added successfully.",
							data: fexpert
						});
					});
				} else {
					res.status(200).json({
						err: null,
						msg: "Expert was already added successfully.",
						data: null
					});
				}
			});
		}
	});
};

module.exports.AddNote = function(req, res, next) {
	var valid = req.body.expertName && Validations.isString(req.body.expertName);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: " expert name must be a string ",
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

		var note = user.notes.create(req.body);
		user.notes.push(note);

		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(201).json({
				err: null,
				msg: "Note was added successfully.",
				data: note
			});
		});
	});
};
/**
 * Allows the user to delete a favorite expert from his/her list, the method checks that he/she is a user and takes the id of the favorite expert.
 * @param {ObjectId} decodedToken.user._id.
 * @param {ObjectId} ExpertId
 * @return json {error} or {message, expert}
 */
module.exports.deleteFavoriteExpert = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		var check = false;
		var expert;
		for (var i = 0; i < user.favExperts.length; i++) {
			if (user.favExperts[i].name == req.params.username) {
				check = true;
				expert = user.favExperts[i];
			}
		}

		if (check == true) {
			user.favExperts.remove(expert);

			user.save(function(err) {
				if (err) {
					return next(err);
				}
				res.status(200).json({
					err: null,
					msg: "expert was deleted successfully.",
					data: user
				});
			});
		} else {
			res.status(200).json({
				err: null,
				msg: "expert is not a favourite",
				data: user
			});
		}
	});
};
module.exports.createTopicfortesting = function(req, res, next) {
		var valid =
			req.body.topicTitle &&
			Validations.isString(req.body.topicTitle) &&
			req.body.topicDescription &&
			Validations.isString(req.body.topicDescription);
		if (!valid) {
			return res.status(422).json({
				err: null,
				msg:
					"topic Title(String) and topic description(String) are required fields.",
				data: null
			});
		}

		Topic.findOne({
			topicTitle: req.body.topicTitle
		}).exec(function(err, topic) {
			// If an err occurred, call the next middleware in the app.js which is the error handler
			if (err) {
				return next(err);
			}
			// If there is a topic with this title don't continue
			if (topic) {
				return res.status(203).json({
					err: null,
					msg: "A topic with this title already exists.",
					data: null
				});
			}
			Topic.create(req.body, function(err, newTopic) {
				if (err) {
					return next(err);
				}
				if (!newTopic) {
					return res.status(404).json({
						err: null,
						msg: "Topic could not be created.",
						data: null
					});
				}


				res.status(201).json({
					err: null,
					msg: "Topic was created successfully.",
					data: newTopic
				});
		});
	});
};
/**
 * Enables the expert to add topics he/she is interested in the profile, so that later on the user will be able to book a reservation with the expert based on these topics . FurtherMore this expert will be added to the list of experts in the topics table, so that we can end up for each topic with its specialized experts , and for each expert with his/her related topics.
 * @param {ObjectId} topic
 * @return json {error} or {message, expert}
 */
module.exports.ExpertSelectTopic = function(req, res, next) {
	var valid = req.body.topic_id && Validations.isObjectId(req.body.topic_id);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: " Topic id must be a valid objectId ",
			data: null
		});
	}

	Expert.findOne({ username: req.decodedToken.user.username }).exec(function(
		err,
		expert
	) {
		if (err) {
			return next(err);
		}

		if (!expert) {
			return res
				.status(404)
				.json({ err: null, msg: "expert not found.", data: null });
		}

		Topic.findById(req.body.topic_id).exec(function(err, topic) {
			if (err) {
				return next(err);
			}
			if (!topic) {
				return res
					.status(404)
					.json({ err: null, msg: "topic not found.", data: null });
			}
			var topic_to_be_added = expert.topics.id(topic._id);
			if (topic_to_be_added) {
				return res
					.status(404)
					.json({ err: null, msg: "This topic is already added", data: null });
			}

			expert.topics.push({
				_id: topic._id,
				topicTitle: topic.topicTitle,
				topicDescription: topic.topicDescription
			});
			expert.save(function(err) {
				if (err) {
					return next(err);
				}
			});

			topic.experts.push({
				_id: expert._id,
				username: expert.username
			});

			topic.save(function(err) {
				if (err) {
					return next(err);
				}
				res.status(201).json({
					err: null,
					msg: "Done ",
					data: expert
				});
			});
		});
	});
};

/**
 * Handles the calculation and process of the rating a user
 * @param {String} username
 * @param {number} rating
 * @return json {error} or {message, avgRating}
 */

module.exports.rateUser = function(req, res, next) {
	if (!Validations.isObjectId(req.decodedToken.user._id)) {
		return res.status(422).json({
			err: null,
			msg: "User not found",
			data: null
		});
	}

	var valid = req.body.rating && Validations.isNumber(req.body.rating);
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "rating is a required field.",
			data: null
		});
	}

	User.findOne({username : req.body.username}).exec((err, user) => {
		if (err) {
			return res.json({
				errors: [
					{
						type: strings.DATABASE_ERROR,
						msg: err.message
					}
				]
			});
		}

		if (!user) {
			return res.json({
				errors: [
					{
						type: strings.INVALID_INPUT,
						msg: "No user with this Id was found."
					}
				]
			});
		}

		var newRating = user.ratings.create(req.body);
		user.ratings.push(newRating);

		user.save(err => {
			if (err) {
				return next(err);
			}
		});

		// Update Activity's Average Rating
		var ratingSum = 0;

		User.findOne({username : req.body.username}).exec((err, user) => {
			if (err) {
				return res.json({
					errors: [
						{
							type: strings.DATABASE_ERROR,
							msg: err.message
						}
					]
				});
			}

			if (user.ratings.length >= 0) {
				for (var i = 0; i < user.ratings.length; i++) {
					ratingSum += user.ratings[i].rating;
				}

				var avgRating =
					(ratingSum + newRating.rating) / (user.ratings.length + 1);

				var factor = Math.pow(10, 1);
				var newR =  Math.round(avgRating * factor) / factor;

				User.findOneAndUpdate(
					{username: req.body.username},
					{
						$set: { avgRating: newR }
					},
					{ new: true }
				).exec(function(err, updateUserRate) {
					if (err) {
						return next(err);
					}

					if (!updateUserRate) {
						return res
							.status(404)
							.json({ err: null, msg: "User not found.", data: null });
					}

					user.save((err, rating) => {
						if (err) {
							return res.json({
								errors: [
									{
										type: strings.DATABASE_ERROR,
										msg: err.message
									}
								]
							});
						}

						if (!rating) {
							return res.json({
								errors: [
									{
										type: strings.DATABASE_ERROR,
										msg: "There was a problem Saving the rating."
									}
								]
							});
						}

						return res.json({
							msg: "Successfully Updated Rating.",
							data: {
								avgRating: newR
							}
						});
					});
				});
			} else {
				return res.json({
					errors: [
						{
							msg: "There was a problem calculating the Rating."
						}
					]
				});
			}
		});
	});
};

module.exports.requestExpert = function(req, res, next) {
	if (!Validations.isObjectId(req.decodedToken.user._id)) {
		return res.status(422).json({
			err: null,
			msg: "User not found",
			data: null
		});
	}
	if (!Validations.isObjectId(req.params.expertId)) {
		return res.status(422).json({
			err: null,
			msg: "expertId parameter must be a valid ObjectId.",
			data: null
		});
	}
	var valid =
		req.body.questionSubject &&
		Validations.isString(req.body.questionSubject) &&
		req.body.questionContent &&
		Validations.isString(req.body.questionContent) &&
		req.body.userId &&
		Validations.isObjectId(req.body.userId) &&
		req.body.expertId &&
		Validations.isObjectId(req.body.expertId);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"questionSubject(String), questionContent(String) and userId(ObjectId) are required fields and expertId(ObjectId) are required fields.",
			data: null
		});
	}
	User.findById(req.body.userId).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		req.body.username = user;
		//delete req.body.expert;
		// req.body.expert = user;

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

/**
 * Allows the user to edit his experience
 * @param {array} experiences,
 * @return json {error} or{ message ,notes}
 */

module.exports.updateExperiences = function(req, res, next) {
	var valid = req.body.experiences && Validations.isArray(req.body.experiences);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "experiences(Array) is a required field.",
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
		user.experiences = req.body.experiences;
		user.save(function(err) {
			if (err) {
				return next(err);
			}

			res.status(203).json({
				err: null,
				msg: "Experiences were updated successfully.",
				data: user.experiences
			});
		});
	});
};

module.exports.profile = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		res.status(200).json({
			err: null,
			msg: "User was retrieved successfully.",
			data: user
		});
	});
};

module.exports.setAvatar = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
			User.findOneAndUpdate(
				{ username: req.decodedToken.user.username},
				{
					$set: { profilePic:  cloudinary.url(req.decodedToken.user.username) }
				},
				{ new: false }
			).exec(function(err, updateUserType) {
				if (err) {
					return next(err);
				}
			});
			return res.status(200).json({
				err: null,
				msg: "Avatar changed successfully.",
				data: user
			});
	});
};
