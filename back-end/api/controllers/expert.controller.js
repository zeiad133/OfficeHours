var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	Expert = mongoose.model("Expert"),
	User = mongoose.model("User"),
	Topic = mongoose.model("Topic");

/**
 * Accesses Expert table and gets all records.
 * @param none
 * @return json {error} or {message, experts}
 */
//done testing

module.exports.getExperts = function(req, res, next) {
    User.find({ type: "expert" }).exec(function(err, experts) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Experts retrieved successfully.",
			data: experts
		});
	});
};

/**
 * Accesses Expert table and get Experts found by username entered by a user as an input.
 * @param {string} Username
 * @return json {error} or {message, expert}
 */
module.exports.getExpertsByUsername = function(req, res, next) {
	if (!Validations.isString(req.params.username)) {
		return res.status(422).json({
			err: null,
			msg: "username parameter must be a valid String.",
			data: null
		});
	}
	experts = [];
	Expert.find({ username: { $regex: "^" + req.params.username  } }).exec(
		function(err, expert) {
			if (err) {
				return next(err);
			}
			if (!expert) {
				return res.status(404).json({
					err: null,
					msg: "Expert not found",
					data: null
				});
			}
			for (var i = 0; i < expert.length; i++) {
				experts.push(expert[i].username);
			}
			User.find()
				.where("username")
				.in(experts)
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
		}
	);
};

/**
 * Accesses Expert table and gets a certain record.
 * @param {ObjectId} expertId
 * @return json {error} or {message, expert}
 */
//done testing

module.exports.getExpert = function(req, res, next) {
	if (!Validations.isObjectId(req.params.expertId)) {
		return res.status(422).json({
			err: null,
			msg: "expertId parameter must be a valid ObjectId.",
			data: null
		});
	}
	Expert.findById(req.params.expertId).exec(function(err, expert) {
		if (err) {
			return next(err);
		}
		if (!expert) {
			return res
				.status(404)
				.json({ err: null, msg: "Expert not found.", data: null });
		}

		var expert = expert.id(req.params.expertId);
		if (!expert) {
			return res
				.status(404)
				.json({ err: null, msg: "Expert not found.", data: null });
		}

		res.status(200).json({
			err: null,
			msg: "Expert retrieved successfully.",
			data: expert
		});
	});
};

module.exports.getExpertByUsername = function(req, res, next) {
	if (!Validations.isString(req.params.username)) {
		return res.status(422).json({
			err: null,
			msg: "expertId parameter must be a valid ObjectId.",
			data: null
		});
	}
	Expert.findOne({ username: req.params.username }).exec(function(err, expert) {
		if (err) {
			return next(err);
		}
		if (!expert) {
			return res
				.status(404)
				.json({ err: null, msg: "Expert not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "Expert retrieved successfully.",
			data: expert
		});
	});
};
/**
 * Creates a new expert and adds it to the Experts' table in database.
 * @param {string} username
 * @param {number} rating
 * @return json {error} or {message, expert}
 */
//done testing

module.exports.createExpert = function(req, res, next) {
	var valid = req.body.username && Validations.isString(req.body.username);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "username(String) are required field",
			data: null
		});
	}

	Expert.findOne({
		username: req.body.username.trim().toLowerCase()
	}).exec(function(err, ex) {
		if (err) {
			return next(err);
		}

		if (ex) {
			return res.status(422).json({
				err: null,
				msg: "An expert with this username already exists.",
				data: null
			});
		}

		Expert.create(req.body, function(err, Expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Expert was created successfully.",
				data: Expert
			});
		});
	});
};

module.exports.addTopic = function(req, res, next) {
	res.send("assa");
	if (!Validations.isObjectId(req.params.expertId)) {
		return res.status(422).json({
			err: null,
			msg: "expertId parameter must be a valid ObjectId.",
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

	Expert.findById(req.params.expertId).exec(function(err, expert) {
		if (err) {
			return next(err);
		}
		if (!expert) {
			return res
				.status(404)
				.json({ err: null, msg: "Expert not found.", data: null });
		}
		Topic.findById(req.body.topicId).exec(function(err, retopic) {
			if (err) {
				return next(err);
			}
			if (!expert) {
				return res
					.status(404)
					.json({ err: null, msg: "Expert not found.", data: null });
			}
			expert.topics.push(retopic);

			expert.save(function(err) {
				if (err) {
					return next(err);
				}
				res.status(201).json({
					err: null,
					msg: "Topic was added successfully.",
					data: expert
				});
			});
		});
	});
};

module.exports.sortExpertsRatingHighestToLowest = function(req, res, next) {
	var mysort = { rating: -1 };
	Expert.find({})
		.sort(mysort)
		.exec(function(err, experts) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Experts retrieved descendingly by rating successfully.",
				data: experts
			});
		});
};

/**
 * Updates experts' fields with newer field if provided.
 * @param {ObjectId} expertId
 * @param {string} username
 * @param {json} body
 * @return json {error} or {message, updatedExpert}
 */
