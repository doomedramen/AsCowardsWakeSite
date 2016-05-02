var Controller = {};
var FB = require('fb');
var moment = require('moment');
var config = require('./config.json');
Controller.index = function (req, res, next) {
    res.render('index');
};
Controller.about = function (req, res, next) {
    res.render('about');
};
Controller.bio = function (req, res, next) {
    res.render('bio');
};
Controller.shows = function (req, res, next) {

    var events = {upcoming: [], past: []};


    FB.api('oauth/access_token', {
        client_id: config.auth.client_id,
        client_secret: config.aut.client_secret,
        grant_type: config.auth.grant_type
    }, function (fRes) {
        if (!fRes || fRes.error) {
            console.log(!fRes ? 'error occurred' : fRes.error);
            return res.render('shows', {events: events});
        } else {
            var accessToken = fRes.access_token;
            FB.setAccessToken(accessToken);
            FB.api(
                "/959051970803998/events",
                function ( response) {
                    if (!response || response.err) {
                        console.error(err)
                    } else {
                        console.log(response);

                        var now = moment();

                        response.data.map(function (e) {

                            var finished = now.isAfter(e.end_time);

                            if (finished) {
                                events.past.push(e);
                            } else {
                                events.upcoming.push(e);
                            }
                        });
                    }
                    res.render('shows', {events:events});
                }
            );
        }
    });

};
Controller.media = function (req, res, next) {
    res.render('media');
};
Controller.contact = function (req, res, next) {
    res.render('contact');
};


module.exports = Controller;