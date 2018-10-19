const {MongoClient,ObjectID} =require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');   
    //// deleteMany
    // db.collection('Todos')
    //     .deleteMany({text:'Feed the dog'})
    //     .then((result)=>{
    //         console.log(JSON.stringify(result.result,undefined,2));
    //     },(err)=>{
    //         console.log('Unable to delete items');
    //     });
    ////deleteOne
    // db.collection('Todos')
    //     .deleteOne({text:'Feed the dog'})
    //     .then((result)=>{
    //         console.log(JSON.stringify(result.result,undefined,2));
    //     },(err)=>{
    //         console.log('Unable to delete items');
    //     });
    //// findOneAndDelete
    db.collection('Todos')
        .findOneAndDelete({completed:false})
        .then((result)=>{
            console.log(JSON.stringify(result.value,undefined,2));
        },(err)=>{
            console.log('Unable to delete items');
        });
    db.close();
});
