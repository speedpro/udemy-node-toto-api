// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Connected to Mongodb server");

  // db.collection("Todos").find({_id: new ObjectID("591ce9c8cb9da64a59f441e1")}).toArray().then((docs) => {
  //   console.log("todos");
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // })

  // db.collection("Todos").find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // })

  db.collection("Users").updateMany({
    age: {
      $exists: true
    }
  }, {
    $inc: {
      age: 1
    }
  }).then((result) => {
    console.log(result);
  })

  // db.close();
});
