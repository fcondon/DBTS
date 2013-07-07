$(document).ready(function() {
    var header_source = $.ajax({
        url: '../templates/header.handlebars',
        success: function(header_source) {
            var template = Handlebars.compile(header_source);
            $('#header').html(template({}));
        }
    });
});
