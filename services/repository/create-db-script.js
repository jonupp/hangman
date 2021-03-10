//connect to database
//db = connect('127.0.0.1:27017/hangmanDB');
print('\x1b[32m** Database created\x1b[0m');

//remove old players collection
for(const c of db.getCollectionNames()) {
    db[c].remove({});
}
print('\x1b[32m** All old collections removed\x1b[0m');

//create the names collection and add documents to it
db.players.insertMany([
    { "_id" : ObjectId("60413f80a3c10ba36b634471"), "name" : "Hans", "score" : 32 },
    { "_id" : ObjectId("60413faaf63e47a8a3433e1d"), "name" : "Gerta", "score" : 2 },
    { "_id" : ObjectId("60413fb86ef094aa66c0574e"), "name" : "Ueli", "score" : 10 },
    { "_id" : ObjectId("60413fe3b72c0bafbd1721a0"), "name" : "Kalberer", "score" : 9 },
    { "_id" : ObjectId("6041415511e129dd6d84a4ea"), "name" : "Peter", "score" : 53 },
    { "_id" : ObjectId("6041415511e129dd6d84a4ef"), "name" : "Jonas", "score" : 52 }
]);
print('\x1b[32m** Players collection and documents created:\x1b[0m');
db.players.find().forEach(e => print('\t'+JSON.stringify(e).replace('\n', ' ')));

print('\x1b[32m** Enter MongoDB shell with:\x1b[0m mongo --host mongodb://127.0.0.1:27017/hangmanDB\x1b[0m');

//drop the old database
// db.dropDatabase();
// print('** Database dropped');