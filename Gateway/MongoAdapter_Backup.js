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

function openConnection(dbName, dbUrl, callback)
{
    var dBase = dbUrl + '/' + dbName;
    mongo.connect(dBase, function(err, db)
    {
        if(err) throw err;
        var dbo = db.db(dbName);
        dbConnection = dbo;
        console.log('End of Open Connection');
        callback();
    });
}

// Create 'tableName' collection in 'dbName' database using database url (dbUrl)
// Table will only be created if currently does not exist
function createTable(dbName, tableName, dbUrl)
{
    //var dBase = dbUrl + '/' + dbName;
    //mongo.connect(dBase, function(err, db)
    //{
    //    if(err) throw err;
        
    //    var dbo = db.db(dbName);
    //if(dbConnection !== null)
   // {
      //  dbo = dbConnection;
    //}
    dbConnection.createCollection(tableName, function(err, result)
        {
            if(err) throw err;
           // db.close();
        })
        console.log(tableName + ' Created.');
    
    //});
}

// Create //
function addRecord(dbName, tableName, dbUrl, record, callback)
{
    var dBase = dbUrl + '/' + dbName;
    mongo.connect(dBase, function(err, db)
    {
        if(err) throw err;
        
        var dbo = db.db(dbName);
        dbo.collection(tableName).insertOne(record, function(err, result)
        {
            if(err) throw err;
            
            //console.log('Record added to collection ' + tableName);
            db.close();
            callback(true);
        })
    });
}


// Read //

// Find Multiple Records
function findRecords(dbName, tableName, dbUrl, query)
{
    var dBase = dbUrl + '/' + dbName;
    mongo.connect(dbase, function(err, db)
    {
        if(err) throw err;
        
        var dbo = db.db(dbName);
        dbo.collection(tableName).find(query).toArray(function(err, result)
        {
            if(err) throw err;
            //console.log(result);
            db.close();
        })
    });
}

// Find One Record - Timed at 1008.878079 Milliseconds
function findRecord(dbName, tableName, dbUrl, query, callback)
{
    performance.mark('A'); // PERFORMANCE HOOK
    var dBase = dbUrl + '/' + dbName;
    mongo.connect(dBase, function(err, db)
    {
        if(err) throw err;

        var dbo = db.db(dbName);
        dbo.collection(tableName).findOne(query, function(err, result)
        {
            if(err) throw err;
            db.close();
            performance.mark('B'); // PERFORMANCE HOOK
            performance.measure('A to B', 'A', 'B');
            const measure = performance.getEntriesByName('A to B')[0];
            console.log(measure.duration);
            callback(result);
        });
    });
}

// Find all Records
function findAllRecords(dbName, tableName, dbUrl, callback)
{
    var dBase = dbUrl + '/' + dbName;
    mongo.connect(dBase, function(err, db)
    {
        if(err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(tableName).find({}).toArray(function(err, result)
        {
            if(err) throw err;
            db.close();
            callback(result);
        });

    });
}

// Update
function updateRecord()
{

}


// Delete
function deleteRecord(dbName, tableName, dbUrl, query, callback)
{
    var dBase = dbUrl + '/' + dbName;
    mongo.connect(dBase, function(err, db)
    {
        if(err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(tableName).deleteOne(query, function(err, obj)
        {
            if(err)
            {
                db.close();
                callback(false);
            }
            db.close();
            callback(true);
        });
    });

}