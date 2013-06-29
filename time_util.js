var MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/*
   Provides a way of storing a discrete date without timezone info
   so that the start date stored doesn't shift as the user moves
   between timezones
*/
function dateInfo(date) {
    this.day = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
}

function getStorableDate(date) {
    return new dateInfo(date);
}

function getLastStreakDate(start_date, streak_count) {
    start_date = new Date(start_date.year, start_date.month, start_date.day);
    last_date = new Date(start_date.getTime() + (streak_count * MILLISECONDS_PER_DAY));
    return last_date;
}

// param Date
function compareDates(date1, date2) {
    var year_compare = compare(date1.getFullYear(), date2.getFullYear());
    if (year_compare === 0) {
        var month_compare = compare(date1.getMonth(), date2.getMonth());
        if (month_compare === 0) {
            return compare(date1.getDate(), date2.getDate());
        } else {
            return month_compare;
        }
    }
    return year_compare;
}

// returns date
function getYesterday() {
    yesterday = new Date();
    yesterday.setDate(date.getDate() - 1); // who knew?
    return yesterday;
}

function compare(number1, number2) {
    if (number1 > number2) {
        return 1;
    } else if (number1 < number2) {
        return -1;
    }
    return 0;
}

exports.dateInfo = dateInfo;
exports.compareDates = compareDates;
exports.getStorableDate = getStorableDate;
exports.getLastStreakDate = getLastStreakDate;
