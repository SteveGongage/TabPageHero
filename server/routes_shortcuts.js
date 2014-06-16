module.exports = function(app, db, mongo) {
    // ========================================================
    // Validate Shortcut
    var validateShortcut = function(shortcut) {
        var errors = [];
		var messages = [];
        if(shortcut.userID == undefined || parseInt(shortcut.userID) <= 0 || parseInt(shortcut.userID) > 9999999) {
			messages.push('Invalid UserID');
            errors.push({
                field: 'userID',
                message: 'Invalid UserID'
            });
        }
        if(shortcut.title == undefined || shortcut.title.length == 0 || shortcut.title.length > 20) {
			messages.push('Title is required; Max 20 characters.');
            errors.push({
                field: 'title',
                message: 'Title is required; Max 20 characters.'
            })
        }
        if(shortcut.linkURL == undefined) {
            shortcut.linkURL = '';
        }
        if(shortcut.groupName == undefined) {
            shortcut.groupName = '';
        }
        if(shortcut.iconURL == undefined) {
            shortcut.iconURL = '';
        }
        var result = {
            success: (messages.length == 0),
            data: shortcut,
			errors: errors,
            messages: messages
        }
        return result;
    }
    // ========================================================
    // View Multi for Group
	app.get('/group/:groupName/shortcuts', function(req, res) {
        console.log('----------------------------------------------------\n'.blue +'--- Get Multiple Shortcuts for Group Name'.blue);

		// Contact the DB and get all records for this user
        var currUserID = 1001; // [DEBUG:SGON] 
        db.collection('userShortcuts').find({
            "userID": currUserID
        }).toArray(function(err, result) {
            if(err) throw err;
            res.send(result);
        });
    });

	
    // ========================================================
    // View Multi
    app.get('/shortcuts', function(req, res) {
        console.log('----------------------------------------------------\n'.blue +'--- Get Multiple Shortcuts for User'.blue);

		// Contact the DB and get all records for this user
        var currUserID = 1001; // [DEBUG:SGON] 
        db.collection('userShortcuts').find({
            "userID": currUserID
        }).toArray(function(err, result) {
            if(err) throw err;
            res.send(result);
        });
    });
	// ========================================================
    // View Single
    app.get('/shortcuts/:id', function(req, res) {
        console.log('----------------------------------------------------\n'.blue +'--- Get Single Shortcut'.blue);
        // Contact the DB and get a certain record matching this user
        db.collection('userShortcuts').findById(req.params.id, function(err, result) {
            if(err) throw err;
            console.log(result);
            res.send(result);
        });
    });
    
    // ========================================================
    // Add New
    app.post('/shortcuts', function(req, res) {
        console.log('----------------------------------------------------\n'.blue +'--- New Shortcut'.blue);

        var shortcut = {};
        shortcut.userID = 1001;
        shortcut.title = req.body.title;
        shortcut.groupName = req.body.groupName;
        shortcut.linkURL = req.body.linkURL;
        shortcut.iconURL = req.body.iconURL;
		var valResult = validateShortcut(shortcut);
        if(valResult.success) {
            db.collection('userShortcuts').insert(valResult.data, function(err, result) {
                if(err) throw err;
                if(result) {
                    console.log('Added to Database!', shortcut);
                    res.send(result[0]);
                }
            });
        } else {
			// Throw a validation error
            throw JSON.stringify(valResult.errors);
        }
    });
    
    // ========================================================
    // Edit Single
    app.post('/shortcuts/:id', function(req, res) {
        console.log('----------------------------------------------------\n'.blue +'Edit Shortcut: ID '.blue + req.params.id.toString().yellow);
        var shortcut = {};
        shortcut.title = req.body.title;
        shortcut.userID = req.body.userID;
        shortcut.groupName = req.body.groupName;
        shortcut.linkURL = req.body.linkURL;
        shortcut.iconURL = req.body.iconURL;

		var valResult = validateShortcut(shortcut);
        if(valResult.success) {
            var shortcutID = {
                _id: mongo.helper.toObjectID(req.params.id)
            };
			
            db.collection('userShortcuts').update(shortcutID, shortcut, function(err, result) {
                if(err) throw err;
                if(result) {
                    console.log('Updated to Database!', shortcut);
                    res.send(result);
                }
            });
        } else {
			// Throw a validation error
            throw JSON.stringify(valResult.errors);
        }
        res.send(shortcut);
    });

	// ========================================================
    // Delete Single
    app.delete('/shortcuts/:id', function(req, res) {
        console.log('----------------------------------------------------\n'.blue +'Delete Shortcut: ID '.blue + req.params.id.toString().yellow);
        var shortcutID = {
            _id: mongo.helper.toObjectID(req.params.id)
        };
        db.collection('userShortcuts').remove(shortcutID, function(err, result) {
            if(err) throw err;
            if(result) {
                console.log('Deleted from Database!', shortcutID);
                res.send(result);
            }
        });
    });

	// ========================================================
    // Everything else
    app.get('/shortcuts/*', function(req, res) {
		console.log(req);
		res.send('No idea what this is...', 404)
	})
}