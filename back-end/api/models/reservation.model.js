var mongoose = require("mongoose");

var reservationSchema = mongoose.Schema({
	userName: [
		{
			type: String,
			trim: true,
			limitTo: 5
		}
	],
	expertName: {
		type: String,
		required: true,
		trim: true
	},
	reservationDate: {
		type: Date,
		// required: true,
		trim: true
	},
	type: {
		type: String,
               enum:['Private','Public'],
		required: true,
		trim: true
	}
});
mongoose.model("reservation", reservationSchema);
