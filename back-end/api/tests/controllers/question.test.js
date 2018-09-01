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
	Question = mongoose.model("Question"),

chai.use(chaiHttp);
(UserAuthorization = null), (ListAuthorization = null), (questionId = null);
module.exports.questionTests = describe("Testing question Functions", function() {




    before(function(done) {
		mongoose.connect("mongodb://localhost:27017/nodejs-to-do-test", function() {
			//console.log("Connected to TestDb");
			done();
		});
    });

		describe("Display all reserved slots of all users", function(done) {

				it("Should get all questions with accepted status", function(done) {
			chai
				.request(server)
				.get("/api/question/getQuestionsByStatus/:status")
				.set("Authorization", UserAuthorization)
				.send("accepted")
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Questions retrieved successfully");
					res.body.should.have.property("data");
					done();
				});
		});

		});


    describe("Create question", function(done) {

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


        it("Should create a question", function(done) {
			var question = {
				questionSubject: "hii",
               			questionContent:"bye",
                		user: "zeiad",
                		expert: "be5"
            }



			chai
				.request(server)
				.post("/api/question/createQuestion")
				.send(question)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Question was created successfully.");
                    res.body.should.have.property("data");
                    questionId = res.body.data._id;
					done();
				});
        });
    });
    describe("add slots", function(done) {

        it("Should add slots", function(done) {
			var slots = {
				slots:  [ '2016-05-18T16:00:00.000Z','2016-05-18T16:00:00.000Z','2016-05-18T16:00:00.000Z' ]

			};
			chai
				.request(server)
				.patch("/api/question/addSlots/" + questionId)
				.send(slots)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Slots added successfully");
					res.body.should.have.property("data");
					res.body.data.should.have.property("slots");
                 			res.body.data.slots.should.be.eql( [ '2016-05-18T16:00:00.000Z','2016-05-18T16:00:00.000Z','2016-05-18T16:00:00.000Z' ]);
					done();
				});
		});

	});
	describe("Expert accepting a user's question", function(done) {

        it("Should accept the user question", function(done) {
			chai
				.request(server)
				.patch("/api/question/acceptQuestion/" + questionId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Question was accepted successfully.");
					res.body.should.have.property("data");
					res.body.data.status.should.be.eql("accepted");
					done();
				});
		});

	});
	describe("Expert rejecting a user's question", function(done) {

        it("Should reject the user question", function(done) {

			chai
				.request(server)
				.patch("/api/question/rejectQuestion/" + questionId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Question was rejected successfully.");
					res.body.should.have.property("data");
					res.body.data.status.should.be.eql("rejected");
					done();
				});
		});

	});

});
