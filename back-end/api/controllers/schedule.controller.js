var mongoose = require("mongoose"),
	moment = require("moment"),
	Validations = require("../utils/Validations"),
	User = mongoose.model("User");

/**
 * Creates the schedule that holds all the reservations of the user.
 * @param {string} date
 * @param {string} time
 * @param {string} sessionType
 * @return json {error} or {message, newSchedule}
 */
module.exports.createSchedule = function(req, res, next) {
	var valid =
		req.body.date &&
		Validations.isString(req.body.date) &&
		req.body.time &&
		Validations.isString(req.body.time) &&
		req.body.sessionType &&
		Validations.isString(req.body.sessionType);

	if (!valid) {
		return res.status(422).json({
			err: null,
			msg:
				"date(String), time(String) and sessionType(String) are required fields",
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

		var newScheduleDate = new Date(req.body.date.trim());
		var newScheduleTime = new Date(req.body.time.trim());
		var test1 = "no";
		var test2 = "yes";

		var scheduleDateExists = user.schedules.some(function(schedule) {
			if (schedule.date.getTime() === newScheduleDate.getTime()) {
				test1 = "test";
			}
		});

		var scheduleTimeExists = user.schedules.some(function(schedule) {
			if (schedule.time.getTime() === newScheduleTime.getTime()) {
				test2 = "test";
			}
		});

		if (test1 == test2) {
			return res.status(422).json({
				err: null,
				msg:'A schedule with the same date and time already exists.',
				data: null
			});
		}
		// Security Check
		//delete req.body.sessionType;
		req.body.date = new Date(req.body.date.trim());
		req.body.time = new Date(req.body.time.trim());

		var newSchedule = user.schedules.create(req.body);
		user.schedules.push(newSchedule);
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(201).json({
				err: null,
				msg: "Schedule was created successfully.",
				data: newSchedule
			});
		});
	});
};

/**
 * Responsible for deleting a specific part of the schedule.
 * @param {number} scheduleId
 * @return json {error} or {message, schedule}
 */
module.exports.deleteSchedule = function(req, res, next) {
	if (!Validations.isObjectId(req.params.scheduleId)) {
		return res.status(422).json({
			err: null,
			msg: "scheduleId parameter must be a valid ObjectId.",
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
		var schedule = user.schedules.id(req.params.scheduleId);
		if (!schedule) {
			return res
				.status(404)
				.json({ err: null, msg: "Schedule not found.", data: null });
		}
		schedule.remove();
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Schedule was deleted successfully.",
				data: schedule
			});
		});
	});
};

/**
 * Responsible for deleting all of the schedule.
 * @param null
 * @return json {error} or {message, schedule}
 */
module.exports.deleteSchedules = function(req, res, next) {
	User.findById(req.decodedToken.user._id).exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res
				.status(404)
				.json({ err: null, msg: "User not found.", data: null });
		}
		
		user.schedules.remove({});
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				err: null,
				msg: "Schedule was deleted successfully.",
				data: null
			});
		});
	});
};

/**
 * Responsible for fetching the whole array of schedules from database.
 * @param none
 * @return json {error} or {message, schedule}
 */
module.exports.getSchedules = function(req, res, next) {
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
			msg: "Schedules retrieved successfully.",
			data: user.schedules
		});
	});
};

/**
 * Responsible for fetching a specific part from the user's schedule.
 * @param {number} scheduleId
 * @return json {error} or {message, schedule}
 */
module.exports.getSchedule = function(req, res, next) {
	if (!Validations.isObjectId(req.params.scheduleId)) {
		return res.status(422).json({
			err: null,
			msg: "scheduleId parameter must be a valid ObjectId.",
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

		var schedule = user.schedules.id(req.params.scheduleId);
		if (!schedule) {
			return res
				.status(404)
				.json({ err: null, msg: "Schedule not found.", data: null });
		}

		res.status(200).json({
			err: null,
			msg: "Schedule was retrieved successfully.",
			data: schedule
		});
	});
};


module.exports.updateSchedule = function(req, res, next) {
	if (
	  !Validations.isObjectId(req.params.scheduleId)
	) {
	  return res.status(422).json({
		err: null,
		msg: 'scheduleId parameter must be a valid ObjectId.',
		data: null
	  });
	}
	var valid =
	  req.body.date &&
	  Validations.isString(req.body.date) &&
	  req.body.time &&
	  Validations.isString(req.body.time) &&
	  (req.body.sessionType ? Validations.isString(req.body.sessionType) : true);
	if (!valid) {
	  return res.status(422).json({
		err: null,
		msg:
		  'date(String) and time(String) are required fields, sessionType(String) is optional but has to be a valid string.',
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
		  .json({ err: null, msg: 'User not found.', data: null });
	  }
  
	  var schedule = user.schedules.id(req.params.scheduleId);
	  if (!schedule) {
		return res
		  .status(404)
		  .json({ err: null, msg: 'Schedule not found.', data: null });
	  }
	 
		var newScheduleDate = new Date(req.body.date.trim());
		var newScheduleTime = new Date(req.body.time.trim());
		var test1 = "no";
		var test2 = "yes";

		var scheduleDateExists = user.schedules.some(function(schedule) {
			if (schedule.date.getTime() === newScheduleDate.getTime()) {
				test1 = "test";
			}
		});

		var scheduleTimeExists = user.schedules.some(function(schedule) {
			if (schedule.time.getTime() === newScheduleTime.getTime()) {
				test2 = "test";
			}
		});

		if (test1 == test2) {
			return res.status(422).json({
				err: null,
				msg:
				'A schedule with the same date and time already exists.',
				data: null
			});
		}

	  schedule.date = req.body.date;
	  schedule.time = req.body.time;
	  schedule.sessionType = req.body.sessionType !== null ? req.body.sessionType : schedule.sessionType;
  
	  user.save(function(err) {
		if (err) {
		  return next(err);
		}
		res.status(200).json({
		  err: null,
		  msg: 'Schedule was updated successfully.',
		  data: schedule
		});
	  });
	});
  };