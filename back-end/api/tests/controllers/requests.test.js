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

(reqId = null);

describe("Testing application Functions", function() {
	describe("Get requests", function(done) {
		it("Should get requests", function(done) {
			chai
				.request(server)
				.get("/api/application/getApplications")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Requests retrieved successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
	});
	describe("Create requests", function(done) {
		it("Should create requests", function(done) {
			var req = {
				Reason: "Math"
			};
			chai
				.request(server)
				.post("/api/application/applyForExpert")
				.send(req)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Request was created successfully.");
					res.body.should.have.property("data");
					res.body.data.Reason.should.be.eql("Math");
					reqId = res.body.data._id;
					done();
				});
		});
		it("Should not create requests Missing fields", function(done) {
			var hoba = {
			};
			chai
				.request(server)
				.post("/api/application/applyForExpert")
				.send(hoba)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("required fields missing.");
					res.body.should.have.property("data");
					done();
				});
		});
	});
	describe("Delete requests", function(done) {
		it("Should delete requests", function(done) {
			chai
				.request(server)
				.delete("/api/application/deleteApplication/" + reqId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Request was deleted successfully.");
					res.body.should.have.property("data");
					done();
				});
        });
        it("Should not delete requests", function(done) {
			chai
				.request(server)
				.delete("/api/application/deleteApplication/" + reqId +'asd')
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("RequestId parameter must be a valid ObjectId.");
					res.body.should.have.property("data");
					done();
				});
		});
	});
});