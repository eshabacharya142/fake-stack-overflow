// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let { User } = require('./models/users');
let Comment = require('./models/comments');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, user, ans_date_time, comments, voteCount, reported) {
  let answerdetail = {
    text: text,
    ans_by: {
      user_id: user._id, 
      user_name: user.username
    },
    voteCount: voteCount,
    reported: reported
  };
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (comments != false) answerdetail.comments = comments;
  if (voteCount != false) answerdetail.voteCount = voteCount;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, user, ask_date_time, views, comments, voteCount, reported) {
  let qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: {
      user_id: user._id,
      user_name: user.username
    },
    voteCount: voteCount,
    reported: reported
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if (comments != false) qstndetail.comments = comments;
  if (voteCount != false) qstndetail.voteCount = voteCount;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function userCreate(firstName, lastName, username, password, email, role) {
  let userdetail = { 
    firstName: firstName, 
    lastName: lastName, 
    username: username,
    password: password,
    email: email,
    role: role
  }
  let user = new User(userdetail);
  return user.save();
}

function commentCreate(text, user, comment_date_time) {
  let commentdetail = {
    text: text,
    comment_by: {
      user_id: user._id, 
      user_name: user.username
    }
  };
  if (comment_date_time != false) commentdetail.comment_date_time = comment_date_time;

  let comment = new Comment(commentdetail);
  return comment.save();
}

const populate = async () => {
  let u1 = await userCreate('Kate', 'Sharma', "kate", "1234", "kate@test.com", "REGISTERED");
  let u2 = await userCreate('Anthony', 'Bridgerton', "viscount", "1234", "viscount@test.com", "REGISTERED");
  let u3 = await userCreate('Daphne', 'Bridgerton', "diamond", "1234", "diamond@test.com", "REGISTERED");
  let u4 = await userCreate('Simon', 'Hasting', "simon", "1234", "toughguy@test.com", "REGISTERED");
  await userCreate('Queen', 'Charlotte', "queen", "1234", "cherry@test.com", "ADMIN");
  let c1 = await commentCreate('This is comment xyz.', u1, new Date('2023-11-26T09:24:00'));
  let c2 = await commentCreate('This is comment abc.', u3, new Date('2024-01-02T07:19:00'));
  let c3 = await commentCreate('This is comment lmnop.', u2, new Date('2024-03-19T02:27:00'));
  let t1 = await tagCreate('react');
  let t2 = await tagCreate('javascript');
  let t3 = await tagCreate('android-studio');
  let t4 = await tagCreate('shared-preferences');
  let t5 = await tagCreate('storage');
  let t6 = await tagCreate('website');
  await tagCreate('Flutter');
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1, new Date('2023-11-20T03:24:42'), []);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u2, new Date('2023-11-23T08:24:00'), [], 5);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u3, new Date('2023-11-18T09:24:00'), [c1, c2], 11);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u4, new Date('2023-11-12T03:30:00'), [c2], 1);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u1, new Date('2023-11-01T15:24:19'), [c3, c2, c1]);
  let a6 = await answerCreate('Storing content as BLOBs in databases.', u2, new Date('2023-02-19T18:20:59'), [], 9, true);
  let a7 = await answerCreate('Using GridFS to chunk and store content.', u3, new Date('2023-02-22T17:19:00'), [], 4);
  let a8 = await answerCreate('Store data in a SQLLite database.', u4, new Date('2023-03-22T21:17:53'), [], 2);
  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], u1, new Date('2022-01-20T03:00:00'), 10, [c3, c2], 12, true);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], u3, new Date('2023-01-10T11:24:30'), 121, [c1, c2], 30);
  await questionCreate('Object storage for a web application', 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.', [t5, t6], [a6, a7], u4, new Date('2023-02-18T01:02:15'), 200, [], 10);
  await questionCreate('Quick question about storage on android', 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains', [t3, t4, t5], [a8], u2, new Date('2023-03-10T14:28:01'), 103, [c1], 15);
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');





