const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
 
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

app.listen(3000,()=>{
    console.log('Server started');
});