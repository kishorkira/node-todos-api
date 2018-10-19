const {MongoClient,ObjectID} =require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');   
    
    //// findOneAndUpdate
    // db.collection('Todos')
    //     .findOneAndUpdate({
    //         _id:new ObjectID('5bc9f8c1a5343f25d888b335')
    //     },{
    //         $set:{
    //             completed:true
    //         }
    //     },{
    //         returnOriginal:false
    //     })
    //     .then((result)=>{
    //         console.log(JSON.stringify(result.value,undefined,2));
    //     },(err)=>{
    //         console.log('Unable to delete items');
    //     });
    db.collection('Users')
        .findOneAndUpdate({
            _id:new ObjectID('5bc9dff84127ba459cc7b715')
        },{
            $set:{
                name:'Raju'
            },
            $inc:{ age : 2}
        },{
            returnOriginal:false
        })
        .then((result)=>{
            console.log(JSON.stringify(result.value,undefined,2));
        },(err)=>{
            console.log('Unable to delete items');
        });
    db.close();
});
