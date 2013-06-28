var MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function dateInfo(date) {
    this.day = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
}

function getDate(date) {
    return new dateInfo(date);
}

function getLastStreakDate(start_date, streak_count) {
    start_date = new Date(start_date.year, start_date.month, start_date.day);
    last_date = new Date(start_date.getTime() + (streak_count * MILLISECONDS_PER_DAY));
    return new dateInfo(last_date);
}

//compare 1/23/2012 to 1/23/1990
function compareDates(date1, date2) {
    var year_compare = compare(date1.year, date2.year);
    if (year_compare === 0) {
        var month_compare = compare(date1.month, date2.month);
        if (month_compare === 0) {
            return compare(date1.day, date2.day);
        } else {
            return month_compare;
        }
    }
    return year_compare;
}

function compare(number1, number2) {
    if (number1 > number2) {
        return 1;
    } else if (number1 < number2) {
        return -1;
    }
    return 0;
}

exports.compareDates = compareDates;
exports.getDate = getDate;
exports.getLastStreakDate = getLastStreakDate;
