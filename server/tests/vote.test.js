// Unit tests for voteQuestion in controller/vote.js


const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require('../models/questions');
const Answer = require('../models/answers');
const { User } = require('../models/users');

const mockSave = jest.fn();
    jest.mock('../models/users', () => ({
      User: jest.fn().mockImplementation(() => ({
          save: mockSave
      }))
  }));
const existingUser = {
  "_id": "existingUserId",
  "firstName": "existingUserFirstName",
  "lastName": "existingUserLastName",
  "username": "existingUsername",
  "password": "existingPassword",
  "role": "REGISTERED",
  "votedQuestions": [],
};

// Mocking the models
jest.mock("../models/questions");
jest.mock("../models/answers");
let server;

const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2'
};

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ans_by: 'answer2_user',
  
}

const getLoggedInSessionCookie = async (user) => {
  const loginResponse = await supertest(server)
    .post('/user/login')
    .send({ username: user.username, password: user.password });
  
  return loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid'));
};

describe('POST /voteQuestion/:qid', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it('403 forbidden', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };


    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(null);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)

    // Asserting the response
    expect(response.status).toBe(403);
  });

  it('should upvote a question', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockQuestion1 = {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2],
      views: 99,
      voteCount: 1  
    };

    const mockUser1 = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
    };

    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);


    // Provide mock question data
    Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockQuestion1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUser1);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion1);
  });

  it('upvoting an existing upvoted question leads to decrement votecount by 1', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockQuestion1 = {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2],
      views: 99,
      voteCount: 0  
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [],
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

    // Provide mock question data
    Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockQuestion1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion1);
  });

  it('should downvote a question', async () => {
      // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockQuestion1 = {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2],
      views: 99,
      voteCount: 1  
    };

    const mockUser1 = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
    };

    // Mock request body
    const mockReqBody = {
      status: 'downvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);


    // Provide mock question data
    Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockQuestion1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUser1);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion1);
  });


  
  it('Downvoting a downvoted question leads to increment by 1', async () => {
   // Mock request parameters
   const mockReqParams = {
    qid: '65e9b5a995b6c7045a30d823',
  };

  const mockQuestion1 = {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2],
    views: 99,
    voteCount: 1  
  };

  const mockExistingUserData = {
    "_id": "existingUserId",
    "firstName": "existingUserFirstName",
    "lastName": "existingUserLastName",
    "username": "existingUsername",
    "password": "existingPassword",
    "role": "REGISTERED",
    "votedQuestions": [
      {
        "qid": "65e9b5a995b6c7045a30d823",
        "voteStatus": "DOWNVOTE",
        "_id": "dummy"
      }
    ],
  };



  // Mock request body
  const mockReqBody = {
    status: 'downvote'
  };

  User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
  const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
  User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

  const mockUpdatedData = {
    "_id": "existingUserId",
    "firstName": "existingUserFirstName",
    "lastName": "existingUserLastName",
    "username": "existingUsername",
    "password": "existingPassword",
    "role": "REGISTERED",
    "votedQuestions": [],
  };


  mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

  // Provide mock question data
  Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockQuestion1);
  User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);


  // Making the request
  const response = await supertest(server)
    .post(`/vote/voteQuestion/${mockReqParams.qid}`)
    .send(mockReqBody)
    .set('Cookie', sessionCookie);

  // Asserting the response
  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockQuestion1);
  });

  it('should upvote a downvoted question', async () => {

    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockQuestion1 = {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2],
      views: 99,
      voteCount: 0  
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "DOWNVOTE",
          "_id": "dummy"
        }
      ],
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "NONE",
          "_id": "dummy"
        }
      ],
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

    // Provide mock question data
    Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockQuestion1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion1);
    
  });

  
  it('should downvote an upvoted question', async () => {
     
     
    
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockQuestion1 = {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2],
      views: 99,
      voteCount: 0  
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'downvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "NONE",
          "_id": "dummy"
        }
      ],
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

    // Provide mock question data
    Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockQuestion1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion1);
    
  });
 
  
  it('403 forbidden for answer', async () => {
    // Mock request parameters
    const mockReqParams = {
      aid: '65e9b5a995b6c7045a30d823',
    };


    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(null);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.aid}`)
      .send(mockReqBody)

    // Asserting the response
    expect(response.status).toBe(403);
  });

  it('should upvote an answer', async () => {
    // Mock request parameters
    const mockReqParams = {
      aid: '65e9b58910afe6e94fc6e6dc',
    };

    const mockUpdatedAnswer = {
      _id: '65e9b58910afe6e94fc6e6dc',
      text: 'Answer 1 Text',
      ans_by: 'answer1_user',
      voteCount: 1  
    };

    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    const mockUser = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
      ],
      "votedAnswers": [
      ],
    };
    
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    const sessionCookie = await getLoggedInSessionCookie(mockUser);
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    // Provide mock question data
    Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedAnswer);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.aid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedAnswer);
  });

  it('should downvote an answer', async () => {
   // Mock request parameters
   const mockReqParams = {
    aid: '65e9b58910afe6e94fc6e6dc',
  };

  const mockUpdatedAnswer = {
    _id: '65e9b58910afe6e94fc6e6dc',
    text: 'Answer 1 Text',
    ans_by: 'answer1_user',
    voteCount: -1  
  };

  // Mock request body
  const mockReqBody = {
    status: 'downvote'
  };

  const mockUser = {
    "_id": "existingUserId",
    "firstName": "existingUserFirstName",
    "lastName": "existingUserLastName",
    "username": "existingUsername",
    "password": "existingPassword",
    "role": "REGISTERED",
    "votedQuestions": [
    ],
    "votedAnswers": [
    ],
  };
  
  User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
  const sessionCookie = await getLoggedInSessionCookie(mockUser);
  User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
  // Provide mock question data
  Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedAnswer);


  // Making the request
  const response = await supertest(server)
    .post(`/vote/voteAnswer/${mockReqParams.aid}`)
    .send(mockReqBody)
    .set('Cookie', sessionCookie);

  // Asserting the response
  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockUpdatedAnswer);
  });
  it('should upvote an upvoted answer leading to decrement by 1', async () => {
    
    
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b58910afe6e94fc6e6dc',
    };

    const mockAnswer1 = {
      _id: '65e9b58910afe6e94fc6e6dc',
      text: 'Answer 1 Text',
      ans_by: 'answer1_user',
      voteCount: 0 
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "NONE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

    // Provide mock question data
    Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockAnswer1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer1);
  });
  it('should downvote a downvoted answer leading to increment by 1', async () => {
    
    
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b58910afe6e94fc6e6dc',
    };

    const mockAnswer1 = {
      _id: '65e9b58910afe6e94fc6e6dc',
      text: 'Answer 1 Text',
      ans_by: 'answer1_user',
      voteCount: 0 
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "DOWNVOTE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'downvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "NONE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

    // Provide mock question data
    Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockAnswer1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer1);
  });

  it('should upvote a downvoted answer', async () => {
    
    
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b58910afe6e94fc6e6dc',
    };

    const mockAnswer1 = {
      _id: '65e9b58910afe6e94fc6e6dc',
      text: 'Answer 1 Text',
      ans_by: 'answer1_user',
      voteCount: -1 
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "DOWNVOTE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'upvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "NONE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

    // Provide mock question data
    Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockAnswer1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer1);
  });

  it('should downvote an upvoted answer', async () => {
       
    
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b58910afe6e94fc6e6dc',
    };

    const mockAnswer1 = {
      _id: '65e9b58910afe6e94fc6e6dc',
      text: 'Answer 1 Text',
      ans_by: 'answer1_user',
      voteCount: 0 
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'downvote'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "NONE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);

    // Provide mock question data
    Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockAnswer1);
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedData);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer1);
 
  });

  it('should get 500 for question if req body is not sent', async () => {
    // Mock request parameters
    const mockReqParams = {
      aid: '65e9b5a995b6c7045a30d823',
    };

    // Mock request body
    const mockReqBody = {
      
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

    // Provide mock question data
    Question.findByIdAndUpdate = jest.fn().mockRejectedValue(null);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should get 500 for ans if req body is not sent', async () => {
    // Mock request parameters
    const mockReqParams = {
      aid: '65e9b58910afe6e94fc6e6dc',
    };



    // Mock request body
    const mockReqBody = {
      
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

    // Provide mock question data
    Answer.findByIdAndUpdate = jest.fn().mockRejectedValue(null);
  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.aid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('400 bad request for question', async () => {
     
     
    
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'cxcsc'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

    const mockUpdatedData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedQuestions": [
        {
          "qid": "65e9b5a995b6c7045a30d823",
          "voteStatus": "NONE",
          "_id": "dummy"
        }
      ],
    };

  
    mockExistingUserData.save = jest.fn().mockResolvedValueOnce(mockUpdatedData);


  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteQuestion/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(400);
    
  });
 
  

  it('400 bad request for answer', async () => {
        
    
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b58910afe6e94fc6e6dc',
    };

    const mockExistingUserData = {
      "_id": "existingUserId",
      "firstName": "existingUserFirstName",
      "lastName": "existingUserLastName",
      "username": "existingUsername",
      "password": "existingPassword",
      "role": "REGISTERED",
      "votedAnswers": [
        {
          "aid": "65e9b58910afe6e94fc6e6dc",
          "voteStatus": "UPVOTE",
          "_id": "dummy"
        }
      ],
      "votedQuestions" : []
    };

  

    // Mock request body
    const mockReqBody = {
      status: 'abcd'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);
    const sessionCookie = await getLoggedInSessionCookie(mockExistingUserData);
    User.findOne = jest.fn().mockResolvedValueOnce(mockExistingUserData);

  

    // Making the request
    const response = await supertest(server)
      .post(`/vote/voteAnswer/${mockReqParams.qid}`)
      .send(mockReqBody)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(400);
  });



});

