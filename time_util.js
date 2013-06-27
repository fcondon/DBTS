var MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function date_info(date) {
    this.day = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
}

function getDate(date) {
    return new date_info(date);
}

function getLastStreakDate(start_date, streak_count) {
    start_date = new Date(start_date.year, start_date.month, start_date.day);
    last_date = new Date(start_date.getTime() + (streak_count * MILLISECONDS_PER_DAY));
    return new date_info(last_date);
}

exports.getDate = getDate;
exports.getLastStreakDate = getLastStreakDate;
