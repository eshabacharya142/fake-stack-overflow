// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");
const {User} = require('../models/users');

// Mock the Answer model
jest.mock("../models/answers");

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

describe("POST /addAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it("should add a new answer to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };

    const mockAnswer = {
      _id: "dummyAnswerId",
      text: "This is a test answer"
    }

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.create).toHaveBeenCalledWith({
      ans_by: {"user_id": "existingUserId","user_name": "existingUsername"},
      text: "This is a test answer"
    });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answers: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });

  it("forbidden for guest user", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(403);
  });


  // 500 error status as add answer failed on question
  it("500 error status as add answer failed", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    // Mock the create method of the Answer model
    Answer.create.mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
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
  
      const mockAnswer = {
        _id: "dummyAnswerId",
        text: "This is a test answer"
      }

      User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
      const sessionCookie = await getLoggedInSessionCookie(existingUser);
      // Mock the create method of the Answer model
      Answer.create.mockResolvedValueOnce(mockAnswer);
  
      // Mocking the Question.findOneAndUpdate method
      Question.findOneAndUpdate = jest.fn().mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));
  
      // Making the request
      const response = await supertest(server)
        .post("/answer/addAnswer")
        .send(mockReqBody)
        .set('Cookie', sessionCookie);
  
      // Asserting the response
      expect(response.status).toBe(500);
  
      // Verifying that Answer.create method was called with the correct arguments
      expect(Answer.create).toHaveBeenCalledWith({
        ans_by: {"user_id": "existingUserId","user_name": "existingUsername"},
        text: "This is a test answer"
      });
  });
  
});
