var express = require('express'),
    app = express(),
    http = require('http'),
    logic = require('./lib/logic')
    config = require('./config'),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.name),
    ride = db.get('ride');




//express configuration
app.configure(function () {
    app.set('port', config.app.port);
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

});


app.post('/share', logic.share(ride));

app.post('/search',logic.search(ride));

app.post('/fetchRide',logic.userDetails(ride));

app.get('/circle', function (req, res) {


    res.end('Hello');
});


app.get('/all',logic.getAll(ride));


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port')+ " " +Date(Date.now()));
});
