const {ObjectID} = require("mongodb");
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const serversecret = "abc123"

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: "caleb@example.com",
  password: 'userPassOne',
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userOneId, access: "auth"}, serversecret).toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}]




const todos = [
  {
    _id: new ObjectID(),
    text: 'First Test Todo'
  }, {
    _id: new ObjectID(),
    text: 'Second Test Todo',
    completed: true,
    completedAt: 4371083927
  }
]

const populateTodos = (done) => {
  Todo
    .remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done())
}


module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
