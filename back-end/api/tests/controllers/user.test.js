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

(UserAuthorization = null), (notesId = null), (expId = null), (userId = null);

module.exports.userTests = describe("Testing user functionalities", function() {
	before(function(done) {
		mongoose.connect("mongodb://localhost:27017/nodejs-to-do-test", function() {
			//console.log("Connected to TestDb");
			done();
		});
	});

	describe("Get a favorite expert" , function(done){
		it("Should not be able to retrieve a favorite expert with a username which is not string" , function(done){
			var keyword = {
				keyword: "hader"
			};
			chai
				.request(server)
				.get("/api/user/getfavExpertsByUsername/" + keyword)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("username must be a String");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not be able to find the user" , function(done){
			var keyword = {
				keyword: "hader"
			};
			chai
				.request(server)
				.get("/api/user/getfavExpertsByUsername/" + keyword)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("User not found.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should get a favorite expert by their username", function(done){
			var keyword = {
				keyword: "hadeer"
			};
			chai
			.request(server)
			.get("/api/user/getfavExpertsByUsername/" + keyword)
			.set("Authorization", UserAuthorization)
			.end(function(err, res) {
				res.status.should.be.eql(200);
				res.body.should.have.property("msg");
				res.body.msg.should.be.equal("Expert was retrieved successfully.");
				res.body.should.have.property("data");
				done();
			});
		});


	});
    describe("Get a user", function(done) {
		it("Should get a user by their username", function(done) {
			var username = {
				username: "zeiad"
			};
			chai
				.request(server)
				.get("/api/user/getUser")
				.send(username)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("User retrieved successfully.");
                    res.body.should.have.property("data");
					done();
				});
		});
		it("Should get all user of a specific type", function(done) {
			var type = {
				type: "expert"
			};
			chai
				.request(server)
				.get("/api/user/getUserByType/" + type)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("User Info retrieved successfully.");
                    res.body.should.have.property("data");
					done();
				});
		});
		it("Should not be able to retrieve a user with an incorrect username", function(done) {
			var username = {
				username: "ziad"
			};
			chai
				.request(server)
				.get("/api/user/getUser")
				.send(username)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(404);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("User not found.");
					res.body.should.have.property("data");
					done();
				});
        });
		it("Should update privacy", function(done) {
			var user = {
				privacy : "private"
			};
			chai
				.request(server)
				.patch("/api/user/updatePrivacy")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Privacy was updated successfully.");
					res.body.data.privacy.should.be.eql("private");
					res.body.should.have.property("data");
					done();
				});
		});
        it("Should not allow anyone to view a user's profile if it was set to private", function(done) {
            var username = {
                username: "zeiad"
            }
            chai
                .request(server)
				.get("/api/user/getUser")
				.send(username)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("User profile is private.");
					res.body.should.have.property("data");
					done();
				});
        })
    });
    describe("Adding any user-related information", function(done) {
        it("Should add experience for a user", function(done) {
			var user = {
                job: "Technician",
				date: "2",
				details: "IT department",
				companyName: "Intel"
			};
			chai
				.request(server)
				.post("/api/user/createExperience")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(201);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Experience was created successfully.");
                    res.body.should.have.property("data");
                    expId = res.body.data._id;
					done();
				});
        });
        it("Should not add experience for a user with a missing field", function(done) {
			var user = {
				job: "IT",
				date: "3",
				details: "Head of department"
			};
			chai
				.request(server)
				.post("/api/user/createExperience")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("job(String), date(String), details(String) and companyName(String) are required fields.");
					res.body.should.have.property("data");
					done();
				});
        });
        it("Should be able to create notes", function(done) {
			var user = {
				note: "Quiz next week",
				noteTitle: "Reminders"
			};
			chai
				.request(server)
				.post("/api/user/createNotes")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Note was created successfully.");
					res.body.should.have.property("data");
					notesId = res.body.data._id;
					done();
				});
        });

    });
    describe("Updating any user-related information", function(done) {
        it("Should update username", function(done) {
			var user = {
				username: "Dina"
			};
			chai
				.request(server)
				.patch("/api/user/updateUser")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("User was updated successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should update user's password", function(done) {
			var user = {
				email: "dummy@gmail.com",
				password: "123456789",
				newPassword: "dinahisham",
				confirmPassword: "dinahisham",
			};
			chai
				.request(server)
				.patch("/api/user/updateUserPassword")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("User was updated successfully.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not update user's password if the new password and confirm do not match", function(done) {
			var user = {
				email: "dummy@gmail.com",
				password: "123456789",
				newPassword: "dinahsham23",
				confirmPassword: "dinahisham",
			};
			chai
				.request(server)
				.patch("/api/user/updateUserPassword")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(203);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("newPassword and confirmPassword does not match.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not update user's password if they entered an incorrect password", function(done) {
			var user = {
				email: "dummy@gmail.com",
				password: "123456",
				newPassword: "dinahisham",
				confirmPassword: "dinahisham",
			};
			chai
				.request(server)
				.patch("/api/user/updateUserPassword")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(203);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Password is incorrect.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should not update user's password if they entered a password less than 8 characters", function(done) {
			var user = {
				email: "dummy@gmail.com",
				password: "123456789",
				newPassword: "dina",
				confirmPassword: "dina",
			};
			chai
				.request(server)
				.patch("/api/user/updateUserPassword")
				.send(user)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(203);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Password must be of length 8 characters or more.");
					res.body.should.have.property("data");
					done();
				});
        });
        it("Should update experience", function(done) {
            var exp = {
                job: "Teacher",
				Date: "1",
				Details: "In charge",
				CompanyName: "Dell"
            };
			chai
				.request(server)
                .patch("/api/user/updateExperience/" + expId)
                .send(exp)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Experience was updated successfully.");
					res.body.should.have.property("data");
					done();
				});
        });
        it("Should not update experience with missing fields", function(done) {
            var exp = {
                job: "Assistant"
            };
			chai
				.request(server)
                .patch("/api/user/updateExperience/" + expId)
                .send(exp)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Job(String), Details(String), CompanyName(String), Date(String) are required");
					res.body.should.have.property("data");
					done();
				});
        });
        it("Should not update experience with incorrect experience ID", function(done) {
            var exp = {
                job: "Assistant",
                yearsOfExp: 3
            };
			chai
				.request(server)
                .patch("/api/user/updateExperience/" + expId + "test")
                .send(exp)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(422);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("experienceId parameters must be valid ObjectIds.");
					res.body.should.have.property("data");
					done();
				});
		});
		it("Should calculate user's rating", function(done) {
            var rate = {
                username: "dina",
                rating: 3
            };
			chai
				.request(server)
                .patch("/api/user/rateUser")
                .send(rate)
				.set("Authorization", UserAuthorization)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Successfully Updated Rating.");
					res.body.should.have.property("data");
					done();
				});
		});
		describe("sending a request(question) to an expert",function(done){
				it("Should send the expert a request", function(done) {
			var user = {
				questionSubject: "hello",
				questionContent: "what is marketing?",
				expert: "Merna"
			};
			chai
				.request(server)
				.post("/api/user/requestExpert")
				.set("Authorization", UserAuthorization)
				.send(user)
				.end(function(err, res) {
					res.status.should.be.eql(200);
					res.body.should.have.property("msg");
					res.body.msg.should.be.equal("Question was created successfully.");
					res.body.should.have.property("data");
					done();
				});
			});
		});
		describe("Deleting use related information", function(done) {
		// 	it("Should delete current user", function(done) {
		// 	chai
		// 		.request(server)
		// 		.delete("/api/user/deleteUser/" + userId)
		// 		.set("Authorization", UserAuthorization)
		// 		.end(function(err, res) {
		// 			res.status.should.be.eql(200);
		// 			res.body.should.have.property("msg");
		// 			res.body.msg.should.be.equal("Schedule was deleted successfully.");
		// 			res.body.should.have.property("data");
		// 			done();
		// 		});
		// });
	});

    });
		describe("Add Favorite Expert", function(done) {

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

			it("Should add favorite expert", function(done) {
				var expert = {
					"name" : "zeiad"
				};
				chai
					.request(server)
					.post("/api/user/AddFavoriteExpert")
					.send(expert)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(201);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"Expert was added successfully."
						);
						res.body.should.have.property("data");
						done();
					});
			});
			it("Should not add favorite expert ,favexpert alraedy exists", function(done) {
				var expert = {
					"name" : "zeiad"
				};
				chai
					.request(server)
					.post("/api/user/AddFavoriteExpert")
					.send(expert)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(200);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"Expert was already added successfully."
						);
						res.body.should.have.property("data");
						done();
					});
			});
			it("Should not add favexpert, expert name must be string", function(done) {
				var expert = {
							 "name" : 1223	};
				chai
					.request(server)
					.post("/api/user/AddFavoriteExpert")
					.send(expert)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(422);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							" expert name must be a string "
						);
						res.body.should.have.property("data");
						done();
					});
			});
			it("Should not add favexpert, expert not found", function(done) {
				var expert = {
							 "name" : "reem"	};
				chai
					.request(server)
					.post("/api/user/AddFavoriteExpert")
					.send(expert)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(404);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"Expert not found , Can't be add"
						);
						res.body.should.have.property("data");
						done();
					});
			});

			it("Should not add favexpert, user not found", function(done) {
						User.remove({}, err => {});
				var expert = {
					"name" : "zeiad"};
				chai
					.request(server)
					.post("/api/user/AddFavoriteExpert")
					.send(expert)
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
		describe("remove Favorite Expert", function(done) {
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

			it("Should create expert", function(done) {
				Expert.remove({}, err => {});
				var expert = {
					username: "reem"
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
			it("Should add favorite expert", function(done) {
				var expert = {
					"name" : "reem"
				};
				chai
					.request(server)
					.post("/api/user/AddFavoriteExpert")
					.send(expert)
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(201);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"Expert was added successfully."
						);
						res.body.should.have.property("data");
						done();
					});
			});
			it("Should remove favorite expert", function(done) {

				chai
					.request(server)
					.delete("/api/user/deleteFavoriteExpert/reem")
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(200);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"expert was deleted successfully."
						);
						res.body.should.have.property("data");
						done();
					});
			});
			it("Should not remove favexpert ,favexpert does not exist", function(done) {

				chai
					.request(server)
					.delete("/api/user/deleteFavoriteExpert/hadeer")
					.set("Authorization", UserAuthorization)
					.end(function(err, res) {
						res.status.should.be.eql(200);
						res.body.should.have.property("msg");
						res.body.msg.should.be.equal(
							"expert is not a favourite"
						);
						res.body.should.have.property("data");
						done();
					});
			});
			it("Should not remove favexpert, user not found", function(done) {
				User.remove({}, err => {});

				chai
					.request(server)
					.delete("/api/user/deleteFavoriteExpert/reem")
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
		

});
