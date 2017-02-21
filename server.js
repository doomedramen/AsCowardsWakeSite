const express = require('express');
const FB = require('fb');
var instaAPI = require('instagram-node').instagram();
const moment = require('moment');
const config = require('./config.json');

var app = express();
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

function getFBEvents() {
    return new Promise((good, bad) => {
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
                            const now = moment();

                            response.data.map(function (value) {
                                const eventDate = moment(value.start_time);

                                value.month = eventDate.format('MMM');
                                value.day = eventDate.format('D');

                                const finished = now.isAfter(value.end_time);
                                if (finished) {
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
        .then(events => {

            instaAPI.use({
                client_secret: config.insta_auth.client_secret
            });

            instaAPI.user('2263249088', function (err, result, remaining, limit) {

                if (err) {
                    console.error(err)
                } else {
                    console.log(result);
                }

                return res.render('index', {events: events});

            });


        })


});


app.listen(3000, function () {
    console.log('listening')
});