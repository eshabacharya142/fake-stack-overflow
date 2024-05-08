// Unit tests for user profiles in controller/user.js

const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const {User, Admin} = require('../models/users');


jest.mock("../models/questions");
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

const existingAdmin = {
    "_id": "existingAdminId",
    "firstName": "existingAdminFirstName",
    "lastName": "existingAdminLastName",
    "username": "existingAdminUsername",
    "password": "existingAdminPassword",
    "role": "ADMIN",
    "voted": [],
};
describe('POST /user/register', () => {
    beforeEach(() => {
      server = require("../server");
    })
  
    afterEach(async() => {
      server.close();
      await mongoose.disconnect()
    });
  
    it('should register a new user for registered role', async () => {

        const mockReqBody = {
            "_id": "dummyUserid",
            "firstName": "user1",
            "lastName": "1234",
            "username": "tanmag1",
            "password": "1234",
            "role": "REGISTERED",
            "voted": []
        }
        
        User.findOne = jest.fn().mockResolvedValueOnce(null);

        const mockUser = {
            "_id": "dummyUserid",
            "firstName": "user1",
            "lastName": "1234",
            "username": "tanmag1",
            "password": "1234",
            "role": "REGISTERED",
            "voted": []
        }

        User.create = jest.fn().mockResolvedValueOnce(mockUser);

        const response = await supertest(server)
            .post('/user/register')
            .send(mockReqBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);

        expect(User.create).toHaveBeenCalledWith(mockUser);

    });

    it('should register a new user for admin role', async () => {

        const mockReqBody = {
            "_id": "dummyUserid",
            "firstName": "user2",
            "lastName": "1234",
            "username": "tanmag2",
            "password": "1234",
            "role": "ADMIN",
            "voted": []
        }
        
        User.findOne = jest.fn().mockResolvedValueOnce(null);

        const mockCreatedUser = {
            "_id": "dummyUserid",
            "firstName": "user2",
            "lastName": "1234",
            "username": "tanmag2",
            "password": "1234",
            "role": "ADMIN",
            "voted": []
        }

        Admin.create = jest.fn().mockResolvedValueOnce(mockCreatedUser);

        const response = await supertest(server)
            .post('/user/register')
            .send(mockReqBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCreatedUser);

        expect(Admin.create).toHaveBeenCalledWith(mockCreatedUser);

    });

    it('user exists so registration unsuccessful', async () => {

    const mockReqBody = {
        "_id": "existingUserId",
        "firstName": "existingUserFirstName",
        "lastName": "existingUserLastName",
        "username": "existingUsername",
        "password": "existingPassword",
        "role": "REGISTERED",
        "voted": []
    };
    

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);


    const response = await supertest(server)
        .post('/user/register')
        .send(mockReqBody);

    expect(response.status).toBe(403);
    });

    it('registration unsuccessful', async () => {

        const mockReqBody = {
            "_id": "existingUserId",
            "firstName": "existingUserFirstName",
            "lastName": "existingUserLastName",
            "username": "existingUsername",
            "password": "existingPassword",
            "role": "REGISTERED",
            "voted": []
        };
        
    
        User.findOne = jest.fn().mockResolvedValueOnce(null);
    
        User.create = jest.fn().mockRejectedValue(null);
        const response = await supertest(server)
            .post('/user/register')
            .send(mockReqBody);
    
        expect(response.status).toBe(400);
        });
});

describe('POST /user/login', () => {
    beforeEach(() => {
      server = require("../server");
    })
  
    afterEach(async() => {
      server.close();
      await mongoose.disconnect()
    });
  
    it('login successful for registered user', async () => {
        const mockReqBody = {
            username: existingUser.username,
            password: existingUser.password
        };

        User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

        const response = await supertest(server)
            .post('/user/login')
            .send(mockReqBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(existingUser);
    });

    it('login successful for admin', async () => {
        const mockReqBody = {
            username: existingAdmin.username,
            password: existingAdmin.password
        };

        User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);

        const response = await supertest(server)
            .post('/user/login')
            .send(mockReqBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(existingAdmin);
    });

    it('login unsuccessful because of wrong username', async () => {
        const mockReqBody = {
            username: 'nonExistingUsername', 
            password: existingUser.password
        };

        User.findOne = jest.fn().mockResolvedValueOnce(null);

        const response = await supertest(server)
            .post('/user/login')
            .send(mockReqBody);

        expect(response.status).toBe(403);

    });

    it('login unsuccessful because of wrong password', async () => {
        const mockReqBody = {
            username: existingUser.username, 
            password: 'wrongPassword', 
        };

        User.findOne = jest.fn().mockResolvedValueOnce(null);

        const response = await supertest(server)
            .post('/user/login')
            .send(mockReqBody);

        expect(response.status).toBe(403);
    });

});

describe('POST /user/profile', () => {
    let server;
 
    beforeEach(() => {
        server = require("../server");

        //agent = supertest.agent(server); // Use supertest agent for session persistence
    });
  
    afterEach(async() => {
      server.close();
      await mongoose.disconnect()
    });
  
    it('profile successful when user is logged in', async () => {
        // Mock session with a logged-in user
        User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
         
        const loginResponse = await supertest(server)
        .post('/user/login')
        .send({ username: existingUser.username, password: existingUser.password });
         
        const sessionCookie = loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid'));
  
        const response = await supertest(server)
             .post('/user/profile')
             .set('Cookie', sessionCookie);
  

         expect(response.status).toBe(200);
         expect(response.body).toEqual(existingUser);
     });

     it('profile successful when admin is logged in', async () => {
        // Mock session with a logged-in user
        User.findOne = jest.fn().mockResolvedValueOnce(existingAdmin);
         
        const loginResponse = await supertest(server)
        .post('/user/login')
        .send({ username: existingAdmin.username, password: existingAdmin.password });
         
        const sessionCookie = loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid'));
  
        const response = await supertest(server)
             .post('/user/profile')
             .set('Cookie', sessionCookie);
  

         expect(response.status).toBe(200);
         expect(response.body).toEqual(existingAdmin);
     });


    it('profile unsuccessful', async () => {
        const response = await supertest(server)
        .post('/user/profile');

        expect(response.status).toBe(403);
    });

});

describe('POST /user/logout', () => {
    beforeEach(() => {
      server = require("../server");
    })
  
    afterEach(async() => {
      server.close();
      await mongoose.disconnect()
    });
  
    it('logout', async () => {

        const response = await supertest(server)
            .post('/user/logout');

        expect(response.status).toBe(200);
    });

});