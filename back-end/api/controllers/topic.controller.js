var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	Topic = mongoose.model("Topic"),
	Expert = mongoose.model("Expert");
User = mongoose.model("User");

/**
 * Creates expert topic.
 * @param {string} topicTitle
 * @param {string} topicDescription
 * @return: json {err} or {message, new topic}
 */
module.exports.createTopic = function(req, res, next) {
	var creator;
	Expert.findOne({ username: req.decodedToken.user.username }).exec(function(
		err,
		expert
	) {
		if (err) {
			return next(err);
		}
		if (!expert) {
			return res.status(401).json({
				err: null,
				msg: "You do not have access to this action.",
				data: null
			});
		}
		creator = expert;
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
				newTopic.experts.push(creator);
				newTopic.save(function(err) {
					if (err) {
						return next(err);
					}
				});
				creator.topics.push(newTopic);
				creator.save(function(err) {
					if (err) {
						return next(err);
					}
				});
				res.status(201).json({
					err: null,
					msg: "Topic was created successfully.",
					data: newTopic
				});
			});
		});
	});
};

/**
 * Gets a topic corresponding to a certain id.
 * @param {ObjectId} topicID
 * @return json {err} or {message, topics}
 */
module.exports.getTopic = function(req, res, next) {
	if (!Validations.isObjectId(req.params.topicId)) {
		return res.status(422).json({
			err: null,
			msg: "topicId parameter must be a valid ObjectId.",
			data: null
		});
	}
	Topic.findById(req.params.topicId).exec(function(err, topic) {
		if (err) {
			return next(err);
		}
		if (!topic) {
			return res
				.status(404)
				.json({ err: null, msg: "Topic not found.", data: null });
		}
		res.status(200).json({
			err: null,
			msg: "Topic retrieved successfully.",
			data: topic
		});
	});
};

module.exports.getTopics = function(req, res, next) {
	Topic.find({}).exec(function(err, topics) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Topics retrieved successfully.",
			data: topics
		});
	});
};

/**
 * Adds an expert to a topic
 * @param {ObjectId} topicID
 * @param {string} topictitle
 * @return json {err} or {message, topic}
 */
module.exports.addExpert = function(req, res, next) {
	if (!Validations.isObjectId(req.params.topicId)) {
		return res.status(422).json({
			err: null,
			msg: "topicId parameter must be a valid ObjectId.",
			data: null
		});
	}
	var valid = req.body.title && Validations.isString(req.body.title);
	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "title is a required field.",
			data: null
		});
	}

	Topic.findById(req.params.topicId).exec(function(err, topic) {
		if (err) {
			return next(err);
		}
		if (!topic) {
			return res
				.status(404)
				.json({ err: null, msg: "Topic not found.", data: null });
		}
		Expert.findById(req.body.expertId).exec(function(err, expertW) {
			if (err) {
				return next(err);
			}
			if (!topic) {
				return res
					.status(404)
					.json({ err: null, msg: "Topic not found.", data: null });
			}
			topic.experts.push(expertW);
			topic.save(function(err) {
				if (err) {
					return next(err);
				}
				res.status(201).json({
					err: null,
					msg: "Expert was added successfully.",
					data: topic
				});
			});
		});
	});
};

/**
 * Retrieves all Experts corresponding to a certain Topic.
 * @param {String} topicTitle
 * @return json {error} or {message, experts}
 */
module.exports.getExpertsByTopic = function(req, res, next) {
	if (!Validations.isString(req.params.topicTitle)) {
		return res.status(422).json({
			err: null,
			msg: "topicTitle parameter must be a valid String.",
			data: null
		});
	}

	Topic.find({ topicTitle: req.params.topicTitle }).exec(function(err, topicc) {
		if (err) {
			return next(err);
		}
		if (!topicc) {
			return res
				.status(404)
				.json({ err: null, msg: "Topic not found.", data: null });
		}

		experts = [];
		Topic.find({ topicTitle: { $regex: "^" + req.params.topicTitle } }).exec(
			function(err, topic) {
				if (err) {
					return next(err);
				}
				if (!topic) {
					return res
						.status(404)
						.json({ err: null, msg: "Topic not found.", data: null });
				}
				for (var i = 0; i < topic.length; i++) {
					for (var j = 0; j < topic[i].experts.length; j++) {
						experts.push(topic[i].experts[j].username);
					}
				}
				users = [];
				var x;
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
	});
};
