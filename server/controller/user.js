const express = require("express");
const { User, Admin } = require("../models/users");

const router = express.Router();

const createUserHelper = async (newUser) => {
      try {
        let actualUser = null;
        if (newUser.role === 'ADMIN') {
          actualUser = await Admin.create(newUser);
        } else {
          actualUser = await User.create(newUser);
        }
        return (actualUser);
      } catch (e) {
        return e.status(400);
      }
  };


  //auth-register user
  const register = async (req, res) => {
    try {
      const user = req.body;
      const existingUser = await User.findOne({ username: user.username });
    
      if (existingUser) {
        res.sendStatus(403);
        return;
      }
      const currentUser = await createUserHelper(user);
      req.session['currentUser'] = currentUser;
      res.json(currentUser);
    } catch (e) {
      res.status(400).json(e);
    }
    return;
  };

  //auth-login user
  const login = async (req, res) => {
    const credentials = req.body;
    const existingUser = await User.findOne({ username: credentials.username, password: credentials.password });
    if (existingUser) {
      req.session['currentUser'] = existingUser;
      res.json(existingUser);
      return;
    }
    res.sendStatus(403);
  };

  //auth-logout user
  const logout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  //auth-retrieve user profile
  const profile = (req, res) => {
    if (req.session['currentUser']) {
      res.send(req.session['currentUser']);
    } else {
      res.sendStatus(403);
    }
  };



// add appropriate HTTP verbs and their endpoints to the router.
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/profile', profile);
module.exports = router;
