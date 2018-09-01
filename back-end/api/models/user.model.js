var mongoose = require("mongoose");

var experienceSchema = mongoose.Schema({
	job: {
		type: String,
		trim: true,
		required: true
	},
	date: {
		type: String,
		trim: true,
		required: true
	},
	details: {
		type: String,
		required: true
	},
	companyName: {
		type: String,
		required: true
	}
});

var notesSchema = mongoose.Schema({
	note: {
		type: String,
		trim: true,
		required: true
	},
	noteTitle: {
		type: String,
		trim: true,
		required: true
	}
});

var favExpertsSchema = mongoose.Schema({
	name: {
		//Experts' Username
		type: String,
		trim: true
	}
});

var ratingSchema = mongoose.Schema({
	rating: {
		type: Number,
		trim: true,
		required: true
	}
});

var scheduleSchema = mongoose.Schema({
	date: {
		required: true,
		type: Date,
		required: true,
		trim: true
	},
	time: {
		type: Date,
		//  required: true,
		trim: true
	},
	sessionType: {
		type: String,
		// required: true,
		trim: true
	}
});

var userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true
	},
	email: {
		type: String,
		//required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		trim: true
	},
	firstName: {
		type: String,
		trim: true
	},
	lastName: {
		type: String,
		trim: true
	},
	job: {
		type: String,
		trim: true
	},
	profilePic: {
		type: String,
		default: "assets/pro.png"
	},
	coverPic: {
		type: String,
		trim: true,
		default: "assets/new.jpg"
	},
	appliedForExpert: {
		type: Boolean,
		default: false
	},
	schedules: [scheduleSchema],
	about: {
		type: String
	},
	experiences: [experienceSchema],
	phoneNumber: {
		type: Number,
		trim: true,
		default: "0123456789"
	},
	address: {
		type: String,
		trim: true,
		default: "yourAddress"
	},

	favExperts: [favExpertsSchema],
	notes: [notesSchema],
	avgRating: {
		type: Number,
		trim: true,
		default: 5
	},
	ratings: [ratingSchema],
	type: {
		type: String,
		trim: true,
		required: true,
		default: "user"
	},
	privacy: {
		type: String,
		trim: true,
		lowercase: true,
		default: "public"
	}
});

// Override the transform function of the schema to delete the password before it returns the object
if (!userSchema.options.toObject) {
	userSchema.options.toObject = {};
}
userSchema.options.toObject.transform = (document, transformedDocument) => {
	delete transformedDocument.password;
	return transformedDocument;
};

mongoose.model("User", userSchema);
