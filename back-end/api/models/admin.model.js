var mongoose = require("mongoose");

var adminSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	}
});

mongoose.model("Admin", adminSchema);
