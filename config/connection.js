// const mongoClient = require('mongodb').MongoClient;

// const state = {
//   db: null
// };

// module.exports.connect = (callback) => {
//   const url = 'mongodb+srv://LumovaleDB:bW3WCyLSQ7s6jUS4@cluster0.jlrnpnu.mongodb.net/Lumovale';
//   const dbname = 'Lumovale';

//   mongoClient.connect(url, (err, data) => {
//     if (err) return callback(err);
//     state.db = data.db(dbname);
//     callback(); 
//   });
// };

// module.exports.get = function () {
//   return state.db;
// };
