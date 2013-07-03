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
        ComputeGraph();
    });
});

function ComputeGraph () {
    var data = [{ x: 1910, y: 92228531 }, { x: 1920, y: 106021568 }, { x: 1930, y: 123202660 }, { x: 1940, y: 132165129 }, { x: 1950, y: 151325798 }, { x: 1960, y: 179323175 }, { x: 1970, y: 203211926 }, { x: 1980, y: 226545805 }, { x: 1990, y: 248709873 }, { x: 2000, y: 281421906 }, { x: 2010, y: 308745538}];

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