var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var userSchema = require("./user.model");


var questionSchema = mongoose.Schema({
	questionSubject: {
		type: String,
		require: true,
		trim: true
	},
	questionContent: {
		type: String,
		required: true,
		trim: true
	},
	user: {
		type: userSchema,
		required: true,
		trim: true,
		lowercase: true
	},
	expert: {
		type: userSchema,
		required: true,
		trim: true,
		lowercase: true
	},
	status: {
		type: String,
		trim: true,
		default: "pending",
		lowercase: true
	},
	message: {
		type: String,
		trim: true
	},
	time: {
		type:Date,
		default:Date.now
	},
	slots:{
		type:[Date],
		
	},
	selectedSlot: {
		type: String,
	},
	sessionRoom: {
		type: String,
		trim: true
	},
	type: {
		type: String,
               enum:['Private','Public'],
		trim: true
	},
	typeOfSession:{
		type: String,
               enum:['Video','Chat'],
		trim: true
	}
});

 function arrayLimit(val) {
 	return val.length <= 3;
}

mongoose.model("Question", questionSchema);
