var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	AcceptedRequest = mongoose.model("AcceptedRequest");

module.exports.sendingSlots = function(req, res, next) {
	var valid =
		req.body.username &&
		Validations.isString(req.body.username) &&
		req.body.expertname &&
		Validations.isString(req.body.expertname);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg: "Some data is not correct  ",
			data: null
		});
	}
	AcceptedRequest.create(req.body, function(err, acceptedrequest) {
		if (err) {
			return next(err);
		}
		res.status(201).json({
			err: null,
			msg: "Slots sent successfully.",
			data: acceptedrequest
		});
	});
};
