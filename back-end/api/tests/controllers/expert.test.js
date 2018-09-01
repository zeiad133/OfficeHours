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
	topicModel = require(base + "/api/models/topic.model"),
	Topic=mongoose.model("Topic"),

	User = mongoose.model("User"),
	Expert = mongoose.model("Expert"),
	should = require("should"),
	chai = require("chai"),
	chaiHttp = require("chai-http"),
	server = require(base + "/app");
chai.use(chaiHttp);

(UserAuthorization = null), (ListAuthorization = null), (ExpertId = null);(blockedID = null);(topic_id = null);

module.exports.expertTests = describe("Testing Experts Functions", function() {
	before(function(done) {
		mongoose.connect("mongodb://localhost:27017/nodejs-to-do-test", function() {
			//console.log("Connected to TestDb");
			done();
		});
	});
	describe("Get experts", function(done) {
		it("Should Signup a new User", function(done) {
			this.timeout(15000);
			User.remove({}, err => {});
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

		it("Should Get experts", function(done) {
			chai
				.request(server)
				.get("/api/expert/getExperts")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Experts retrieved successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
	});
	describe("Get experts by username", function(done) {
		it("Should Get experts", function(done) {
			chai
				.request(server)
				.get("/api/expert/getExpertsByUsername/zeiad")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Experts retrieved successfully.");
					res.body.should.have.property("data");
					done();
				});
		});


	});
	describe("Get experts by ID", function(done) {
		it("Should Get experts", function(done) {
			chai
				.request(server)
				.get("/api/expert/getExpertsByUsername/"+ExpertId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Experts retrieved successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Get experts", function(done) {
			chai
				.request(server)
				.get("/api/expert/getExpert/"+ExpertId+'asd')
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("expertId parameter must be a valid ObjectId.");
					res.body.should.have.property("data");
					done();
				});
		});


	});
	describe("Create experts", function(done) {
		it("Should create expert", function(done) {
			this.timeout(15000);
			Expert.remove({}, err => {});
			var hoba = {
				username: "zoz"

			};
			chai
				.request(server)
				.post("/api/expert/createExpert")
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Expert was created successfully.");
					res.body.should.have.property("data");
					ExpertId = res.body.data._id;
					done();
				});
		});
		it("Should Not create expert Username is already an expert ", function(done) {
			var hoba = {
				username: "zoz"

			};
			chai
				.request(server)
				.post("/api/expert/createExpert")
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("An expert with this username already exists.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Not create expert Missing fields", function(done) {
			var hoba = {

			};
			chai
				.request(server)
				.post("/api/expert/createExpert")
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"username(String) are required field"
					);
					res.body.should.have.property("data");
					done();
				});
		});
	});
	describe("update expert", function(done) {
		it("Should update expert", function(done) {
			var hoba = {
				username: "hooba"
			};
			chai
				.request(server)
				.patch("/api/expert/updateExpert/" + ExpertId)
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Expert was updated successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Not update expert Missing fields", function(done) {
			var hoba = {};
			chai
				.request(server)
				.patch("/api/expert/updateExpert/" + ExpertId)
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("username(String) is a required field.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Not update expert Wrong ID", function(done) {
			var hoba = {};
			chai
				.request(server)
				.patch("/api/expert/updateExpert/" + ExpertId + "as")
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"expertId parameter must be a valid ObjectId."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Not update expert exist", function(done) {
			var hoba = {
				username: "hooba"
			};
			chai
				.request(server)
				.patch("/api/expert/updateExpert/" + ExpertId )
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"An expert with this username already exists."
					);
					res.body.should.have.property("data");
					done();
				});
		});
	});
	describe("Delete expert", function(done) {
		it("Should delete expert", function(done) {
			chai
				.request(server)
				.delete("/api/expert/deleteExpert/" + ExpertId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Expert was deleted successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Not delete expert", function(done) {
			chai
				.request(server)
				.delete("/api/expert/deleteExpert/" + ExpertId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Expert not found.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Not Delete expert Wrong ID", function(done) {
			chai
				.request(server)
				.delete("/api/expert/deleteExpert/" + ExpertId + "as")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"expertId parameter must be a valid ObjectId."
					);
					res.body.should.have.property("data");
					done();
				});
		});

	});
	describe("Sort expert", function(done) {


		it("Should Sort experts descendingly by ratings", function(done) {
			chai
				.request(server)
				.get("/api/expert/sortExpertsRating/-1")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Experts retrieved sorted by rating successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});


		it("Should Sort experts ascendingly by ratings", function(done) {
			chai
				.request(server)
				.get("/api/expert/sortExpertsRating/1")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Experts retrieved sorted by rating successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Sort experts ascendingly by Username", function(done) {
			chai
				.request(server)
				.get("/api/expert/sortExpertsUsername/1")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Experts retrieved sorted by username successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Sort experts descendingly by Username", function(done) {
			chai
				.request(server)
				.get("/api/expert/sortExpertsUsername/-1")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Experts retrieved sorted by username successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
	});

	describe("Filter" , function(done){
		it("Should filter By Overview And Title", function(done) {
			var overview = {
				overview: "x"
			};
			var title = {
				title: "x"
			};
			chai
				.request(server)
				.get("/api/expert/filterByOverviewAndTitle/" + overview )
				.get("/api/expert/filterByOverviewAndTitle/:overview" + title)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Search done successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should filter By Topic Title And Rating High To Low", function(done) {
			var title = {
				title: "x"
			};

			chai
				.request(server)
				.get("/api/expert/filterByTopicTitleAndRatingHighToLow/" + title)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Search done successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should filter By Topic Title And Rating Low To High", function(done) {
			var title = {
				title: "x"
			};

			chai
				.request(server)
				.get("/api/expert/filterByTopicTitleAndRatingLowToHigh/" + title)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Search done successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should filter By Overview And Rating High To Low", function(done) {
			var overview = {
				overview: "x"
			};

			chai
				.request(server)
				.get("/api/expert/filterByOverviewAndRatingHighToLow/" + overview)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Search done successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should filter By Overview And Rating Low To High", function(done) {
			var overview = {
				overview: "x"
			};

			chai
				.request(server)
				.get("/api/expert/filterByOverviewAndRatingLowToHigh/" + overview)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Search done successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should filter By Overview And Title And Rating High To Low", function(done) {
			var overview = {
				overview: "x",
			};
			var title ={
				title:"x"
			}

			chai
				.request(server)
				.get("/api/expert/filterByOverviewAndTitleAndratingHighToLow/" + overview)
				.get("/api/expert/filterByOverviewAndTitleAndratingHighToLow/:overview" + title)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Search done successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should filter By Overview And Title And Rating Low To High", function(done) {
			var overview = {
				overview: "x",
			};
			var title ={
				title :"x"
			}

			chai
				.request(server)
				.get("/api/expert/filterByOverviewAndTitleAndratingLowToHigh/" + overview)
				.get("/api/expert/filterByOverviewAndTitleAndratingLowToHigh/:overview" + title)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"Search done successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
	});











	describe("unBlock user", function(done) {
		it("Should Signup a new User", function(done) {

			var userr = {
				_id : "5adb80312cd8a00dd497000f",
				email: "dummy1@gmail.com",
				password: "123456789",
				confirmPassword: "123456789",
				username: "hadeer mohamed"
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
					res.body.data.email.should.equal("dummy1@gmail.com");
					res.body.data.should.have.property("username");
					res.body.data.username.should.equal("hadeer mohamed");
					res.body.data.should.have.property("_id");
					blockedID= res.body.data._id;
					done();
				});
		});
		it("Should create expert", function(done) {
			Expert.remove({}, err => {});
			var expert = {
				username: "zeiad"
			};
			chai
				.request(server)
				.post("/api/expert/createExpert")
				.send(expert)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Expert was created successfully.");
					res.body.should.have.property("data");

					done();
				});
		});
		it("Should block user", function(done) {
			var userr = {
			"username" : "hadeer mohamed"
			};
			chai
				.request(server)
				.post("/api/expert/BlockUser")
				.send(userr)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"user was blocked  successfully."
					);
					res.body.should.have.property("data");

					done();
				});
		});
		it("Should unblock user", function(done) {

			chai
				.request(server)
				.delete("/api/expert/unblockuser/"+blockedID)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"user was deleted successfully."
					);
					res.body.should.have.property("data");
					done();
				});
	    });
		it("Should Not unblock user,blocked user not found", function(done) {

				chai
					.request(server)
					.delete("/api/expert/unblockuser/"+blockedID)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(404);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"user not found."
						);
						res.body.should.have.property("data");
						done();
					});
		});
		it("Should NOT unblock user,expert not found", function(done) {
			Expert.remove({}, err => {});
				chai
					.request(server)
					.delete("/api/expert/unblockuser/"+blockedID)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(404);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"expert not found."
						);
						res.body.should.have.property("data");
						done();
					});
		});
		it("Should not  unblock user,User not found", function(done) {
			User.remove({}, err => {});
						chai
							.request(server)
							.delete("/api/expert/unblockuser/"+blockedID)
							.set("Authorization", UserAuthorization)
							.end(function(err, res) {
								res.status.should.be.eql(404);
								res.body.should.have.property("msg");
								res.body.msg.should.be.equal(
									"User not found."
								);
								res.body.should.have.property("data");
								done();
							});
		});

	});
	describe("view Blocked users", function(done) {
		it("Should Signup a new User", function(done) {
			this.timeout(15000);
			User.remove({}, err => {});
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
		it("Should Signup a new User", function(done) {

			var userr = {
				_id : "5adb80312cd8a00dd497000f",
				email: "dummy1@gmail.com",
				password: "123456789",
				confirmPassword: "123456789",
				username: "hadeer mohamed"
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
					res.body.data.email.should.equal("dummy1@gmail.com");
					res.body.data.should.have.property("username");
					res.body.data.username.should.equal("hadeer mohamed");
					done();
				});
		});
		it("Should create expert", function(done) {
			Expert.remove({}, err => {});
			var expert = {
				username: "zeiad"
			};
			chai
				.request(server)
				.post("/api/expert/createExpert")
				.send(expert)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Expert was created successfully.");
					res.body.should.have.property("data");

					done();
				});
		});
		it("Should block user", function(done) {
			var userr = {
			"username" : "hadeer mohamed"
			};
			chai
				.request(server)
				.post("/api/expert/BlockUser")
				.send(userr)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"user was blocked  successfully."
					);
					res.body.should.have.property("data");

					done();
				});
		});
		it("Should view blocked users", function(done) {


			chai
				.request(server)
				.get("/api/expert/getblockedusers")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"List of blocked users retrieved successfully."
					);
					res.body.should.have.property("data");
					done();
				});
	    });
        it("Should NOT  view blocked users,expert not found", function(done) {
		Expert.remove({}, err => {});
			chai
				.request(server)
				.get("/api/expert/getblockedusers")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"expert not found."
					);
					res.body.should.have.property("data");
					done();
				});
	});
	it("Should NOT  view blocked users,user not found", function(done) {
		User.remove({}, err => {});
					chai
						.request(server)
						.get("/api/expert/getblockedusers")
						.set("Authorization", UserAuthorization)
						.end(function(err, res) {
							res.status.should.be.eql(404);
							res.body.should.have.property("msg");
							res.body.msg.should.be.equal(
								"User not found."
							);
							res.body.should.have.property("data");
							done();
						});
			});



		});

	describe("Block user", function(done) {
		it("Should Signup a new User", function(done) {

			var userr = {
				_id : "5adb80312cd8a00dd497000f",
				email: "dummy1@gmail.com",
				password: "123456789",
				confirmPassword: "123456789",
				username: "hadeer mohamed"
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
					res.body.data.email.should.equal("dummy1@gmail.com");
					res.body.data.should.have.property("username");
					res.body.data.username.should.equal("hadeer mohamed");
					done();
				});
		});
it("Should create expert", function(done) {

	var expert = {
		username: "zeiad"
	};
	chai
		.request(server)
		.post("/api/expert/createExpert")
		.send(expert)
		.set("Authorization", UserAuthorization)
		.end(function(err, res) {
			res.status.should.be.eql(200);
			res.body.should.have.property("msg");
			res.body.msg.should.be.equal("Expert was created successfully.");
			res.body.should.have.property("data");

			done();
		});
});
		it("Should block user", function(done) {
			var userr = {
			"username" : "hadeer mohamed"
			};
			chai
				.request(server)
				.post("/api/expert/BlockUser")
				.send(userr)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"user was blocked  successfully."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not block user ,username not string", function(done) {
			var userr = {
				"username" : 1234
			};
			chai
				.request(server)
				.post("/api/expert/BlockUser")
				.send(userr)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"User Name parameter must be a string."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not block user,user not found", function(done) {
			var userr = {
				"username" : "salah"	};
			chai
				.request(server)
				.post("/api/expert/BlockUser")
				.send(userr)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"User not found."
					);
					res.body.should.have.property("data");
					done();
				});
		});

		it("Should not block user,expert not found", function(done) {
					Expert.remove({}, err => {});
			var userr = {
				"username" : "hadeer mohamed"};
			chai
				.request(server)
				.post("/api/expert/BlockUser")
				.send(userr)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"expert not found."
					);
					res.body.should.have.property("data");
					done();
				});
		});

	});

	describe("Expert select topic", function(done) {

			it("Should create expert", function(done) {
				Expert.remove({}, err => {});

				var expert = {
					username: "zeiad"
				};
				chai
					.request(server)
					.post("/api/expert/createExpert")
					.send(expert)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(200);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal("Expert was created successfully.");
						res.body.should.have.property("data");

						done();
					});
			});

		it("Should create topic", function(done) {
			Topic.remove({}, err => {});

			var topic = {
				topicTitle:"title",
				topicDescription :"desc"
			};
			chai
				.request(server)
				.post("/api/user/createTopicfortesting")
				.send(topic)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Topic was created successfully.");
					res.body.should.have.property("data");
					res.body.data.should.have.property("_id");
					topic_id=res.body.data._id;

					done();
				});
		});
			it("Should add topic ", function(done) {
				var topic={
					"topic_id":topic_id

				};

				chai
					.request(server)
					.post("/api/user/ExpertSelectTopic")
					.send(topic)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(201);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"Done "
						);
						res.body.should.have.property("data");
						done();
					});
			});
					it("Should not add topic , id must be a valid object id", function(done) {
						var topic = {
						"topic_id" : "123"
						};
						chai
							.request(server)
							.post("/api/user/ExpertSelectTopic")
							.send(topic)
							.set("Authorization", UserAuthorization)
							.end(function(err, res) {
								res.status.should.be.eql(422);
								res.body.should.have.property("msg");
								res.body.msg.should.be.equal(
									" Topic id must be a valid objectId "
								);
								res.body.should.have.property("data");
								done();
							});
					});

					it("Should not add topic,topic already exists", function(done) {
						var topic={
							"topic_id":topic_id

						};
						chai
							.request(server)
							.post("/api/user/ExpertSelectTopic")
							.send(topic)
							.set("Authorization", UserAuthorization)
							.end(function(err, res) {
								res.status.should.be.eql(404);
								res.body.should.have.property("msg");
								res.body.msg.should.be.equal(
									"This topic is already added"
								);
								res.body.should.have.property("data");
								done();
							});
					});
					it("Should not add topic ,topic not found", function(done) {
						Topic.remove({}, err => {});
						var topic={
							"topic_id":topic_id

						};
						chai
							.request(server)
							.post("/api/user/ExpertSelectTopic")
							.send(topic)
							.set("Authorization", UserAuthorization)
							.end(function(err, res) {
								res.status.should.be.eql(404);
								res.body.should.have.property("msg");
								res.body.msg.should.be.equal(
									"topic not found."
								);
								res.body.should.have.property("data");
								done();
							});
					});
					it("Should not add topic ,expert not found", function(done) {
						Expert.remove({}, err => {});

						var topic={
							"topic_id":topic_id

						};
						chai
							.request(server)
							.post("/api/user/ExpertSelectTopic")
							.send(topic)
							.set("Authorization", UserAuthorization)
							.end(function(err, res) {
								res.status.should.be.eql(404);
								res.body.should.have.property("msg");
								res.body.msg.should.be.equal(
									"expert not found."
								);
								res.body.should.have.property("data");
								done();
							});
					});




				});














});
