class MongoAdapter 
{
    constructor(dbName, dbUrl, tableName, callback) {
        this.mongo = require('mongodb').MongoClient;
        this.openConnection(dbName, dbUrl, function() {
            this.createTable(tableName);
        });
    }

    openConnection(dbName, dbUrl, callback) {
        this.dbConnection = null;
        let dBase = dbUrl + '/' + dbName;
        mongo.connect(dBase, function(err, db) {
            if(err) throw err;
            this.dbConnection = db.db(dbName);
            callback();
        });
    }

    createTable(tableName) {
        dbConnection.createCollection(tableName, function(err, result) {
            if(err) throw err;
        })
    }

    addRecord(tableName, record, callback) {
        dbConnection.collection(tableName).insertOne(record, function(err, result) {
            callback(!err);
        })
    }

    findRecords(tableName, query, callback) {
        dbConnection.collection(tableName).find(query).toArray(function(err, result) {
            if(err) throw err;
            callback(result);
        })
    }

    findRecord(tableName, query, callback) {
        dbConnection.collection(tableName).findOne(query, function(err, result) {
            if(err) throw err;
            callback(result);
        });
    }

    findAllRecords(tableName, callback) {
        dbConnection.collection(tableName).find({}).toArray(function(err, result) {
            if(err) throw err;
            callback(result);
        });
    }

    updateRecord() {
        // Not yet implemented
    }

    deleteRecord(tableName, query, callback) {
        dbConnection.collection(tableName).deleteOne(query, function(err, obj) {
            callback(!err);
        });
    }
};

module.exports = MongoAdapter;