var express 	= require("express")
	, app       = express()
	, port      = parseInt(process.env.PORT, 10) || 3000
	, mongo     = require('mongoskin')
	, db        = mongo.db("mongodb://appservice:rogue1@ds051838.mongolab.com:51838/tabhero", {native_parser:true, w: "majority"})
    , colors    = require('colors');


/*
db.collection('userShortcuts').find().toArray(function(err, result){
	if (err) throw err;
	console.log(result);
});
*/



// =============================================================================================================
// Data
// =============================================================================================================


app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/app'));
	app.use(app.router);
});



// =============================================================================================================
// Routes
// =============================================================================================================
require('./server/routes_shortcuts')(app, db, mongo);





// =============================================================================================================
// Routes
// =============================================================================================================
app.listen(port);
console.log('**********************************************\n'.red + 'Now serving the app at'+ ' http://localhost:'.red + port.toString().red + '/'.red);
