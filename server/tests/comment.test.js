// Unit tests for addComment in controller/comment.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");
const Comment = require("../models/comments");
const {User} = require('../models/users');


//Mock the Comment model
jest.mock("../models/comments");

let server;

const existingUser = {
  "_id": "existingUserId",
  "firstName": "existingUserFirstName",
  "lastName": "existingUserLastName",
  "username": "existingUsername",
  "password": "existingPassword",
  "role": "REGISTERED",
  "voted": [],
};

const getLoggedInSessionCookie = async (user) => {
  const loginResponse = await supertest(server)
    .post('/user/login')
    .send({ username: user.username, password: user.password });
  
  return loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid'));
};


describe("comment controller", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  // add comment on question 
  test("should add a new comment to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      comment: {
        text: "This is a test comment"
      }
    };

    const mockComment = {
      _id: "dummyCommentId",
      text: "This is a test comment"
    }

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);

    // Mock the create method of the Comment model
    Comment.create.mockResolvedValueOnce(mockComment);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      comments: ["dummyCommentId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/comment/addCommentOnQuestion")
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComment);

    // Verifying that Comment.create method was called with the correct arguments
    expect(Comment.create).toHaveBeenCalledWith({
      comment_by: {"user_id": "existingUserId","user_name": "existingUsername"},
      text: "This is a test comment"
    });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { comments: { $each: ["dummyCommentId"], $position: 0 } } },
      { new: true }
    );
  });

  test("forbidden to add comment to the question by guest", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      comment: {
        text: "This is a test comment"
      }
    };


    // Making the request
    const response = await supertest(server)
      .post("/comment/addCommentOnQuestion")
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(403);
  });

  // add comment on answer 
  test("should add a new comment to the answer", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
      comment: {
        text: "This is a test comment"
      }
    };

    const mockComment = {
      _id: "dummyCommentId",
      text: "This is a test comment"
    }

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);

    // Mock the create method of the Comment model
    Comment.create.mockResolvedValueOnce(mockComment);

    // Mocking the Answer.findOneAndUpdate method
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyAnswerId",
      comments: ["dummyCommentId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/comment/addCommentOnAnswer")
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComment);

    // Verifying that Comment.create method was called with the correct arguments
    expect(Comment.create).toHaveBeenCalledWith({
      comment_by: {"user_id": "existingUserId","user_name": "existingUsername"},
      text: "This is a test comment"
    });

    // Verifying that Answer.findOneAndUpdate method was called with the correct arguments
    expect(Answer.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyAnswerId" },
      { $push: { comments: { $each: ["dummyCommentId"], $position: 0 } } },
      { new: true }
    );
  });

  test("forbidden to add comment to the answer by guest", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
      comment: {
        text: "This is a test comment"
      }
    };


    // Making the request
    const response = await supertest(server)
      .post("/comment/addCommentOnAnswer")
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(403);
   
  });
   // 500 error status as add comment failed on question
   test("status 500 as add comment failed", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      comment: {
        text: "This is a test comment"
      }
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);

    // Mock the create method of the Comment model
    Comment.create.mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));

    // Making the request
    const response = await supertest(server)
      .post("/comment/addCommentOnQuestion")
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(500);

  });

  // 500 error status as question update failed
  test("status 500 as question update failed", async () => {
    // Mocking the request body
    const mockReqBody = {
        qid: "dummyQuestionId",
        comment: {
          text: "This is a test comment"
        }
      };
  
      const mockComment = {
        _id: "dummyCommentId",
        text: "This is a test comment"
      }

      User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
      const sessionCookie = await getLoggedInSessionCookie(existingUser);
      // Mock the create method of the Comment model
      Comment.create.mockResolvedValueOnce(mockComment);
  
      // Mocking the Question.findOneAndUpdate method
      Question.findOneAndUpdate = jest.fn().mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));
  
      // Making the request
      const response = await supertest(server)
        .post("/comment/addCommentOnQuestion")
        .send(mockReqBody)
        .set('Cookie', sessionCookie);
  
      // Asserting the response
      expect(response.status).toBe(500);
  
      // Verifying that Comment.create method was called with the correct arguments
      expect(Comment.create).toHaveBeenCalledWith({
        comment_by: {"user_id": "existingUserId","user_name": "existingUsername"},
        text: "This is a test comment"
      });
  });

  // 500 error status as add comment failed on answer
  test("status 500 as add comment failed", async () => {
    // Mocking the request body
    const mockReqBody = {
      aid: "dummyAnswerId",
      comment: {
        text: "This is a test comment"
      }
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);

    // Mock the create method of the Comment model
    Comment.create.mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));

    // Making the request
    const response = await supertest(server)
      .post("/comment/addCommentOnAnswer")
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(500);

  });

  // 500 error status as answer update failed
  test("status 500 as answer update failed", async () => {
    // Mocking the request body
    const mockReqBody = {
        aid: "dummyAnswerId",
        comment: {
          text: "This is a test comment"
        }
      };
  
      const mockComment = {
        _id: "dummyCommentId",
        text: "This is a test comment"
      }

      User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
      const sessionCookie = await getLoggedInSessionCookie(existingUser);

      // Mock the create method of the Comment model
      Comment.create.mockResolvedValueOnce(mockComment);
  
      // Mocking the Answer.findOneAndUpdate method
      Answer.findOneAndUpdate = jest.fn().mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));
  
      // Making the request
      const response = await supertest(server)
        .post("/comment/addCommentOnAnswer")
        .send(mockReqBody)
        .set('Cookie', sessionCookie);
  
      // Asserting the response
      expect(response.status).toBe(500);
  
      // Verifying that Comment.create method was called with the correct arguments
      expect(Comment.create).toHaveBeenCalledWith({
        comment_by: {"user_id": "existingUserId","user_name": "existingUsername"},
        text: "This is a test comment"
      });
  });
});
