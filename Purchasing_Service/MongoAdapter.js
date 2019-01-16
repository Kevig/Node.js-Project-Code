const mongo = require('mongodb').MongoClient;

module.exports.openConnection = openConnection;
module.exports.createTable = createTable;
module.exports.addRecord = addRecord;
module.exports.findRecord = findRecord;
module.exports.findRecords = findRecords;
module.exports.findAllRecords = findAllRecords;
module.exports.updateRecord = updateRecord;
module.exports.deleteRecord = deleteRecord;
module.exports.addToCollectionArray = addToCollectionArray;
module.exports.removeFromCollectionArray = removeFromCollectionArray;

let dbConnection = null;

function openConnection(dbName, dbUrl, callback) {
    if(dbConnection === null) {
        let dBase = dbUrl + '/' + dbName;
        mongo.connect(dBase, (err, db) => {
            if(err) throw err;
            this.dbConnection = db.db(dbName);
            callback();
        });
    }
}

function createTable(tableName) {
    this.dbConnection.createCollection(tableName, (err, result) => {
        if(err) throw err;
    });
}

function addRecord(tableName, record, callback) {
    this.dbConnection.collection(tableName).insertOne(record, (err, result) => {
        callback(!err);
    });
}

function findRecords(tableName, query, callback) {
    this.dbConnection.collection(tableName).find(query).toArray((err, result) => {
        if(err) throw err;
        callback(result);
    });
}

function findRecord(tableName, query, callback) {
    this.dbConnection.collection(tableName).findOne(query, (err, result) => {
        if(err) throw err;
        callback(result);
    });
}

function findAllRecords(tableName, callback) {
    this.dbConnection.collection(tableName).find({}).toArray((err, result) => {
        if(err) throw err;
        callback(result);
    });
}

function updateRecord(tableName, query, updatedValues, callback) {
    this.dbConnection.collection(tableName).updateOne(query, {$set: updatedValues}, (err, result) => {
        if(err) throw err;
        callback(!err);
    });
}

function deleteRecord(tableName, query, callback) {
    this.dbConnection.collection(tableName).deleteOne(query, (err, obj) => {
        callback(!err);
    });
}

function addToCollectionArray(tableName, query, pushValues, callback) {
    this.dbConnection.collection(tableName).update(query, {$push: pushValues}, (err, result) => {
        callback(result);
    });
}

function removeFromCollectionArray(tableName, query, pullValues, callback) {
    this.dbConnection.collection(tableName).update(query, {$pull: pullValues}, (err, result) => {
        callback(result);
    })
}