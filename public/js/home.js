$(document).ready(function() {

    // number of days not in the streak for padding
    var pre_date_buffer = 3;
    var post_date_buffer = 200;
    // english month names
    var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var id = location.pathname.substr(1);
    if (parseInt(id)) {
        getStreakData(parseInt(id), function(record) {
            var streak = $.parseJSON(record);
            renderHeader(streak);
            renderCalendar(streak);
        });
    } else {
        getNewID(function(record) {
            streak = $.parseJSON(record);
            window.location = "/" + streak.user_id;
        });
    }

    // pulls streak info for a given ID
    function getStreakData(id, callback) {
        var get_url = '/get/' + id;
        // pull data about current streak
        $.ajax({
            url: get_url,
            success: callback
        });
    }

    // compiles the header template
    function renderHeader(streak) {
        // get header template
        $.ajax({
            url: '../templates/header.handlebars',
            success: function(header_source) {
                var header_tpl = Handlebars.compile(header_source);
                $('#header').html(header_tpl({ 'streak_count' : streak.streak_count , 'streak_high' : streak.max_streak }));
            }
        });
    }

    // compiles the calendar template
    function renderCalendar(streak) {
        // get calendar template
        $.ajax({
            url: '../templates/calendar.handlebars',
            success: function(cal_source) {
                var cal_template = Handlebars.compile(cal_source);
                var streak_days = getStreakDays(hydrateDate(streak.date), streak.streak_count);
                $('#calendar').html(cal_template({ 'days' : streak_days }));

                $('#today').click(function(e) {
                    maybeUpdateStreak();
                });
            }
        });
    }

    // gets a new ID from the server
    function getNewID(callback) {
        var id_url = '/id/'; // TODO
        $.ajax({
            url: id_url,
            success: function(id) {
                var new_url = '/new/' + id;

                $.ajax({
                    url: new_url,
                    success: callback
                });
             }
        });
    }

    // ask the server to increment the streak if it should be incremented
    function maybeUpdateStreak() {
        var update_url = '/update/' + id;
        $.ajax({
            url: update_url,
            success: function(record) {
                streak = $.parseJSON(record);

                // hightlight today's date
                $('#today').css('color', '#EBF21B');
                maybeUpdateHeaderCounts(streak);
            }
        });
    }

    // update the count values in the header if streak was incremented
    function maybeUpdateHeaderCounts(streak) {
        var current_count = $('#current_count');
        var all_time_count = $('#all_time_count');
        // update displayed counts
        var curr = parseInt(current_count.html());
        if (streak.streak_count > curr) {
            curr += 1;
            var all_time = parseInt(all_time_count.html());
            if (curr > all_time) {
                replaceHtml(all_time_count, curr);
            }
            replaceHtml(current_count, curr);
        }
    }

    // gets the data required for the calendar template
    function getStreakDays(date, streak_len) {
        if (!date) {
            date = new Date();
        }
        var today = new Date();                 // fresh instance
        var first_day = new Date(date);         // deep copy
        var last_day = new Date(date);          // modified copy
        last_day.setDate(last_day.getDate() + streak_len);

        var days = [];

        date.setDate(date.getDate() - pre_date_buffer);
        for (var i = 0; i < (streak_len + (post_date_buffer)); i++) {
            var is_active = (date >= first_day && date < last_day);
            var is_today = (date.toLocaleDateString() == today.toLocaleDateString());
            var is_start_of_month = (date.getDate() == 1);
            days.push({ 'date' : date.getDate(),
                        'active' : is_active,
                        'today' : is_today,
                        'month_start' : is_start_of_month,
                        'month_name' : month_names[date.getMonth()]
            });

            // hand to god, this works
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    // turns a date record into a Date instance
    function hydrateDate(stored_date) {
        if (stored_date) {
            return new Date(stored_date.year, stored_date.month, stored_date.day);
        }
        return null;
    }

    // animation for switching out a number
    function replaceHtml(element, data) {
        element.fadeOut('fast', function() {
            element.html(data);
            element.fadeIn('fast');
        });
    }

});
