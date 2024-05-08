// unit tests for functions in controller/question.js


const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Question = require('../models/questions');
const {User} = require('../models/users');
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

// Mocking the models
jest.mock("../models/questions");
jest.mock('../utils/question', () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));

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

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1'
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2'
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ans_by: 'answer1_user',
  
}

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ans_by: 'answer2_user',
  
}

const mockQuestions = [
  {
      _id: '65e9b58910afe6e94fc6e6dc',
      title: 'Question 1 Title',
      text: 'Question 1 Text',
      tags: [tag1],
      answers: [ans1],
      views: 21
  },
  {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2],
      views: 99
  }
]

const getLoggedInSessionCookie = async (user) => {
  const loginResponse = await supertest(server)
    .post('/user/login')
    .send({ username: user.username, password: user.password });
  
  return loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid'));
};

describe('GET /getQuestion', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  //get questions by filter
  it('should return questions by filter', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'someOrder',
      search: 'someSearch',
    };
   
    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);
    // Making the request
    const response = await supertest(server)
      .get('/question/getQuestion')
      .query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });
  it('should return 400', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: '',
      search: 'abc',
    };
    const mockQuestion = [];
    getQuestionsByOrder.mockResolvedValueOnce(mockQuestion);
    filterQuestionsBySearch.mockResolvedValueOnce(null);
    // Making the request
    const response = await supertest(server)
      .get('/question/getQuestion')
      .query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(400);
  });
});

describe('GET /getQuestionById/:qid', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  // 200 status when right question id is provided
  it('should return a question by id and increment its views by 1', async () => {

    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockPopulatedQuestion = {
        answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
        views: mockQuestions[1].views + 1,
        comments: []
    };
    
    // Provide mock question data
    Question.findOneAndUpdate = jest.fn()
                            .mockImplementation(() => (
                              { populate: jest.fn()
                                            .mockImplementation(() => (
                                              { populate:jest.fn().mockResolvedValueOnce(mockPopulatedQuestion)}
                                              ))}));
   
    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedQuestion);
  });

  it('should return a question by id with status=true and populate answers and comments', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
  
    // Mock the populated question data
    const mockPopulatedQuestion = {
      answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
      views: mockQuestions[1].views, // Since status=true, views shouldn't be incremented
      comments: [] // Mock comments
    };
  
  
    // Provide mock question data
    Question.findById = jest.fn()
                            .mockImplementation(() => (
                              { populate: jest.fn()
                                            .mockImplementation(() => (
                                              { populate:jest.fn().mockResolvedValueOnce(mockPopulatedQuestion)}
                                              ))}));
  
    // Making the request with status=true
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`)
      .query({ status: 'true' });
  
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedQuestion);
  });

  // 404 status error when question is not found
  it('should return status 404 when question not found', async () => {

    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d827',
    };

    // Provide mock question data
    Question.findOneAndUpdate = jest.fn()
                            .mockImplementation(() => (
                              { populate: jest.fn()
                                            .mockImplementation(() => (
                                              { populate:jest.fn().mockResolvedValueOnce(null)}
                                              ))}));

    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(404);
  });

  // 500 status error when question update fails
  it('should return status 500 when question update fails', async () => {

    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d82',
    };

    // Provide mock question data
    Question.findOneAndUpdate = jest.fn()
                            .mockImplementation(() => (
                              { populate: jest.fn()
                                            .mockImplementation(() => (
                                              { populate:jest.fn().mockRejectedValue(new Error({ message: "Internal server error", status: 500 }))}
                                              ))}));
    
    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});

describe('POST /addQuestion', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  // 200 status when new question is added with proper inputs
  it('should add a new question', async () => {
    // Mock request body
   
    const mockTags = [tag1, tag2]; 

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    // Mock session with a logged-in user
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
         

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .send(mockQuestion)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);
  });

 
  it('should not add a new question for guest user', async () => {
    // Mock request body
   

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }
         

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .send(mockQuestion)

    // Asserting the response
    expect(response.status).toBe(403);
  });

  // 500 error status when add question fails
  it('500 error status when add question fails', async () => {
    // Mock request body
   
    const mockTags = [tag1, tag2]; 

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));
    

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .send(mockQuestion)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  // 500 error status when add tag fails
  it('500 error status when add tag fails', async () => {
    // Mock request body
 
    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    addTag.mockRejectedValueOnce(new Error({ message: "Internal server error", status: 500 }));

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .send(mockQuestion)
      .set('Cookie', sessionCookie);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});
