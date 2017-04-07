const express = require('express');
const FB = require('fb');
const config = require('./config.json');

var app = express();
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

function getFBEvents() {
    return new Promise(function (good, bad) {
        var events = {upcoming: [], past: []};


        FB.api('oauth/access_token', {
            client_id: config.fb_auth.client_id,
            client_secret: config.fb_auth.client_secret,
            grant_type: config.fb_auth.grant_type
        }, function (fRes) {
            if (!fRes || fRes.error) {
                return bad(fRes.error);
            } else {
                const accessToken = fRes.access_token;
                FB.setAccessToken(accessToken);
                FB.api(
                    "/" + config.FBID + "/events",
                    function (response) {
                        if (!response || response.err) {
                            return bad(response.err);
                        } else {

                            response.data.map(function (value) {

                                console.log(value.start_time);

                                if(new Date(value.start_time) <= new Date()){
                                    events.past.push(value);
                                } else {
                                    events.upcoming.push(value);
                                }

                            });
                            return good(events);
                        }
                    }
                );
            }
        });
    });
}

app.get('/', function (req, res) {

    getFBEvents()
        .then(function (events) {
            return res.render('index', {events: events});
        })
        .catch(function (err) {
            console.error(err);
            return res.render('index', {events: {upcoming: [], past: []}});
        })


});


app.listen(3000, function () {
    console.log('listening on', 3000)
});