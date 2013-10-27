exports.share = function (collection) {


    return function (req, res) {

        var helperObject = req.body.helperObject;
        console.dir(req.body);

        if (helperObject !== undefined) {
            var rideObject = {};

            //user details
            rideObject.userId = helperObject.userId;

            //Source
            if (helperObject.isSrcEvent) {
                rideObject.sEvent = helperObject.sEvent;
                rideObject.isSrcEvent = true;
            }
            else {
                var source = {};
                source.name = helperObject.sname;
                source.loc = [];
                source.loc[0] = helperObject.slat;
                source.loc[1] = helperObject.slon;
                rideObject.source = source;

            }

            //Destination
            if (helperObject.isDestEvent) {
                rideObject.dEvent = helperObject.dEvent;
                rideObject.isDestEvent = true;
            }
            else {
                rideObject.dest = helperObject.sdest;
                var dest = {};
                dest.name = helperObject.dname;
                dest.loc = [];
                dest.loc[0] = helperObject.dlat;
                dest.loc[1] = helperObject.dlon;
                rideObject.dest = dest;
            }

            //car,bike,auto,cab
            rideObject.type = helperObject.type;

            //remaining seat = total seats initially
            rideObject.seats = rideObject.seats = helperObject.rseats;
            rideObject.date = helperObject.date;
            rideObject.time = helperObject.time;

            console.dir(rideObject);
            console.log('Arjun');
            collection.insert(
                rideObject
                , function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        res.end("There was a problem adding the information to the database.");
                    }
                    else {
                        console.log(Date(Date.now()));

                        res.end('success');
                    }
                });
        }
        else {
            res.end('error');
        }
    }
}

    exports.search = function (collection) {


        return function (req, res) {

            var seekerObject = req.body.helperObject;


            if ( seekerObject !== undefined) {
                var rideObject = {};
                var sloc = [];
                var dloc =[];
                console.dir(seekerObject);

                 //Source
                if (seekerObject.isSrcEvent) {
                    rideObject.sEvent = seekerObject.Sevent;
                    rideObject.isSrcEvent = true;
                }
                else {
                    rideObject.source = seekerObject.sname;
                    sloc = [];
                    sloc[0]=seekerObject.slat;
                    sloc[1]=seekerObject.slon;
                }

                //Destination
                if (seekerObject.isDestEvent) {
                    rideObject.dEvent = seekerObject.Devent;
                    rideObject.isDestEvent = true;
                }
                else {
                    //rideObject.dest = seekerObject.dname;
                    dloc = [];
                    dloc[0]=seekerObject.dlat;
                    dloc[1]=seekerObject.dlon;
                }
                       var oneKM = 0.0001569515;
                rideObject.date = seekerObject.date;
                rideObject.radius = 2;//seekerObject.radius;

                console.dir(rideObject);
                console.dir(dloc);
                //db.ride.find({"dest.loc":{"$within":{"$center":[[18,73],10]}}});
                collection.find(
                    //{$or: [rideObject,{"dest.loc":{"$within":{"$center":[dloc,2]}}}  ]},
                    //db.ride.find({"dest.loc":{"$within":{"$center":[[18,73],10]}},"seats":{$gt:2}});
                    //{"dest.loc":{"$within":{"$center":[dloc,2]}},"source.name":rideObject.source},
                    {"dest.loc":{"$within":{"$centerSphere":[dloc,oneKM]}},"source.name":rideObject.source},
                    function (err, docs) {
                        if (err) {
                            // If it failed, return error
                            console.log(err);
                            res.send("There was a problem adding the information to the database.");
                        }
                        else {
                            console.log( Date(Date.now()));
                            console.dir(docs);
                            res.send(docs);
                        }
                    });
            } else {
                res.end('error');
            }
        }
    }
