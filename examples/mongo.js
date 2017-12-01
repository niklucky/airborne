"use strict";
var options = {
  host: '127.0.0.1',
  database: 'CSKA_News',
  port: 27017
};
var mongoose = require("mongoose");

var connectionString = 'mongodb://localhost/CSKA_News';
  console.log('connectionString', connectionString);
var mong = mongoose.connect(connectionString);

client.on("error", function (err) {
  console.log("Error " + err);
});
/* Strings */
// set
// get
// del
// incr
// mset / mget (?)

/* Lists */
// Not implemented

/* Hashes */
// hmset
// hgetall
// del

/* Sets */
// Not implemented

/* Sorted sets */
// Not implemented
class TestModel {
  constructor(model){
    this.id = data.id;
    this.sourceId = data.sourceId;
    this.title = data.title;
    this.description = data.description;
  }
}
var MongoMapper = require('./../dist/lib/mongo.mapper');
var mongom = new MongoMapper({ db: client });
mongom.Model = TestModel;

mongom.load().then(res => {
    console.log("Result: ", res);
  })
    .catch(err => {
      console.log("Error: ", err);
    });

// redism.create({ a: '123' } ).then(res => {
//   console.log("Result: ", res);
// })
//   .catch(err => {
//     console.log("Error: ", err);
//   });


// redism.remove({ key: '79e1fd76c37e83ceff234d4b1d83679e89a8fc2a24ac03ad8aff7e2b2cdb6a2e' }).then(res => {
//   console.log("Result: ", res);
//   client.keys('*', function(err, res){
//     console.log("Error", err);
//     console.log("res", res.length);
//   });
// })
//   .catch(err => {
//     console.log("Error: ", err);
//   });

// // client.flushdb(redis.print);

// client.del("key2", redis.print);
// client.keys('*', function(err, res){
//   console.log("Error", err);
//   console.log("res", res);
// });
// client.set("key2", "value1", redis.print);
// client.set("key3", "value1", redis.print);
// client.set("key4", "value1", redis.print);
// client.set("key5", "value1", redis.print);
//
// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//   console.log(replies.length + " replies:");
//   replies.forEach(function (reply, i) {
//     console.log("    " + i + ": " + reply);
//   });
//   client.quit();
// });