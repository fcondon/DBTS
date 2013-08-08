$(document).ready(function() {

    var id = location.pathname.substr(1);
    if (parseInt(id)) {
        var get_url = '/get/' + id;
    } else {
        // TODO: no ID
    }

    // pull data about current streak
    $.ajax({
        url: get_url,
        success: function(data) {
            var streak = JSON.parse(data);

            // get template
            $.ajax({
                url: '../templates/header.handlebars',
                success: function(header_source) {
                    var template = Handlebars.compile(header_source);
                    $('#header').html(template({ 'streak_count' : streak.streak_count }));
                }
            });
        }
    });

});
