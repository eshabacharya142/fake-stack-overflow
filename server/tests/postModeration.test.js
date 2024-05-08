// Unit tests for getTagsWithQuestionNumber in controller/question.js and controller/answer.js

const supertest = require("supertest")
const Question = require('../models/questions');
const Answer = require('../models/answers');
const {User} = require('../models/users');
const { default: mongoose } = require("mongoose");

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
const existingAdmin = {
    "_id": "existingAdminId",
    "firstName": "existingAdminFirstName",
    "lastName": "existingAdminLastName",
    "username": "existingAdminUsername",
    "password": "existingAdminPassword",
    "role": "ADMIN",
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
    },
    {
      _id: '65e9b58910afe6e94fc6e6cd',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1],
      answers: [ans1,ans2],
      views: 200
    },
    {
      _id: '65e9b5a995b6c7045a30d829',
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag2],
      answers: [],
      views: 199
  }
  ]

  const getLoggedInSessionCookie = async (user) => {
    const loginResponse = await supertest(server)
      .post('/user/login')
      .send({ username: user.username, password: user.password });
    
    return loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid'));
  };

describe('POST /reportQuestion/:qid', () => {
  
    beforeEach(() => {
        server = require("../server");
      })
    
      afterEach(async() => {
        server.close();
        await mongoose.disconnect()
      });
  
    it('reportQuestion successful by user', async () => {

        const mockReqParams = {
            qid: '65e9b5a995b6c7045a30d823'
          };

          const mockPopulatedQuestion = {
            answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
            views: mockQuestions[1].views + 1,
            comments: [],
            reported: true
        };

        
        User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
        const sessionCookie = await getLoggedInSessionCookie(existingUser);
        
        Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(mockPopulatedQuestion);


        // Making the request
        const response = await supertest(server)
            .post(`/question/reportQuestion/${mockReqParams.qid}`)
            .set('Cookie', sessionCookie);
        
    // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPopulatedQuestion);
    });

    it('reportQuestion successful by admin', async () => {

        const mockReqParams = {
            qid: '65e9b5a995b6c7045a30d823'
          };

          const mockPopulatedQuestion = {
            answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
            views: mockQuestions[1].views + 1,
            comments: [],
            reported: true
        };

        
        User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
        const sessionCookie = await getLoggedInSessionCookie(existingAdmin);
        
        Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(mockPopulatedQuestion);


        // Making the request
        const response = await supertest(server)
            .post(`/question/reportQuestion/${mockReqParams.qid}`)
            .set('Cookie', sessionCookie);


    // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPopulatedQuestion);
    });

    it('reportQuestion unsuccessful for guest user', async () => {

      const mockReqParams = {
          qid: '65e9b5a995b6c7045a30d823'
        };
      
      // Making the request
      const response = await supertest(server)
          .post(`/question/reportQuestion/${mockReqParams.qid}`)
      
  // Asserting the response
      expect(response.status).toBe(403);
  });
  it('reportQuestion question not found', async () => {

    const mockReqParams = {
        qid: '65e9b5a995b6c7045a30d827'
      };

    
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(null);


    // Making the request
    const response = await supertest(server)
        .post(`/question/reportQuestion/${mockReqParams.qid}`)
        .set('Cookie', sessionCookie);
    
// Asserting the response
    expect(response.status).toBe(404);
});

it('reportQuestion throws 500', async () => {

  const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d827'
    };

  
  User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
  const sessionCookie = await getLoggedInSessionCookie(existingUser);
  
  Question.findOneAndUpdate = jest.fn().mockRejectedValue(null);


  // Making the request
  const response = await supertest(server)
      .post(`/question/reportQuestion/${mockReqParams.qid}`)
      .set('Cookie', sessionCookie);
  
// Asserting the response
  expect(response.status).toBe(500);
});

});

describe('POST /reportAnswer/:aid', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it('reportAnswer successful by user', async () => {

    const mockReqParams = {
        aid: '65e9b58910afe6e94fc6e6dd'
      };

      const mockPopulatedAns = {
        _id: '65e9b58910afe6e94fc6e6dd',
        text: 'Answer 2 Text',
        ans_by: 'answer2_user',
        reported: true
      }
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);
    
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(mockPopulatedAns);

    // Making the request
    const response = await supertest(server)
        .post(`/answer/reportAnswer/${mockReqParams.aid}`)
        .set('Cookie', sessionCookie);
// Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedAns);
});

