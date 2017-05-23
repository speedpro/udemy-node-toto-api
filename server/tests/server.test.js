const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

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

beforeEach((done) => {
  Todo
    .remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
})

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "Test todo text";

    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo
          .find({text})
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((e) => done(e));
      })
  });

  it('should not create a todo with invalid body data', (done) => {
    var text = "  "; //invalid body data

    request(app)
      .post("/todos")
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo
          .find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch((e) => done(e));

      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app).get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    var badId = new ObjectID();
    request(app)
      .get(`/todos/${badId}`)
      .expect(404)
      .end(done);

  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[0]
      ._id
      .toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        //queyr findbyid -> to notExist
        Todo
          .findById(hexId)
          .then((res) => {
            expect(res).toNotExist();
            done();
          })
          .catch(done);
      });
  });

  it('should return a 404 if todo not found', (done) => {
    var badId = new ObjectID();
    request(app)
      .delete(`/todos/${badId}`)
      .expect(404)
      .end(done);

  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]
      ._id
      .toHexString();
    var body = {
      text: "new test text",
      completed: true
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toEqual(body.text);
        expect(res.body.todo.completed).toEqual(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

    //id of first item//update text, set completed true//200
    //text is changed, complted is true, compltedAt is a number
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]
      ._id
      .toHexString();
    var body = {
      text: "Second New test text",
      completed: false
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toEqual(body.text);
        expect(res.body.todo.completed).toEqual(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
    //grab id of second todo//update text, set complted to false
  });
});
