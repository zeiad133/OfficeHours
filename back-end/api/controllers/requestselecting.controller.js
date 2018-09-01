var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	RequestSelecting = mongoose.model("RequestSelecting");

/**
 * Adds a new Expert to a certain Request's experts array.
 * @param {string} name
 * @param {ObjectId} requestID
 * @return: json {error} or {message, requestselecting}
 */

module.exports.AddExpertToReq = function(req, res, next) {
	var valid = req.body.name && Validations.isString(req.body.name);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: " expert name must be a string ",
			data: null
		});
	}
	RequestSelecting.findById(req.params.requestId).exec(function(
		err,
		requestselecting
	) {
		if (err) {
			return next(err);
		}
		if (!requestselecting) {
			return res
				.status(404)
				.json({ err: null, msg: "request is not found.", data: null });
		}

		requestselecting.Experts.push(req.body.name);

		requestselecting.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(201).json({
				err: null,
				msg: "Expert was added successfully.",
				data: requestselecting
			});
		});
	});
};
