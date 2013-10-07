$(document).ready(function() {

    // number of days not in the streak for padding
    var pre_date_buffer = 3;
    var post_date_buffer = 500;

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
                            success: function(record) {
                                streak = $.parseJSON(record);
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

                                // hightlight today's date
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

        date.setDate(date.getDate() - pre_date_buffer);
        for (var i = 0; i < (streak_len + (post_date_buffer)); i++) {
            var is_active = (date >= first_day && date < last_day);
            var is_today = (date.toLocaleDateString() == today.toLocaleDateString());
            var is_start_of_month = (date.getDate() == 1);
            days.push({ 'date' : date.getDate(),
                        'active' : is_active,
                        'today' : is_today,
                        'month_start' : is_start_of_month
            });

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

    function replaceHtml(element, data) {
        element.fadeOut('fast', function() {
            element.html(data);
            element.fadeIn('fast');
        });
    }

});
