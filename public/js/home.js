$(document).ready(function() {
    var header_source = $('#header_template').html();
    var template      = Handlebars.compile(header_source);
    $('#header').html(template({}));
});
