var assert = require('assert');
var time_util = require("./time_util");

test_compareDates();
test_getYesterday();

function test_compareDates() {
    console.log("Testing time_util.compareDates()... ");

    var result = 0;

    var test_date_hi = new Date(2012, 4, 25);
    var test_date_lo = new Date(2012, 3, 14);
    result = (time_util.compareDates(test_date_hi, test_date_lo));
    assert((result > 0), "compareDates() failure: 5/25/12 deemed earlier than 4/14/12");

    var test_date_hi = new Date(2012, 3, 15);
    var test_date_lo = new Date(2012, 3, 14);
    result = (time_util.compareDates(test_date_hi, test_date_lo));
    assert((result > 0), "compareDates() failure: 4/15/12 deemed earlier than 4/14/12");

    var test_date_2013 = new Date(2013,0,1);
    var test_date_2012 = new Date(2012,11,31)
    result = (time_util.compareDates(test_date_2013, test_date_2012));
    assert((result > 0), "compareDates() failure: 1/1/13 deemed earlier than 12/31/12");
    result = (time_util.compareDates(test_date_2012, test_date_2013));
    assert((result < 0), "compareDates() failure: 1/1/13 deemed earlier than 12/31/12");

    var test_date_now = new Date();
    var test_date_now2 = new Date();
    result = (time_util.compareDates(test_date_now, test_date_now2));
    assert((result === 0), "compareDates() failure: today deemed earlier than today");

    console.log("time_util.compareDates OK");
}

function test_getYesterday() {
    console.log("Testing time_util.getYesterday()... ");

    var result = 0;

    var test_date_new_year = new Date(2013,0,1);
    var test_date_last_year = new Date(2012,11,31);
    result = time_util.compareDates(test_date_last_year, time_util.getYesterday(test_date_new_year));
    assert((result == 0), "getYesterday failure: 1/1/13's yesterday not equal to 12/31/12");

    var test_date_today = new Date(1994,3,4);
    var test_date_yesterday = new Date(1994,3,3);
    result = time_util.compareDates(test_date_yesterday, time_util.getYesterday(test_date_today));
    assert((result == 0), "getYesterday failure: 4/4/94's yesterday not equal to 4/3/94");

    console.log("time_util.getYesterday OK");
}
