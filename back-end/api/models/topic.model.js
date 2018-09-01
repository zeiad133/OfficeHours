var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var expertSchema = mongoose.Schema({
	username : {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	}
});

 var topicSchema = mongoose.Schema({
	topicTitle: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true
	},
	topicDescription: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	experts: [expertSchema]
});
mongoose.model("Topic", topicSchema);
