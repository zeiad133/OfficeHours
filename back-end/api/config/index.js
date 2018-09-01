// Global App Configuration
module.exports = {
	FRONTEND_URI: process.env.FRONTEND_URI || "http://localhost:4200/",
	SECRET: "32876qihsdh76@&#!742(*#HG&#28702y&##@^!()(&^#))jhscbd",
	MONGO_URI:
		process.env.NODE_ENV === "production"
			? "mongodb://lozi97:lozilozi@ds147659.mlab.com:47659/gitforce"
			: "mongodb://localhost:27017/office-hours",
	EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
