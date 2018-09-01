var mongoose = require("mongoose");

var applicationSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	reason: {
		type: String,
		required: true,
		trim: true
	},
	rating: {
		type: Number
	},
	status: {
		type: String,
		trim: true,
		lowercase: true,
		default: "pending"
	}
});

mongoose.model("Application", applicationSchema);
