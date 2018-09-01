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

	User = mongoose.model("User"),
	Topic = mongoose.model("Topic"),
  Expert = mongoose.model("Expert"),

	should = require("should"),
	chai = require("chai"),

	chaiHttp = require("chai-http"),
	server = require(base + "/app");

  chai.use(chaiHttp),
  (UserAuthorization = null), (ListAuthorization = null), (ExpertId = null);


module.exports.topicTests = describe("Testing Topic Backend functionality", function() {
	before(function(done) {
		mongoose.connect("mongodb://localhost:27017/nodejs-to-do-test", function() {
			done();
		});
	});
	describe("Create a topic", function(done) {
    it("Should not create a new topic if the user is not authenticated", function(done) {
      Topic.remove({}, err => {});
      var topic1 = {
        topicTitle : "Tech",
        topicDescription: "Testing all about Technology"
      };
      chai
        .request(server)
        .post("/api/topic/createTopic")
        .send(topic1)
        .end(function(err, res) {
          res.status.should.be.eql(401);
          res.body.should.have.property("msg");
          res.body.msg.should.be.equal("You have to login first before you can access your lists.");
          res.body.should.have.property("data");
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
					ExpertId = res.body.data._id;
					done();
				});
		});

    it("Should not create a new topic if one of the fields is missing.", function(done) {
      Topic.remove({}, err => {});
      var topic1 = {
        topicDescription: "Testing all about Technology"
      };
			chai
				.request(server)
				.post("/api/topic/createTopic")
				.set("Authorization", UserAuthorization)
        .send(topic1)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("topic Title(String) and topic description(String) are required fields.");
					res.body.should.have.property("data");
					done();
				});
		});

		it("Should create a new topic and store it in the database", function(done) {
      Topic.remove({}, err => {});
      var topic1 = {
        topicTitle : "Tech",
        topicDescription: "Testing all about Technology"
      };
			chai
				.request(server)
				.post("/api/topic/createTopic")
				.set("Authorization", UserAuthorization)
        .send(topic1)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Topic was created successfully.");
					res.body.should.have.property("data");
					done();
				});
		});

    it("Should not create a new topic if a topic with the same title exists.", function(done) {
      var topic1 = {
        topicTitle : "Tech",
        topicDescription: "Testing all about Technology"
      };
      chai
        .request(server)
        .post("/api/topic/createTopic")
        .set("Authorization", UserAuthorization)
        .send(topic1)
        .end(function(err, res) {
          res.status.should.be.eql(203);
          res.body.should.have.property("msg");
          res.body.msg.should.be.equal("A topic with this title already exists.");
          res.body.should.have.property("data");
          done();
        });
    });

    it("Should not create a new topic if the user is not an expert", function(done) {
      Expert.remove({}, err => {});
      var topic1 = {
        topicTitle : "Tech2",
        topicDescription: "Testing all about Technology"
      };
      chai
        .request(server)
        .post("/api/topic/createTopic")
        .send(topic1)
        .set("Authorization", UserAuthorization)
        .end(function(err, res) {
          res.status.should.be.eql(401);
          res.body.should.have.property("msg");
          res.body.msg.should.be.equal("You do not have access to this action.");
          res.body.should.have.property("data");
          done();
        });
    });

	});


  describe("Get topic", function(done) {
    it("Should not get topic if the user is not authenticated", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+topic._id)
          .end(function(err, res) {
            res.status.should.be.eql(401);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("You have to login first before you can access your lists.");
            res.body.should.have.property("data");
            done();
          });
      });
    });

    it("Should not get topic if the id is not in valid form", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+topic._id+"15421knlklnl")
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(422);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("topicId parameter must be a valid ObjectId.");
            done();
          });
      });
    });

    it("Should not get topic if there is no such a topic", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+"5ad64ecba951477eb78273b4")
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(404);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Topic not found.");
            done();
          });
      });
    });

    it("Should get topic", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+topic._id)
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(200);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Topic retrieved successfully.");
            res.body.should.have.property("data");
            done();
          });
      });
    });

    it("Should all topics", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopics")
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(200);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Topics retrieved successfully.");
            res.body.should.have.property("data");
            done();
          });
      });
    });
  });

  describe("Get topic", function(done) {
    it("Should not get topic if the user is not authenticated", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+topic._id)
          .end(function(err, res) {
            res.status.should.be.eql(401);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("You have to login first before you can access your lists.");
            res.body.should.have.property("data");
            done();
          });
      });
    });

    it("Should not get topic if the id is not in valid form", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+topic._id+"15421knlklnl")
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(422);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("topicId parameter must be a valid ObjectId.");
            done();
          });
      });
    });

    it("Should not get topic if there is no such a topic", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+"5ad64ecba951477eb78273b4")
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(404);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Topic not found.");
            done();
          });
      });
    });

    it("Should get topic", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopic/"+topic._id)
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(200);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Topic retrieved successfully.");
            res.body.should.have.property("data");
            done();
          });
      });
    });

    it("Should all topics", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getTopics")
          .set("Authorization", UserAuthorization)
          .end(function(err, res) {
            res.status.should.be.eql(200);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Topics retrieved successfully.");
            res.body.should.have.property("data");
            done();
          });
      });
    });
  });



  describe("Get all experts of s specific topic", function(done) {
    it("Should not get expert of a topic if the user is not authenticated", function(done) {
      var topicTitle = {
        title : "tech"
      };
      chai
          .request(server)
          .get("/api/topic/getExpertsByTopic/"+topicTitle)
          .end(function(err, res) {
            res.status.should.be.eql(401);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("You have to login first before you can access your lists.");
            res.body.should.have.property("data");
            done();
          });
      
    });

    it("Should get experts of a topic", function(done) {
      Topic.findOne({topicTitle : "tech"}).exec(function(err, topic) {
        chai
          .request(server)
          .get("/api/topic/getExpertsByTopic/"+topic._id)
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
  });
});
