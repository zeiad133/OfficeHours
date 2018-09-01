var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	Request = mongoose.model("Application"),
	User = mongoose.model("User");

/**
 * Retrieves all the requests made by user.
 * @param none
 * @return json {error} or {message, request}
 */
//done testing
module.exports.getApplications = function(req, res, next) {
	Request.find({}).exec(function(err, request) {
		if (err) {
			return next(err);
		}
		res.status(200).json({
			err: null,
			msg: "Expert requests retrieved successfully.",
			data: request
		});
	});
};

/**
 *lets the user make request to be an expert
 *@params reason:String
 *@return: json {error} or {message,request}
 */
//done testing
module.exports.applyForExpert = function(req, res, next) {
	var valid = req.body.reason && Validations.isString(req.body.reason);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "reason(String) required fields missing.",
			data: null
		});
	}

	User.findByIdAndUpdate(
		req.decodedToken.user._id,
		{
			$set: { appliedForExpert: true }
		},
		{ new: true }
	).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}

		req.body.username = user.username;
		req.body.rating = user.avgRating;
		Request.create(req.body, function(err, request) {
			if (err) {
				return next(err);
			}
			res.status(201).json({
				err: null,
				msg: "Request was created successfully.",
				data: request
			});
		});
	});
};

/**
 * lets the user delete his request to be an expert.
 * @param {ObjectId} requestId
 * @return json {error} or {message, deletedrequest}
 */
//done testing
module.exports.deleteApplication = function(req, res, next) {
	if (!Validations.isObjectId(req.params.requestId)) {
		return res.status(422).json({
			err: null,
			msg: "RequestId parameter must be a valid ObjectId.",
			data: null
		});
	}
	Request.findByIdAndRemove(req.params.requestId).exec(function(
		err,
		deletedRequest
	) {
		if (err) {
			return next(err);
		}
		if (!deletedRequest) {
			return res
				.status(404)
				.json({ err: null, msg: "Request not found.", data: null });
		}
		User.findOneAndUpdate(
			{ username: deletedRequest.username },
			{ $set: { appliedForExpert: false } },
			{ new: true }
		).exec(function(err, currUser) {
			if (err) {
				return next(err);
			}
			if (!currUser) {
				return res
					.status(404)
					.json({ err: null, msg: "User not found.", data: null });
			}
			res.status(200).json({
				err: null,
				msg: "Request was deleted successfully.",
				data: deletedRequest
			});
		});
	});
};
