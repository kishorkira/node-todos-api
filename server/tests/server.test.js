const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// const todos = [{
//   _id: new ObjectID(),
//   text: 'First test todo'
// }, {
//   _id: new ObjectID(),
//   text: 'Second test todo',
//   completed: true,
//   completedAt: 333
// }];

// beforeEach((done) => {
//   Todo.remove({}).then(() => {
//     return Todo.insertMany(todos);
//   }).then(() => done());
// });

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
describe('DELETE /todos/:id',()=>{
  
  it('Should return a deleted todo',(done)=>{
    Todo.find().then((todos)=>{
      if(todos.length > 0){
        let todo = todos[0];
        request(app)
        .delete(`/todos/${todo._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(todo._id.toHexString());
        })
        .end(done);
      }
    }).catch((e)=>console.log(e));
  });
  it('Should return 404 if todo not found',(done)=>{
    let hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 invalid id',(done)=>{
   
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });
});
describe('PATCH /todos/:id',()=>{
  
  it('Should return a Updated todo',(done)=>{
    Todo.find({completed:false}).then((todos)=>{
      if(todos.length > 0){
        let todo = todos[0];
        request(app)
        .patch(`/todos/${todo._id.toHexString()}`)
        .send({completed : true})
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(todo._id.toHexString());
          expect(res.body.todo.completed).toBe(true);
        })
        .end(done);
      }
    }).catch((e)=>console.log(e));
  });
  it('Should clear completedAt when todo not completed return a Updated todo',(done)=>{
    Todo.find({completed:true}).then((todos)=>{
      if(todos.length > 0){
        let todo = todos[0];
        request(app)
        .patch(`/todos/${todo._id.toHexString()}`)
        .send({completed : false})
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(todo._id.toHexString());
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBe(null);
        })
        .end(done);
      }
    }).catch((e)=>console.log(e));
  });

  it('Should return 404 if todo not found',(done)=>{
    let hexId = new ObjectID().toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 invalid id',(done)=>{
   
    request(app)
      .patch(`/todos/123`)
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
