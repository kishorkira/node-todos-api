const {ObjectID} = require('mongodb');

const {mongoose} =require('./../server/db/mongoose');
const {Todo} =require('./../server/models/todo');
const {User} =require('./../server/models/user');
// Remove all documents
// Todo.remove({}).then((result)=>{

// });
//// findOneAndRemove removes first doc it matches
// Todo.findByIdAndRemove({_id : "5bcad153e2f9fe74277258f5"}).then((doc)=>{
//     console.log(doc);
// });

//// findOneAndRemove removes first doc it matches
Todo.findByIdAndRemove({_id : "5bcad1b401698e6c042faea2"}).then((doc)=>{
    console.log(doc);
});