var descendant = true
$(document).ready(function () {
    $('#fromgroundzero').click(function () {
        $("section#from_groundzero").toggle('slow');
        $("section#from_onepoint").toggle('slow');
    });

    $("#switchtide").click(function () {
        var elt1 = $("section#tide_selection").children().eq(0);
        var elt2 = $("section#tide_selection").children().eq(1);
        elt2.insertBefore(elt1);
        descendant = !descendant;
    });

    $("#compute").click(function () {
        window.location.href = "tide.html"
    });

});