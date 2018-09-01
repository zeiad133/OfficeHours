process.env.NODE_ENV = "test";

let base = undefined;
if (!process.env.PWD) {
	base = process.cwd();
} else {
	base = process.env.PWD;
}

const mongoose = require("mongoose"),
	userModel = require(base + "/api/models/user.model"),
	topicModel = require(base + "/api/models/topic.model"),
  adminModel = require(base + "/api/models/admin.model"),

	User = mongoose.model("User"),
	Topic = mongoose.model("Topic"),
  Expert = mongoose.model("Expert"),
  Admin = mongoose.model("Admin"),
  Application = mongoose.model("Application"),
	should = require("should"),
	chai = require("chai"),

	chaiHttp = require("chai-http"),
	server = require(base + "/app");

  chai.use(chaiHttp),
  (UserAuthorization = null), (ListAuthorization = null), (ExpertId = null), (reqId = null);

  module.exports.adminTests = describe("Testing Admin Backend functionality", function() {
  	before(function(done) {
  		mongoose.connect("mongodb://localhost:27017/nodejs-to-do-test", function() {
  			done();
  		});
  	});
  	describe("Add an Admin", function(done) {
      it("Should not add a new admin if the user is not authenticated", function(done) {
        var testadmin = {
          username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/addAdmin")
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(401);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("You have to login first before you can access your lists.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should not add a new admin if the user sending the request is not an admin", function(done) {
        Admin.remove({}, err => {})
        var testadmin = {
          username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/addAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(401);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Admin access is required for this action.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should not add a new admin if the user to be assigned as an admin is not in the users table", function(done) {
        Admin.create({username: "zeiad"}, err => {})
        var testadmin = {
          username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/addAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(404);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("User not found.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should not add a new admin if the request is not a valid done", function(done) {
        var testadmin = {
        };
        chai
          .request(server)
          .post("/api/admin/addAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(422);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("username(String) is a required field.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should add a new admin to the system", function(done) {
        User.create({username:"admoon", type:"User"}, err => {})
        var testadmin = {
            username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/addAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(201);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Admin has been added successfully.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should not add a new admin to the system if he is already an admin", function(done) {
        var testadmin = {
            username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/addAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(409);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("He/She is already an admin.");
            res.body.should.have.property("data");
            done();
          });
      });

    });


    describe("Remove an Admin", function(done) {
      it("Should not remove an admin if the user is not authenticated", function(done) {
        var testadmin = {
          username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/removeAdmin")
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(401);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("You have to login first before you can access your lists.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should not remove an admin if the user sending the request is not an admin", function(done) {
        Admin.remove({}, err => {})
        var testadmin = {
          username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/removeAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(401);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Admin access is required for this action.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should not remove an admin if the admin to be deleted as an admin is not in the admins table", function(done) {
        Admin.create({username: "zeiad"}, err => {})
        var testadmin = {
          username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/removeAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(404);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Admin not found.");
            res.body.should.have.property("data");
            done();
          });
      });


      it("Should not remove an admin if the request is not a valid done", function(done) {
        var testadmin = {
        };
        chai
          .request(server)
          .post("/api/admin/addAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(422);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("username(String) is a required field.");
            res.body.should.have.property("data");
            done();
          });
      });

      it("Should remove an admin from the system", function(done) {
        Admin.create({username: "admoon"})
        var testadmin = {
            username : "admoon",
        };
        chai
          .request(server)
          .post("/api/admin/removeAdmin")
          .set("Authorization", UserAuthorization)
          .send(testadmin)
          .end(function(err, res) {
            res.status.should.be.eql(200);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Admin has been deleted successfully.");
            res.body.should.have.property("data");
            done();
          });
      });
    });

    // describe("User should create feedback", function(done) {
    //   it("Should create feedback", function(done) {
    //     var feedback = {
    //       reviewee : "test", 
    //       room : "Math", 
    //       feedback : "feedback"
    //     };
    //     chai
    //       .request(server)
    //       .post("/api/admin/createFeedback")
    //       .set("Authorization", UserAuthorization)
    //       .send(feedback)
    //       .end(function(err, res) {
    //         res.status.should.be.eql(201);
    //         res.body.should.have.property("msg");
    //         res.body.msg.should.be.equal("Feedback created successfully.");
    //         res.body.should.have.property("data");
    //         done();
    //       });
    //   });
    // });

    describe("Accept an Expert", function(done) {
      it("Should apply to be an expert", function(done) {
        var test = {
          reason : "help others"
        }
        chai
          .request(server)
          .post("/api/application/applyForExpert")
          .set("Authorization", UserAuthorization)
          .send(test)
          .end(function(err, res) {
            res.status.should.be.eql(201);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Request was created successfully.");
            res.body.should.have.property("data");
            reqId = res.body.data._id;
            done();
          });
      });

      // it("Should add a new expert", function(done) {
      //   chai
      //     .request(server)
      //     .post("/api/admin/acceptExpert/" + reqId)
      //     .set("Authorization", UserAuthorization)
      //     .end(function(err, res) {
      //       res.status.should.be.eql(201);
      //       res.body.should.have.property("msg");
      //       res.body.msg.should.be.equal("Expert was created successfully.");
      //       res.body.should.have.property("data");
      //       done();
      //     });
      // });
    });
});
