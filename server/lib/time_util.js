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

// params: Date
// return: dateInfo
function getStorableDate(date) {
    return new dateInfo(date);
}

// params: Date, int
// return: Date
function getLastStreakDate(start_date, streak_count) {
    start_date = new Date(start_date.year, start_date.month, start_date.day);
    last_date = new Date(start_date.getTime() + (streak_count * MILLISECONDS_PER_DAY));
    return last_date;
}

// params: Date
// return: int
function compareDates(date1, date2) {
    var year_compare = compareNumbers(date1.getFullYear(), date2.getFullYear());
    if (year_compare === 0) {
        var month_compare = compareNumbers(date1.getMonth(), date2.getMonth());
        if (month_compare === 0) {
            return compareNumbers(date1.getDate(), date2.getDate());
        } else {
            return month_compare;
        }
    }
    return year_compare;
}

// params: Date
// return: Date
function getYesterday(today) {
    yesterday = today.setDate(today.getDate() - 1); // who knew?
    return new Date(yesterday);
}

// params: int, int
// return: int
function compareNumbers(number1, number2) {
    return number1 - number2;
}

exports.compareDates = compareDates;
exports.getStorableDate = getStorableDate;
exports.getLastStreakDate = getLastStreakDate;
exports.getYesterday = getYesterday;
