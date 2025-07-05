const mongoClient= require('mongodb').MongoClient;
const state= {
    db: null
};
module.exports.connect= (callback) => {
    const url = 'mongodb://127.0.0.1:27017/';
    const dbname = 'Lumovale';

    mongoClient.connect(url,(err,data) => {
        if(err) return callback(err);
        state.db= data.db(dbname);
        callback();
    });

    
};

module.exports.get=function(){
    return state.db;
}