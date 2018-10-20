const {ObjectID} = require('mongodb');

const {mongoose} =require('./../server/db/mongoose');
const {Todo} =require('./../server/models/todo');
const {User} =require('./../server/models/user');

let id = "5bcae09a888c1a98112d0dc8";
let userID = "6bcaa11172a5647825071abb";

if(!ObjectID.isValid(userID)){
    console.log('Invalid user id');
}else{
    User.findById(userID).then((user)=>{
        if(!user){
            console.log('user with given id not found');
        }
        console.log('user : ',user);
    }).catch((e)=>{
        console.log('error : ',e);
    });
}
User.find({
    email: 'kk@gmail.com'
}).then((users)=>{
    if(users.length < 1){
        console.log('no of users with search is 0');
    }else{
        console.log('Users : ',users);
    }
}).catch((e)=>console.log(e));

User.findOne({
    email: 'kk@gmail.com'
}).then((user)=>{
    if(!user){
        console.log('user not found');
    }else{
        console.log('User : ',user);
    }
}).catch((e)=>console.log(e));



Todo.find({
    _id:id
}).then((todos)=>{
    console.log('Todos ',todos);
});
Todo.findOne({
    _id:id
}).then((todo)=>{
    console.log('Todo ',todo);
});
Todo.findById({
    _id:id
}).then((todo)=>{
    console.log('Todo find by id',todo);
});