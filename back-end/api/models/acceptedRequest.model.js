var mongoose = require("mongoose");
var acceptedRequestSchema = mongoose.Schema({
	username: String,
	expertname: String,
	slots: [Date]
});

mongoose.model("AcceptedRequest", acceptedRequestSchema);
