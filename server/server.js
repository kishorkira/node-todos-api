require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {authenticate} = require('./middleware/authenticate');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

const PORT = process.env.PORT;

let app = express();
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('Welcome to todos app.');
});
app.post('/users',(req,res)=>{
   let user = _.pick(req.body,['email','password']); 
   let newUser = new User(user);
   newUser.save().then(()=>{
    //    if(!user){
    //        return res.status(404).send();
    //    }
       return newUser.generateAuthToken();
   })
   .then((token)=>{
        res.header('x-auth',token).send({newUser});
   })
   .catch((e)=>{
       res.status(400).send(e);
   });
});

app.get('/users/me',authenticate,(req,res)=>{
    res.send({'user':req.user});
});
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
  
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
});
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.post('/todos',authenticate, (req,res)=>{
    let newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    newTodo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});
app.get('/todos',authenticate,(req,res)=>{
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send({
            todos
        });
    },(e)=>{
        res.status(400).send(e);
    });
});
app.get('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }       
    Todo.findById({
            _id :id,
            _creator: req.user._id
        }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e); 
    });
    
});
app.delete('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }       
    Todo.findOneAndRemove({
        _id:id,
        _creator: req.user._id  
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e); 
    });
    
});

app.patch('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }    
    if(_.isBoolean(body.completed) && body.completed){
        body.completed =true;
        body.completedAt = new Date().getTime();
    }else{
        body.completed =false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id:id,
        _creator: req.user._id  
    },{$set:body},{new:true}).then((todo)=>{
        if(!todo){        
            return  res.status(404).send();
        }
        res.send({todo});
    },(e)=>{
        res.status(400).send();

    }).catch((e)=>{
        res.status(400).send();
    });
});

app.listen(PORT,()=>{
    console.log(`Server started at port : ${PORT}`);
});
module.exports ={
    app
};