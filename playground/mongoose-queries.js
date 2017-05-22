const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5922be44abc71bd39d51ad7011';
var userId = '5920232bed2df8b711926be6';

// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// });
//
// Todo.findById(id).then((todoById) => {
//   if (!todoById) {
//     return console.log('ID not found');
//   }
//   console.log('Todo By Id: ', todoById);
// }).catch((e) => {console.log(e);});

User.findById(userId).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, null, 2));
}, (e) => {
  console.log('error when requesting user from mongoose:', e);
});
