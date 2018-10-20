const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
let docCount;
beforeEach((done) => {
  Todo.count({},(err,count)=>{
    docCount =count;
    done();
  });
  
});
describe('GET /todos',()=>{
  it('Should list all todos',(done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(docCount);
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        done();
      });
  });
 
});
describe('GET /todos/:id',()=>{
  
  it('Should return a todo',(done)=>{
    Todo.find().then((todos)=>{
      if(todos.length > 0){
        let todo = todos[0];
        request(app)
        .get(`/todos/${todo._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.text).toBe(todo.text);
        })
        .end(done);
      }
    }).catch((e)=>console.log(e));
  });
  it('Should return 404 if todo not found',(done)=>{
    let hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 invalid id',(done)=>{
   
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text : 'Test todo text'})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(docCount+1);
          // expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(docCount);
          done();
        }).catch((e) => done(e));
      });
  });
});