//done testing
module.exports.updateExpert = function(req, res, next) {
	if (!Validations.isObjectId(req.params.expertId)) {
		return res.status(422).json({
			err: null,
			msg: "expertId parameter must be a valid ObjectId.",
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
	Expert.findOne({
		username: req.body.username.trim().toLowerCase()
	}).exec(function(err, hoba) {
		if (err) {
			return next(err);
		}

		if (hoba) {
			return res.status(422).json({
				err: null,
				msg: "An expert with this username already exists.",
				data: null
			});
		}

		Expert.findByIdAndUpdate(
			req.params.expertId,
			{
				$set: req.body
			},
			{ new: true }
		).exec(function(err, updatedExpert) {
			if (err) {
				return next(err);
			}
			if (!updatedExpert) {
				return res
					.status(404)
					.json({ err: null, msg: "Expert not found.", data: null });
			}
			res.status(200).json({
				err: null,
				msg: "Expert was updated successfully.",
				data: updatedExpert
			});
		});
	});
};

/**
 * Deletes a certain Expert from the database.
 * @param {String} username
 * @return json {error} or {message, deletedExpert}
 */
//done testing

module.exports.deleteExpert = function(req, res, next) {
	if (!Validations.isString(req.params.username)) {
		return res.status(422).json({
			err: null,
			msg: "username(String) parameter must be a valid ObjectId.",
			data: null
		});
	}
	Expert.findOneAndRemove({ username: req.params.username }).exec(function(
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
		User.findOneAndUpdate(
			{ username: req.params.username },
			{ $set: { type: "user" } }
		).exec(function(err, modifiedUser) {
			if (err) {
				return next(err);
			}
			if (!modifiedUser) {
				return res
					.status(404)
					.json({ err: null, msg: "User not found.", data: null });
			}
			res.status(200).json({
				err: null,
				msg: "Expert was deleted successfully.",
				data: deletedExpert
			});
		});
	});
};
/**
 * Sorts Experts depending on Rating from lowest to highest.
 * @param type
 * @return json {error} or {message, experts}
 */
//done testing
module.exports.sortExpertsRating = function(req, res, next) {

    if (!Validations.isNumber(req.params.type)) {
        return res.status(422).json({
            err: null,
            msg: "type(Number) parameter must be a valid ObjectId.",
            data: null
        });
    }

    var mysort = { avgRating: req.params.type };
// sorting Expert collection based on Rating if type =1 then it will sort in ascending way and if -1 it will be in descending way
    User.find({ type: "expert" })
        .sort(mysort)
        .exec(function(err, experts) {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                err: null,
                msg: "Experts retrieved sorted by rating successfully.",
                data: experts
            });
        });
};

/**
 * Sorts Experts depending on Username.
 * @param type
 * @return json {error} or {message, experts}
 */
//done testing
module.exports.sortExpertsUsername = function(req, res, next) {
	if (!Validations.isNumber(req.params.type)) {
		return res.status(422).json({
			err: null,
			msg: "type(Number) parameter must be a valid ObjectId.",
			data: null
		});
	}

	var mysort = { username: req.params.type };

	// sorting Expert collection based on username if type =1 then it will sort in ascending way and if -1 it will be in descending way
    User.find({ type: "expert" })
		.sort(mysort)
		.exec(function(err, experts) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Experts retrieved sorted by username successfully.",
				data: experts
			});
		});
};

//temporary method its just a sample on how to search by username partially
module.exports.searchByUsername = function(req, res, next) {
	Expert.find({ username: { $regex: "^" + req.params.keyword } }).exec(function(
		err,
		expert
	) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Search done successfully.",
			data: expert
		});
	});
};

module.exports.filterByOverview = function(req, res, next) {
	Expert.find({ expertOverview: { $regex: req.params.overview } }).exec(
		function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		}
	);
};

module.exports.filterByTopicTitle = function(req, res, next) {
	// searching by topic title
	Expert.find({ "topics.topicTitle": { $regex: "^" + req.params.title } }).exec(
		function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		}
	);
};

module.exports.filterByOverviewAndTitle = function(req, res, next) {
	Expert.find({
		$and: [
			{ expertOverview: { $regex: req.params.overview } },
			{ "topics.topicTitle": { $regex: "^" + req.params.title } }
		]
	}).exec(function(err, expert) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Search done successfully.",
			data: expert
		});
	});
};
//Tested
module.exports.filterByTopicTitleAndRatingHighToLow = function(req, res, next) {
	Expert.find({ "topics.topicTitle": { $regex: "^" + req.params.title } })
		.sort({ rating: -1 })
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};
//Tested
module.exports.filterByTopicTitleAndRatingLowToHigh = function(req, res, next) {
	var mysort = { rating: 1 };
	Expert.find({ "topics.topicTitle": { $regex: "^" + req.params.title } })
		.sort(mysort)
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};
//Tested
module.exports.filterByOverviewAndRatingHighToLow = function(req, res, next) {
	var mysort = { rating: -1 };
	Expert.find({ expertOverview: { $regex: req.params.overview } })
		.sort(mysort)
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};
//Tested
module.exports.filterByOverviewAndRatingLowToHigh = function(req, res, next) {
	var mysort = { rating: 1 };
	Expert.find({ expertOverview: { $regex: req.params.overview } })
		.sort(mysort)
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};

