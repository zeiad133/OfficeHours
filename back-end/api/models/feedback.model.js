var mongoose = require("mongoose");

var feedbackSchema = mongoose.Schema({
    reviewer: {
        required: true, 
        type: String, 
        trim: true, 
        lowercase: true
	}, 

    reviewee: { 
        required: true, 
        type: String, 
        trim: true, 
        lowercase: true
    },
    selectedSlot: {
		type: String,
	},
    room: {
        type: String, 
        trim: true, 
        lowercase: true, 
        required: true
    },
    rate:{
        type:Number
    },
	feedback: {
        type: String, 
        trim: true
    }
});

mongoose.model("Feedback", feedbackSchema);
