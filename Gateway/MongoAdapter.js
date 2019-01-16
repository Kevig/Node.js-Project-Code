// Performance
const { performance } = require('perf_hooks');


var mongo = require('mongodb').MongoClient;

module.exports.openConnection = openConnection;
module.exports.createTable = createTable;
module.exports.addRecord = addRecord;
module.exports.findRecord = findRecord;
module.exports.findAllRecords = findAllRecords;
module.exports.deleteRecord = deleteRecord;

let dbConnection = null;

/**
 * 
 * @param {*} dbName 
 * @param {*} dbUrl 
 * @param {*} callback 
 */
function openConnection(dbName, dbUrl, callback)
{
    if(dbConnection === null)
    {
        var dBase = dbUrl + '/' + dbName;
        mongo.connect(dBase, function(err, db)
        {
            if(err) throw err;
            var dbo = db.db(dbName);
            dbConnection = dbo;
            callback();
        });
    }
}

// Create 'tableName' collection in 'dbName' database using database url (dbUrl)
// Table will only be created if currently does not exist
/**
 * 
 * @param {*} tableName 
 */
function createTable(tableName)
{
    dbConnection.createCollection(tableName, function(err, result)
    {
        if(err) throw err;
    })
}

// Create //
/**
 * 
 * @param {*} tableName 
 * @param {*} record 
 * @param {*} callback 
 */
function addRecord(tableName, record, callback)
{
    dbConnection.collection(tableName).insertOne(record, function(err, result)
    {
        if(err)
        {
            callback(false);
        }
        else
        {
            callback(true);
        }
    })
}


// Read //

// Find Multiple Records
/**
 * 
 * @param {*} tableName 
 * @param {*} query 
 */
function findRecords(tableName, query)
{
    dbConnection.collection(tableName).find(query).toArray(function(err, result)
    {
        if(err) throw err;
    })
}

// Find One Record - Timed at 1008.878079 Milliseconds - Keeping open connection - Timed at 4.236486 Milliseconds
/**
 * 
 * @param {*} tableName 
 * @param {*} query 
 * @param {*} callback 
 */
function findRecord(tableName, query, callback)
{
    performance.mark('A'); // PERFORMANCE HOOK

    dbConnection.collection(tableName).findOne(query, function(err, result)
    {
        if(err) throw err;
        performance.mark('B'); // PERFORMANCE HOOK
        performance.measure('A to B', 'A', 'B');
        const measure = performance.getEntriesByName('A to B')[0];
        console.log(measure.duration);
        callback(result);
    });
}

// Find all Records
/**
 * 
 * @param {*} tableName 
 * @param {*} callback 
 */
function findAllRecords(tableName, callback)
{
    dbConnection.collection(tableName).find({}).toArray(function(err, result)
    {
        if(err) throw err;
        callback(result);
    });
}

// Update
/**
 * 
 */
function updateRecord()
{
    // Not yet implemented
}

// Delete
/**
 * 
 * @param {*} tableName 
 * @param {*} query 
 * @param {*} callback 
 */
function deleteRecord(tableName, query, callback)
{
    dbConnection.collection(tableName).deleteOne(query, function(err, obj)
    {
        if(err)
        {
            callback(false);
        }
        callback(true);
    });
}