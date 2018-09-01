var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	Admin = mongoose.model("Admin"),
	User = mongoose.model("User"),
	Request = mongoose.model("Application"),
	Feedback = mongoose.model("Feedback");

/**
 * Allows the admin to add other admin accounts
 * @param {string} username
 * @return json {error} or {message, admin}
 */
module.exports.addAdmin = function(req, res, next) {
	Admin.findOne({ username: req.decodedToken.user.username }).exec(function(
		err,
		admin
	) {
		if (err) {
			return next(err);
		}
		if (!admin) {
			return res.status(401).json({
				err: null,
				msg: "Admin access is required for this action.",
				data: null
			});
		}

		var valid = req.body.username && Validations.isString(req.body.username);
		if (!valid) {
			return res.status(422).json({
				err: null,
				msg: "username(String) is a required field.",
				data: null
			});
		}

		User.findOne({
			username: req.body.username.trim().toLowerCase()
		}).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			// If user not found then he/she is not registered
			if (!user) {
				return res
					.status(404)
					.json({ err: null, msg: "User not found.", data: null });
			}
			Admin.findOne({
				username: req.body.username.trim().toLowerCase()
			}).exec(function(err, admin) {
				if (err) {
					return next(err);
				}
				// If admin is found then he/she is already admin
				if (admin) {
					return res.status(409).json({
						err: null,
						msg: "He/She is already an admin.",
						data: null
					});
				}
				Admin.create(req.body, function(err, admin) {
					if (err) {
						return next(err);
					}
					User.findOneAndUpdate(
						{ username: req.body.username },
						{
							$set: { type: "admin" }
						},
						{ new: false }
					).exec(function(err, updateUserType) {
						if (err) {
							return next(err);
						}
					});
					res.status(201).json({
						err: null,
						msg: "Admin has been added successfully.",
						data: admin
					});
				});
			});
		});
	});
};

/**
 * Creates a new Expert in the table of experts as well as change the type from "user" to "expert" in the general users table.
 * @param {int} requestId
 * @return json {error} or {message, updateUserType}
 */
module.exports.acceptExpert = function(req, res, next) {

	//First the method checks that the user initiating the action is an admin:
	User.findById(req.decodedToken.user._id).exec(function(err, admin) {
		if (err) {
			return next(err);
		}
		if (!admin) {
			return res.status(404).json({
				err: null,
				msg: "User not found",
				data: null
			});
		}

		if (admin.type !== "admin") {
			return res.status(401).json({
				err: null,
				msg: "Admin access is required",
				data: null
			});
		}
//The method then makes sure that the inputs is in the correct format and type
		var valid =
			req.body.requestId && Validations.isObjectId(req.body.requestId);
		if (!valid) {
			return res.status(422).json({
				err: null,
				msg: "requestId(ObjectId) is a required field.",
				data: null
			});
		}
		//The method then searches for the request sent by the user wishing to be an expert to get the username of the user:
		Request.findById(req.body.requestId).exec(function(err, request) {
			if (err) {
				return next(err);
			}
			if (!request) {
				return res.status(404).json({
					err: null,
					msg: "Request not found.",
					data: null
				});
			}
			var name = request.username;


//The method then looks for the user to check that he/she exists in the database:
			User.findOne({ username: name }).exec(function(err, user) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return res.status(404).json({
						err: null,
						msg: "User not found.",
						data: null
					});
				}
				//The method checks that the user is not an existing expert in the database:
				Expert.findOne({ username: name }).exec(function(err, expert) {
					if (err) {
						return next(err);
					}
					if (expert) {
						return res.status(409).json({
							err: null,
							msg: "He/She is already an expert.",
							data: null
						});
					}
//if the user is not already an expert, the method creates a new expert with the information of the user:
					Expert.create({ username: name }, function(err, createdExpert) {
						if (err) {
							return next(err);
						}
						if (!createdExpert) {
							return res.status(409).json({
								err: null,
								msg: "Expert could not be created.",
								data: null
							});
						}

//The method then updates the user in the database and changes his/her type from "user" to "expert":
						User.findOneAndUpdate(
							{
								username: request.username
							},
							{
								$set: { type: "expert" }
							},
							{ new: false }
						).exec(function(err, updatedUser) {
							if (err) {
								return next(err);
							}
							if (updatedUser.type != "expert") {
								updatedUser.type = "expert";
								updatedUser.save(function(err) {
									if (err) {
										return next(err);
									}

//Finally, after accepting the user as an expert the method deletes the user's application.									
									Request.deleteOne({ _id: req.body.requestId }).exec(function(
										err,
										expert
									) {
										if (err) {
											return res.status(404).json({
												err: null,
												msg: "Request not found.",
												data: null
											});
										}
										res.status(201).json({
											err: null,
											msg: "User converted to an expert successfully.",
											data: updatedUser
										});
									});
								});
							}
						});
					});
				});
			});
		});
	});
};

/**
 * Allows the admin to remove other admin accounts and make them become normal users
 * @param {string} username
 * @return json {error} or {message, deletedadmin}
 */
