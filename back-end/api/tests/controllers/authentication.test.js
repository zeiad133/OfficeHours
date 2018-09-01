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
	should = require("should"),
	chai = require("chai"),
	chaiHttp = require("chai-http"),
	server = require(base + "/app");
chai.use(chaiHttp);

(UserAuthorization = null), (ListAuthorization = null), (ExpertId = null);

module.exports.authenticationTests = describe("Testing Authentication Functions", function() {
	before(function(done) {
		mongoose.connect("mongodb://localhost:27017/nodejs-to-do-test", function() {
			console.log("Connected to TestDb");
			done();
		});
	});

	describe("Register New User", function() {
		it("Should Signup a new User", function(done) {
			this.timeout(15000);
			User.remove({}, err => {});
			var userr = {
				email: "dummy@gmail.com",
				password: "123456789",
				confirmPassword: "123456789",
				username: "zeiad", 
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
					res.body.data.should.have.property("email");
					res.body.data.email.should.equal("dummy@gmail.com");
					res.body.data.should.have.property("username");
					res.body.data.username.should.equal("zeiad");
					done();
				});
		});
		it("Should not Signup Missing data", function(done) {
			var userr = {};
			chai
				.request(server)
				.post("/api/auth/register")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql(
						"email(String and of valid email format), password(String) , confirmPassword(String) and username(String) are required fields."
					);
					done();
				});
		});
		it("Should not Signup an already existing User", function(done) {
			var userr = {
				email: "dummy@gmail.com",
				password: "123456789",
				confirmPassword: "123456789",
				username: "zeiad"
			};
			chai
				.request(server)
				.post("/api/auth/register")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql(
						"A user with this email address already exists, please try another email address."
					);
					done();
				});
		});
		it("Should not Signup an already existing User", function(done) {
			var userr = {
				email: "dummy@gmail.com",
				password: "123456789",
				confirmPassword: "123456789",
				username: "zeiad"
			};
			chai
				.request(server)
				.post("/api/auth/register")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql(
						"A user with this email address already exists, please try another email address."
					);
					done();
				});
		});

		it("Should not Signup password length is less than 8", function(done) {
			var userr = {
				email: "dummy1@gmail.com",
				password: "1234567",
				confirmPassword: "1234567",
				username: "zeiad"
			};
			chai
				.request(server)
				.post("/api/auth/register")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql(
						"Password must be of length 8 characters or more."
					);
					done();
				});
		});

		it("Should not Signup not matching passwords", function(done) {
			var userr = {
				email: "dummy2@gmail.com",
				password: "123456789",
				confirmPassword: "123222",
				username: "zeiad"
			};
			chai
				.request(server)
				.post("/api/auth/register")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql(
						"password and confirmPassword does not match."
					);
					done();
				});
		});
	});
	describe("Login User", function() {
		it("Should be able to login User", function(done) {
			userr;
			var userr = {
				email: "dummy@gmail.com",
				password: "123456789"
			};
			chai
				.request(server)
				.post("/api/auth/login")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql("Welcome");
					res.body.should.have.property("data");
					UserAuthorization = res.body.data;
					done();
				});
		});
		it("Should not be able to login User Missing email or Pawword", function(done) {
			var userr = {};
			chai
				.request(server)
				.post("/api/auth/login")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql(
						"email(String and of valid email format) and password(String) are required fields."
					);
					done();
				});
		});
		it("Should not be able to login User not found", function(done) {
			var userr = {
				email: "dummy2@gmail.com",
				password: "aaaa"
			};
			chai
				.request(server)
				.post("/api/auth/login")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(401);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql("User not found.");
					done();
				});
		});
		it("Should not be able to login User Password incorrect", function(done) {
			var userr = {
				email: "dummy@gmail.com",
				password: "aaaa"
			};
			chai
				.request(server)
				.post("/api/auth/login")
				.send(userr)
				.end(function(err, res) {
					res.status.should.be.eql(401);
					res.body.should.have.property("msg");
					res.body.msg.should.be.eql("Password is incorrect.");
					done();
				});
		});
	});
});
