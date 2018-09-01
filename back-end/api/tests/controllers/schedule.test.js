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

(UserAuthorization = null), (ListAuthorization = null), (scheduleId = null);

module.exports.scheduleTests = describe("Testing Schedule Functions", function() {
	before(function(done) {
		mongoose.connect("mongodb://localhost:27017/nodejs-to-do-test", function() {
			//console.log("Connected to TestDb");
			done();
		});
    });
    describe("Create schedule", function(done) {
		it("Should create a schedule", function(done) {
			var schedule = {
				date: "4/14/2018",
                time:"2", 
                sessionType: "public"
			};
			chai
				.request(server)
				.post("/api/schedule/createSchedule")
				.send(schedule)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Schedule was created successfully.");
                    res.body.should.have.property("data");
                    scheduleId = res.body.data._id;
					done();
				});
        });
        
		it("Should not add a schedule with the same date and time ", function(done) {
			var schedule = {
				date: "4/14/2018",
                time:"2", 
                sessionType: "public"
			};
			chai
				.request(server)
				.post("/api/schedule/createSchedule")
				.send(schedule)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("A schedule with the same date and time already exists.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not create a schedule with a missing field", function(done) {
			var schedule = {
				time: "3"
			};
			chai
				.request(server)
				.post("/api/schedule/createSchedule")
				.send(schedule)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"date(String), time(String) and sessionType(String) are required fields"
					);
					res.body.should.have.property("data");
					done();
				});
		});
    });
	describe("Get all schedules for a user", function(done) {
		
		it("Should get all schedules", function(done) {
			chai
				.request(server)
				.get("/api/schedule/getSchedules")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Schedules retrieved successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
	});
	describe("Get a single schedule for a user", function(done) {
		it("Should get a schedule", function(done) {
			chai
				.request(server)
				.get("/api/schedule/getSchedule/" + scheduleId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Schedule was retrieved successfully.");
					res.body.should.have.property("data");
					done();
				});
        });
        it("Should not get a schedule with an invalid ID", function(done) {
			chai
				.request(server)
				.get("/api/schedule/getSchedule/" + scheduleId + "test")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"scheduleId parameter must be a valid ObjectId."
					);
					res.body.should.have.property("data");
					done();
				});
		});
	});
    
	describe("update schedule", function(done) {
		it("Should update schedule", function(done) {
			var schedule = {
				date: "4/14/2018",
                time:"4", 
                sessionType: "private"
			};
			chai
				.request(server)
				.patch("/api/schedule/updateSchedule/" + scheduleId)
				.send(schedule)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Schedule was updated successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should Not update schedule when there is a missing fields", function(done) {
			var schedule = {
                sessionType : "private"
            };
			chai
				.request(server)
				.patch("/api/schedule/updateSchedule/" + scheduleId)
				.send(schedule)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("date(String) and time(String) are required fields, sessionType(String) is optional but has to be a valid string.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not update schedule with an invalid ID", function(done) {
			var schedule = {};
			chai
				.request(server)
				.patch("/api/schedule/updateSchedule/" + scheduleId + "test")
				.send(schedule)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"scheduleId parameter must be a valid ObjectId."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not update into a schedule that already exists", function(done) {
			var schedule = {
				date: "4/14/2018",
                time:"4", 
                sessionType: "private"
			};
			chai
				.request(server)
				.patch("/api/schedule/updateSchedule/" + scheduleId )
				.send(schedule)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"A schedule with the same date and time already exists."
					);
					res.body.should.have.property("data");
					done();
				});
		});
    });
    describe("Delete all schedule", function(done) {
		it("Should delete all schedules", function(done) {
			chai
				.request(server)
				.delete("/api/schedule/deleteSchedules")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Schedule was deleted successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
	});
	describe("Delete a schedule", function(done) {
		it("Should delete one schedule", function(done) {
			chai
				.request(server)
				.delete("/api/schedule/deleteSchedule/" + scheduleId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Schedule was deleted successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not delete schedule", function(done) {
			chai
				.request(server)
				.delete("/api/schedule/deleteSchedule/" + scheduleId)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Schedule not found.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not delete schedule with an invalid ID", function(done) {
			chai
				.request(server)
				.delete("/api/schedule/deleteSchedule/" + scheduleId + "test")
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal(
						"scheduleId parameter must be a valid ObjectId."
					);
					res.body.should.have.property("data");
					done();
				});
		});
		
    });
  
});

