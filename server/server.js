const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

const PORT = process.env.PORT || 3000;

let app = express();
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('Welcome to todos app.');
});

app.post('/todos',(req,res)=>{
    let newTodo = new Todo({
        text: req.body.text
    });
    newTodo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});
app.get('/todos',(req,res)=>{
    Todo.find({}).then((todos)=>{
        res.send({
            todos
        });
    },(e)=>{
        res.status(400).send(e);
    });
});
app.get('/todos/:id',(req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }       
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e); 
    });
    
});
app.delete('/todos/:id',(req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }       
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e); 
    });
    
});
app.listen(PORT,()=>{
    console.log(`Server started at port : ${PORT}`);
});
module.exports ={
    app
};