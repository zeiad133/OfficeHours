

var expertTests = require("./expert.test");
var authenticationTests = require("./authentication.test");
var scheduleTests = require("./schedule.test");
var topicTests = require("./topic.test");
var userTests = require("./user.test");
var adminTests = require("./admin.test");
var questionTests = require("./question.test");
process.env.NODE_ENV = "test";

let base = undefined;
if (!process.env.PWD) {
	base = process.cwd();
} else {
	base = process.env.PWD;
}
const mongoose = require("mongoose"),
	models = require(base + "/api/models/user.model"),
	models2 = require(base + "/api/models/expert.model"),
	User = mongoose.model("User"),
	Expert = mongoose.model("Expert"),
	Topic = mongoose.model("Topic"),
	Admin = mongoose.model("Admin"),
	Question = mongoose.model("Question"),
	should = require("should"),
	chai = require("chai"),
	chaiHttp = require("chai-http"),
	server = require(base + "/app");
chai.use(chaiHttp);

(UserAuthorization = null), (ListAuthorization = null), (ExpertId = null), (scheduleId = null);

authenticationTests;
describe("Testing application Functions", function() {
		it("Should Signup a new User", function(done) {
			this.timeout(15000);
			User.remove({}, err => {});
			var userr = {
				email: "test@gmail.com",
				password: "123456789",
				confirmPassword: "123456789",
				username: "test"
			};
			chai
				.request(server)
				.post("/api/auth/register")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql(
						"Registration successful, you can now login to your account."
					);
					userId = res.body.data._id;
					console.log(userId);
					done();
				});
		});
	});

//expertTests;
//scheduleTests;
//userTests;
questionTests;
