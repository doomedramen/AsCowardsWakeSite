var express = require('express');
var FB = require('fb');
var moment = require('moment');
var config = require('./config.json');

var app = express();
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));


app.get('/', function (req, res) {


    var events = {upcoming: [], past: []};


    FB.api('oauth/access_token', {
        client_id: config.auth.client_id,
        client_secret: config.auth.client_secret,
        grant_type: config.auth.grant_type
    }, function (fRes) {
        if (!fRes || fRes.error) {
            console.log(!fRes ? 'error occurred' : fRes.error);
            return res.render('shows', {events: events});
        } else {
            var accessToken = fRes.access_token;
            FB.setAccessToken(accessToken);
            FB.api(
                "/" + config.FBID + "/events",
                function (response) {
                    if (!response || response.err) {
                        console.error(response.err)
                    } else {
                        var now = moment();

                        response.data.map(function(value){
                            var eventDate = moment(value.start_time);

                            value.month = eventDate.format('MMM');
                            value.day = eventDate.format('D');

                            var finished = now.isAfter(value.end_time);
                            if (finished) {
                                events.past.push(value);
                            } else {
                                events.upcoming.push(value);
                            }
                        });

                        return res.render('index', {events: events});

                        // async.forEachOf(response.data, function (value, key, callback) {
                        //     var eventDate = moment(value.start_time);
                        //
                        //     value.month = eventDate.format('MMM');
                        //     value.day = eventDate.format('D');
                        //
                        //     var finished = now.isAfter(value.end_time);
                        //     if (finished) {
                        //         events.past.push(value);
                        //     } else {
                        //         events.upcoming.push(value);
                        //     }
                        //     callback();
                        // }, function (err) {
                        //     if (err) console.error(err.message);
                        //     return res.render('index', {events: events});
                        // });
                    }
                }
            );
        }
    });

});


app.listen(3000, function () {
    console.log('listening')
});