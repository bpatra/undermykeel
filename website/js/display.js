var isDescendant = true;
$(document).ready(function () {
    $('#fromgroundzero').click(function () {
        $("section#from_groundzero").toggle('slow');
        $("section#from_onepoint").toggle('slow');
    });

    $("#switchtide").click(function () {
        var elt1 = $("section#tide_selection").children().eq(0);
        var elt2 = $("section#tide_selection").children().eq(1);
        elt2.insertBefore(elt1);
        isDescendant != isDescendant;
    });

    $("#compute").click(function () {
        $("#input").toggle('slow');
        $("#chart").empty();
        ComputeGraph();
        $("#graph").toggle('slow');
    });

    $("#back").click(function () {
        $("#input").toggle('slow');
        $("#graph").toggle('slow');
    });
});

function ComputeGraph() {
    var isFromGroundZero = $("#fromgroundzero").is(':checked')
    if (isFromGroundZero) {
        alert("feature not ready yet");
    }
    var lowTideTime = timeToFloat($("#lowtide_time").val());
    var highTideTime = timeToFloat($("#hightide_time").val());
    var lowTideValue = $("#lowtide_value").val();
    var highTideValue = $("#hightide_value").val();
    var localPointTime = timeToFloat($("#onepoint_time").val());
    var localPointValue = $("#onepoint_value").val();

    //TODO add validation.

    var D = Math.abs(highTideTime - lowTideTime);
    var M = highTideValue - lowTideValue;
    var data = [];
    var start  = isDescendant ? highTideTime : lowTideTime;
    for (var i = 0; i < 1000; i++) {
        var t1 = i * D / 1000;
        data.push({ x: start + t1, y: hFromt(D, M, t1) });
    }

    var graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        width: 580,
        height: 250,
        series: [{
            color: 'steelblue',
            data: data
        }]
    });

    graph.render();

}

function hFromt(D, M, t){
    var y = Math.sin(Math.PI*t/(2*D));
    return M*y*y;
}

function timeToFloat(timeString) {
    var splitted = timeString.split(':');
    var hours = parseFloat(splitted[0]);
    var minutes = parseFloat(splitted[1]);

    return hours + minutes / 60.0;
}