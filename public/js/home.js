$(document).ready(function() {

    // number of days not in the streak for padding
    var date_buffer = 3;

    var id = location.pathname.substr(1);
    if (parseInt(id)) {
        var get_url = '/get/' + id;
        var update_url = '/update/' + id;
    } else {
        // TODO: no ID
    }

    // pull data about current streak
    $.ajax({
        url: get_url,
        success: function(data) {
            var streak = JSON.parse(data);

            // get header template
            $.ajax({
                url: '../templates/header.handlebars',
                success: function(header_source) {
                    var header_tpl = Handlebars.compile(header_source);
                    $('#header').html(header_tpl({ 'streak_count' : streak.streak_count , 'streak_high' : streak.max_streak }));
                }
            });

            // get calendar template
            $.ajax({
                url: '../templates/calendar.handlebars',
                success: function(cal_source) {
                    var cal_template = Handlebars.compile(cal_source);
                    var streak_days = getStreakDays(hydrateDate(streak.date), streak.streak_count);
                    $('#calendar').html(cal_template({ 'days' : streak_days }));
                    var today = $('#today');
                    today.click(function(e) {
                        $.ajax({
                            url: update_url,
                            success: function(streak) {
                                today.css('color', '#EBF21B');
                            }
                        });
                    });
                }
            });
        }
    });

    function getStreakDays(date, streak_len) {
        if (!date) {
            date = new Date();
        }
        var today = new Date();                 // fresh instance
        var first_day = new Date(date);         // deep copy
        var last_day = new Date(date);          // modified copy
        last_day.setDate(last_day.getDate() + streak_len);

        var days = [];

        date.setDate(date.getDate() - date_buffer);
        for (var i = 0; i < (streak_len + (200 * date_buffer)); i++) {
            var is_active = (date >= first_day && date < last_day);
            var is_today = (date.toLocaleDateString() == today.toLocaleDateString());
            days.push({ 'date' : date.getDate() , 'active' : is_active, 'today' : is_today });

            // hand to god, this works
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    function hydrateDate(stored_date) {
        if (stored_date) {
            return new Date(stored_date.year, stored_date.month, stored_date.day);
        }
        return null;
    }

});