module.exports.filterByOverviewAndTitleAndratingHighToLow = function(
	req,
	res,
	next
) {
	var mysort = { rating: -1 };
	Expert.find({
		$and: [
			{ expertOverview: { $regex: req.params.overview } },
			{ "topics.topicTitle": { $regex: "^" + req.params.title } }
		]
	})
		.sort(mysort)
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};

module.exports.filterByOverviewAndTitleAndRatingLowToHigh = function(
	req,
	res,
	next
) {
	var mysort = { rating: 1 };
	Expert.find({
		$and: [
			{ expertOverview: { $regex: req.params.overview } },
			{ "topics.topicTitle": { $regex: "^" + req.params.title } }
		]
	})
		.sort(mysort)
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};

module.exports.filterByTopicTitleAndUsernameHighToLow = function(
	req,
	res,
	next
) {
	// filtering by topic title and username descending
	Expert.find({ "topics.topicTitle": { $regex: "^" + req.params.title } })
		.sort({ username: -1 })
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};

module.exports.filterByTopicTitleAndUsernameLowToHigh = function(
	req,
	res,
	next
) {
	// filtering by topic title and username ascending
	Expert.find({ "topics.topicTitle": { $regex: "^" + req.params.title } })
		.sort({ rating: 1 })
		.exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Search done successfully.",
				data: expert
			});
		});
};

module.exports.sortExpertsbyRating = function(req, res, next) {
	var mysort = { rating: -1 }; // sorting Expert collection based on rating field in descending way as it's (-1)
	Expert.find()
		.sort(mysort)
		.toArray(function(err, result) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Experts were sorted successfully.",
				data: result
			});
		});
};
//method getblockeduser

//this method is implemented to enable the expert to get the list of his/her blocked users
// @params Decodedtoken.user._id
// @return jason file of experts

module.exports.getblockedusers = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		Expert.findOne({
			username: user.username
		}).exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			if (!expert) {
				return res
					.status(404)
					.json({ err: null, msg: "expert not found.", data: null });
			}

			res.status(200).json({
				err: null,
				msg: "List of blocked users retrieved successfully.",
				data: expert.blockedusers
			});
		});
	});
};
//method ublockeduser

//this method is implemented to enable the expert to unblock the user
//by removing the user from the list of blocked users

//@params userId
// @params Decodedtoken.user._id
module.exports.unblockuser = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		Expert.findOne({
			username: user.username
		}).exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			if (!expert) {
				return res
					.status(404)
					.json({ err: null, msg: "expert not found.", data: null });
			}

			var unblockeduser = expert.blockedusers.id(req.params.userid);

			if (!unblockeduser) {
				return res
					.status(404)
					.json({ err: null, msg: "user not found.", data: null });
			}
			unblockeduser.remove();

			expert.save(function(err) {
				if (err) {
					return next(err);
				}
				res.status(200).json({
					err: null,
					msg: "user was deleted successfully.",
					data: unblockeduser
				});
			});
		});
	});
};
//method blockuser

//this method is implemented to enabe the expert to block un wanted user from booking any
// reservation with him/her , by adding the user in the expert's list of blocked users
//
//@params userId
// @params Decodedtoken.user._id
// @return jason file of experts
module.exports.BlockUser = function(req, res, next) {
	if (!Validations.isString(req.body.username)) {
		return res.status(422).json({
			err: null,
			msg: "User Name parameter must be a string.",
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

		User.findOne({
			username: req.body.username
		}).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res
					.status(404)
					.json({ err: null, msg: "User not found.", data: null });
			}
			var user_to_be_blocked = expert.blockedusers.id(user._id);
			if (user_to_be_blocked) {
				return res
					.status(404)
					.json({ err: null, msg: "This user is already blocked", data: null });
			}

			var blockeduser = expert.blockedusers.create({
				_id: user._id,
				username: user.username
			});
			expert.blockedusers.push(blockeduser);

			expert.save(function(err) {
				if (err) {
					return next(err);
				}
				res.status(201).json({
					err: null,
					msg: "user was blocked  successfully.",
					data: expert
				});
			});
		});
	});
};

module.exports.getExpertTopics = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		Expert.findOne({
			username: user.username
		}).exec(function(err, expert) {
			if (err) {
				return next(err);
			}
			if (!expert) {
				return res
					.status(404)
					.json({ err: null, msg: "expert not found.", data: null });
			}

			res.status(200).json({
				err: null,
				msg: "List of topics retrieved successfully.",
				data: expert.topics
			});
		});
	});
};



