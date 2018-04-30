const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'day1';

// Use Connect Method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected Successfully to server");
    
    const db = client.db(dbName);

    // insertDocuments(db, function() {
        findDocuments(db, function() {
            indexCollection(db, function() {
                client.close();
            });
        });
    // });
});

const insertDocuments = function(db, callback) {
    // get the documents collection
    const collection = db.collection('documents');
    // insert some documents
    collection.insertMany([
        {a: 1}, {a: 2}, {a: 3} 
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

const findDocuments = function(db, callback) {
    const collection = db.collection('documents');

    collection.find({'a': 3}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log('Found the following records: ', docs);
        callback(docs);
    })
}

const updateDocument = function(db, callback) {
    const collection = db.collection('documents');

    collection.updateOne({ a : 2}, { $set: {b : 1 } }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });
}

const removeDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    collection.deleteOne({ a: 3 }, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
}

const indexCollection = function(db, callback) {
    db.collection('documents').createIndex(
        {"a": 1},
        null,
        function(err, results) {
            console.log(results);
            callback();
        }
    );
}