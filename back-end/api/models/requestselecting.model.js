var mongoose = require("mongoose");

var requestselectingschema = mongoose.Schema({
	requestId: {
		type: Number,
		required: true,
		min: 0
	},
	username: String,
	Topic: String,
	Experts: [String],
	Question: String
});

mongoose.model("RequestSelecting", requestselectingschema);
