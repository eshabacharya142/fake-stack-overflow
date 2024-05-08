require('dotenv').config();

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  proxy: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false
  }
};

module.exports = sessionConfig;