module.exports.removeAdmin = function(req, res, next) {
	Admin.findOne({ username: req.decodedToken.user.username }).exec(function(
		err,
		admin
	) {
		if (err) {
			return next(err);
		}
		if (!admin) {
			return res.status(401).json({
				err: null,
				msg: "Admin access is required for this action.",
				data: null
			});
		}

		var valid = req.body.username && Validations.isString(req.body.username);
		if (!valid) {
			return res.status(422).json({
				err: null,
				msg: "username(String) is a required field.",
				data: null
			});
		}

		User.findOne({
			username: req.body.username.trim().toLowerCase()
		}).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			// If user not found then he/she is not registered
			if (!user) {
				return res
					.status(404)
					.json({ err: null, msg: "User not found.", data: null });
			} else {
				Admin.findOne({
					username: req.body.username.trim().toLowerCase()
				}).exec(function(err, admin) {
					if (err) {
						return next(err);
					}
					// If admin is found then he/she is already admin
					if (!admin) {
						return res
							.status(404)
							.json({ err: null, msg: "Admin not found.", data: null });
					}
					Admin.remove({ username: req.body.username }, function(
						err,
						deletedadmin
					) {
						if (err) {
							return next(err);
						}
						User.findOneAndUpdate(
							{ username: req.body.username },
							{
								$set: { type: "user" }
							},
							{ new: false }
						).exec(function(err, updateUserType) {
							if (err) {
								return next(err);
							}
						});
						res.status(200).json({
							err: null,
							msg: "Admin has been deleted successfully.",
							data: deletedadmin
						});
					});
				});
			}
		});
	});
};

/**
 * Allows the admin to view all feedbacks
 * @param none
 * @return json {error} or {message, admin}
 */
module.exports.getFeedbacks = function(req, res, next) {
	Admin.findOne({ username: req.decodedToken.user.username }).exec(function(
		err,
		admin
	) {
		if (err) {
			return next(err);
		}
		if (!admin) {
			return res.status(401).json({
				err: null,
				msg: "Admin access is required for this action.",
				data: null
			});
		}

		Feedback.find({}).exec(function(err, feedback) {
			if (err) {
				return next(err);
			}
			if (!feedback) {
				return res
					.status(404)
					.json({ err: null, msg: "Feedback not found.", data: null });
			}
			res.status(200).json({
				err: null,
				msg: "Feedbacks retrieved successfully.",
				data: feedback
			});
		});
	});
};

/**
 * Allows the admin to delete feedbacks
 * @param none
 * @return json {error} or {message, admin}
 */
module.exports.deleteFeedback = function(req, res, next) {
	var valid =
		req.params.feedbackId && Validations.isObjectId(req.params.feedbackId);
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "feedbackId(ObjectId) is a required field.",
			data: null
		});
	}
	Admin.findOne({ username: req.decodedToken.user.username }).exec(function(
		err,
		admin
	) {
		if (err) {
			return next(err);
		}
		if (!admin) {
			return res.status(401).json({
				err: null,
				msg: "Admin access is required for this action.",
				data: null
			});
		}
		Feedback.findByIdAndRemove(req.params.feedbackId).exec(function(
			err,
			feedback
		) {
			if (err) {
				return next(err);
			}
			if (!feedback) {
				return res
					.status(404)
					.json({ err: null, msg: "Feedback not found.", data: null });
			}
			res.status(200).json({
				err: null,
				msg: "Feedback deleted successfully.",
				data: feedback
			});
		});
	});
};

/**
 * Used to record all users feedback
 * @param reviewee {String},
 * @param room {String},
 * @param feedback {String}
 * @return json {error} or {message, admin}
 */
module.exports.createFeedback = function(req, res, next) {
	var valid =
		req.body.reviewee &&
		Validations.isString(req.body.reviewee) &&
		req.body.room &&
		Validations.isString(req.body.room) &&
		req.body.feedback &&
		Validations.isString(req.body.feedback);
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"revieww(String), room(String) and feedback(String) are required fields.",
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
				.json({ err: null, msg: "User notnot found.", data: null });
		}
		if (user.type == "user") {
			req.body.reviewer = user.username;
			req.body.reviewerType = "user";
			req.body.revieweeType = "expert";

			Expert.findOne({ username: req.body.reviewee }).exec(function(
				err,
				expert
			) {
				if (err) {
					return next(err);
				}
				if (!expert) {
					return res
						.status(404)
						.json({ err: null, msg: "Expert not found.", data: null });
				}
				console.log("YALLA");
				Feedback.create(req.body, function(err, feedback) {
					if (err) {
						return next(err);
					}
					return res.status(201).json({
						err: null,
						msg: "Feedback created successfully.",
						data: feedback
					});
				});
			});
		} else {
			console.log("YALLA");
			Expert.findOne({ username: req.decodedToken.user.username }).exec(
				function(err, expert) {
					if (err) {
						return next(err);
					}
					if (!expert) {
						return res
							.status(404)
							.json({ err: null, msg: "Expert not found.", data: null });
					}

					req.body.reviewer = expert.username;
					req.body.reviewerType = "expert";
					req.body.revieweeType = "user";

					User.findOne({ username: req.body.reviewee }).exec(function(
						err,
						user
					) {
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
								msg: "Feedback created successfully.",
								data: feedback
							});
						});
					});
				}
			);
		}
	});
};