it('reportAnswer successful by admin', async () => {

  const mockReqParams = {
      aid: '65e9b58910afe6e94fc6e6dd'
    };

  User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
  const sessionCookie = await getLoggedInSessionCookie(existingAdmin);
  
  Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(ans2);

  // Making the request
  const response = await supertest(server)
      .post(`/answer/reportAnswer/${mockReqParams.aid}`)
      .set('Cookie', sessionCookie);

// Asserting the response
  expect(response.status).toBe(200);
  expect(response.body).toEqual(ans2);
});

it('reportAnswer unsuccessful for guest user', async () => {
  const mockReqParams = {
    aid: '65e9b58910afe6e94fc6e6dd'
  };


// Making the request
const response = await supertest(server)
    .post(`/answer/reportAnswer/${mockReqParams.aid}`)

// Asserting the response
expect(response.status).toBe(403);

});
it('reportAnswer answer not found', async () => {
  const mockReqParams = {
    aid: '65e9b58910afe6e94fc6e6dd'
  };

User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
const sessionCookie = await getLoggedInSessionCookie(existingUser);

Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(null);

// Making the request
const response = await supertest(server)
    .post(`/answer/reportAnswer/${mockReqParams.aid}`)
    .set('Cookie', sessionCookie);
// Asserting the response
expect(response.status).toBe(404);
});
it('reportQuestion throws 500', async () => {
  const mockReqParams = {
    aid: '65e9b58910afe6e94fc6e6dd'
  };


User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
const sessionCookie = await getLoggedInSessionCookie(existingUser);

Answer.findOneAndUpdate = jest.fn().mockRejectedValue(null);

// Making the request
const response = await supertest(server)
    .post(`/answer/reportAnswer/${mockReqParams.aid}`)
    .set('Cookie', sessionCookie);
// Asserting the response
expect(response.status).toBe(500);

});

});

describe('POST admin/deleteQuestion/:qid', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it('deleteReportedQuestion successful by admin', async () => {

    const mockReqParams = {
        qid: '65e9b58910afe6e94fc6e6cd'
      };

      const mockPopulatedQuestion = {
        answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
        views: mockQuestions[1].views + 1,
        comments: [],
        reported: true
    };

    
      User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
      const sessionCookie = await getLoggedInSessionCookie(existingAdmin);

      Question.findById = jest.fn().mockResolvedValueOnce(mockPopulatedQuestion);
      Answer.deleteMany = jest.fn().mockResolvedValueOnce({});
      Question.deleteOne = jest.fn().mockResolvedValueOnce({});

      // Making the request
      const response = await supertest(server)
        .post(`/question/admin/deleteQuestion/${mockReqParams.qid}`)
        .set('Cookie', sessionCookie);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual("Question and associated answers deleted");


    });

    it('deleteReportedQuestion successful by admin', async () => {

      const mockReqParams = {
          qid: '65e9b5a995b6c7045a30d823'
        };
  
        const mockPopulatedQuestion = {
          answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
          views: mockQuestions[1].views + 1,
          comments: [],
          reported: true
      };
      const mockPopulatedAnswers = mockPopulatedQuestion.answers;
  
      
        User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
        const sessionCookie = await getLoggedInSessionCookie(existingAdmin);
  
        Question.findById = jest.fn().mockResolvedValueOnce(mockPopulatedQuestion);
        Answer.deleteMany = jest.fn().mockResolvedValueOnce(mockPopulatedAnswers);
        Question.deleteOne = jest.fn().mockResolvedValueOnce({});
  
        // Making the request
        const response = await supertest(server)
          .post(`/question/admin/deleteQuestion/${mockReqParams.qid}`)
          .set('Cookie', sessionCookie);
  
        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual("Question and associated answers deleted");
  
  
      });

      it('deleteReportedQuestion successful by admin', async () => {

        const mockReqParams = {
            qid: '65e9b5a995b6c7045a30d829'
          };
    
          const mockPopulatedQuestion = {
            answers: [], 
            views: mockQuestions[3].views + 1,
            comments: [],
            reported: true
        };
    
        
          User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
          const sessionCookie = await getLoggedInSessionCookie(existingAdmin);
    
          Question.findById = jest.fn().mockResolvedValueOnce(mockPopulatedQuestion);
          // Answer.deleteMany = jest.fn().mockResolvedValueOnce(mockPopulatedAnswers);
          Question.deleteOne = jest.fn().mockResolvedValueOnce({});
    
          // Making the request
          const response = await supertest(server)
            .post(`/question/admin/deleteQuestion/${mockReqParams.qid}`)
            .set('Cookie', sessionCookie);
    
          // Asserting the response
          expect(response.status).toBe(200);
          expect(response.body).toEqual("Question and associated answers deleted");
    
    
        });

    it('deleteReportedQuestion unsuccessful by registered user', async () => {

      const mockReqParams = {
          qid: '65e9b5a995b6c7045a30d823'
        };
  
      
        User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
        const sessionCookie = await getLoggedInSessionCookie(existingUser);
  
        // Making the request
        const response = await supertest(server)
          .post(`/question/admin/deleteQuestion/${mockReqParams.qid}`)
          .set('Cookie', sessionCookie);
  
        // Asserting the response
        expect(response.status).toBe(403);
        expect(JSON.stringify(response.body)).toEqual('{"error":"Forbidden to delete for registered users"}');

      });

      it('deleteReportedQuestion forbidden', async () => {

        const mockReqParams = {
            qid: '65e9b5a995b6c7045a30d823'
          };
  
    
          // Making the request
          const response = await supertest(server)
            .post(`/question/admin/deleteQuestion/${mockReqParams.qid}`);
    
          // Asserting the response
          expect(response.status).toBe(403);
    
    
        });

        it('deleteReportedQuestion question not found', async () => {

          const mockReqParams = {
              qid: '65e9b5a995b6c7045a30d827'
            };
      
          
            User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
            const sessionCookie = await getLoggedInSessionCookie(existingAdmin);
      
            Question.findById = jest.fn().mockResolvedValueOnce(null);
      
            // Making the request
            const response = await supertest(server)
              .post(`/question/admin/deleteQuestion/${mockReqParams.qid}`)
              .set('Cookie', sessionCookie);
      
            // Asserting the response
            expect(response.status).toBe(404);
      
      
          });

          it('deleteReportedQuestion throws 500', async () => {

            const mockReqParams = {
                qid: '65e9b5a995b6c7045a30d823'
              };
        
            
              User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
              const sessionCookie = await getLoggedInSessionCookie(existingAdmin);
        
              Question.findById = jest.fn().mockRejectedValue(null);
        
              // Making the request
              const response = await supertest(server)
                .post(`/question/admin/deleteQuestion/${mockReqParams.qid}`)
                .set('Cookie', sessionCookie);
        
              // Asserting the response
              expect(response.status).toBe(500);
        
        
            });
    
  });

