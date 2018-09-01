var mongoose = require("mongoose");

var topicSchema = mongoose.Schema({
	topicTitle: {
		type: String,
		trim: true,
		lowercase: true
	},
	topicDescription: {
		type: String,
		trim: true,
		lowercase: true
	}

});

var blockedusersSchema = mongoose.Schema({
	username: {
		type: String,
		trim: true
	}
});

var expertSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	topics: [topicSchema],
	blockedusers: [blockedusersSchema]
});

mongoose.model("Expert", expertSchema);
