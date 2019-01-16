var mongoAdapter = require('./MongoAdapter');
var fileManager = require('fs');
var configValues = getConfigValues();

/**
 * Load Config Values from JSON file
 */
function getConfigValues() {
    try { var configValues = JSON.parse(fileManager.readFileSync('Config.json')); }
    catch(err) { console.error(err); }
    return configValues;
}
// Initialise mongoAdapter to open connection to database
mongoAdapter.openConnection('Gateway', configValues.mongoDB_URL, function(){});

var interval = (configValues.session_Removal_Interval_Minutes * 1000) * 60;
console.log('Beginning Cleaning In ' + configValues.session_Removal_Interval_Minutes + ' Minute(s).');

main();
function main() {   
    console.log('...');
    setTimeout(() => {
        mongoAdapter.findAllRecords('Sessions', function(records) {
            if(typeof records !== "undefined") {
                var j = records.length;
                for(var i = 0; i < j; i++) {
                    try {
                        var hasExpired =  records[i].expiry < new Date();
                        if(hasExpired) {
                            mongoAdapter.deleteRecord('Sessions', {'_id':records[i]._id}, 
                            function(complete){ });
                        }
                    } catch(err) { console.log(err); }}}});    
        main();
    }, interval )
}