describe('POST admin/deleteAnswer/:aid', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });
  it('deleteReportedAnswer successful by admin', async () => {

    const mockReqParams = {
      aid: '65e9b58910afe6e94fc6e6dd'
    };

    const mockPopulatedAns = {
      _id: '65e9b58910afe6e94fc6e6dd',
      text: 'Answer 2 Text',
      ans_by: 'answer2_user',
      reported: true
    }

    User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
    const sessionCookie = await getLoggedInSessionCookie(existingAdmin);

    Answer.deleteOne = jest.fn().mockResolvedValueOnce({mockPopulatedAns});

    // Making the request
    const response = await supertest(server)
    .post(`/answer/admin/deleteAnswer/${mockReqParams.aid}`)
    .set('Cookie', sessionCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual("Answer Deleted");

  });

  it('deleteReportedAnswer unsuccessful by registered user', async () => {
    
    const mockReqParams = {
      aid: '65e9b58910afe6e94fc6e6dd'
    };
    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    const sessionCookie = await getLoggedInSessionCookie(existingUser);

    // Making the request
    const response = await supertest(server)
    .post(`/answer/admin/deleteAnswer/${mockReqParams.aid}`)
    .set('Cookie', sessionCookie);

    expect(response.status).toBe(403);
    expect(JSON.stringify(response.body)).toEqual('{"error":"Forbidden to delete for registered users"}');
    
  });
  it('deleteReportedAnswer forbidden', async () => {

    const mockReqParams = {
      aid: '65e9b58910afe6e94fc6e6dd'
    };

    // Making the request
    const response = await supertest(server)
    .post(`/answer/admin/deleteAnswer/${mockReqParams.aid}`);

    expect(response.status).toBe(403);

  });

  it('deleteReportedAnswer throws 500', async () => {

    const mockReqParams = {
      aid: '65e9b58910afe6e94fc6e6dd'
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
    const sessionCookie = await getLoggedInSessionCookie(existingAdmin);

    Answer.deleteOne = jest.fn().mockRejectedValue(null);

    // Making the request
    const response = await supertest(server)
    .post(`/answer/admin/deleteAnswer/${mockReqParams.aid}`)
    .set('Cookie', sessionCookie);

    expect(response.status).toBe(500);

  });
});