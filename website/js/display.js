$(document).ready(function () {
    var lang = 'en';

    $("#compute").click(function () {
		ComputeAmGraph(lang);
        $("#input").toggle('slow');
        $("#graph").toggle('slow');
    });

    $("#back").click(function () {
        $("#input").toggle('slow');
        $("#graph").toggle('slow');
    });

    $("#languageselector").on('change', function () {
        lang = this.value;
        LocalizePage(lang);
    });
    LocalizePage(lang);

});

function ComputeAmGraph(lang){
			var chart;
            var graph;

            // months in JS are zero-based, 0 means January 
            var chartData = ComputeGraphData(lang);
            

			// SERIAL CHART
			chart = new AmCharts.AmSerialChart();
			chart.panEventsEnabled = true;
			chart.pathToImages = "./js/images/";
			chart.dataProvider = chartData;
			chart.marginLeft = 10;
			chart.categoryField = "x";
			chart.zoomOutButton = {
				backgroundColor: '#000000',
				backgroundAlpha: 0.15
			};


			// AXES
			// category
			var categoryAxis = chart.categoryAxis;
			categoryAxis.gridAlpha = 0;

			// value
			var valueAxis = new AmCharts.ValueAxis();
			valueAxis.axisAlpha = 0;
			valueAxis.inside = true;
			chart.addValueAxis(valueAxis);

		
						// CURSOR
			var chartCursor = new AmCharts.ChartCursor();
			chart.addChartCursor(chartCursor);
			
			// GRAPH                
			graph = new AmCharts.AmGraph();
			graph.type = "smoothedLine"; // this line makes the graph smoothed line.
			graph.lineColor = "#d1655d";
			graph.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
			graph.bullet = "round";
			graph.bulletSize = 5;
			graph.lineThickness = 2;
			graph.valueField = "y";
			chart.addGraph(graph);

			
			
			// WRITE
			chart.write("graphcontainer");
}


function ComputeGraphData(lang) {
    ValidateTideInput();

    var lowTideTime = timeToFloat($("#lowtide_time").val());
    var highTideTime = timeToFloat($("#hightide_time").val());
    var M = parseFloat($("#tidal_value").val());
    
    var isEbb = isEbbTide(highTideTime, lowTideTime);
    var D = isEbb ? smartDuration(highTideTime ,lowTideTime) : smartDuration(lowTideTime, highTideTime);
    var data = [];
    var start = isEbb ? highTideTime : lowTideTime;

    var h0 = h0FromLocalPoint(D, M, highTideTime);
    var delta = devPressure();

    for (var i = 0; i < 20; i++) {
        var t1 = i * D / 20;
        var t2 = start + t1 - lowTideTime;
        data.push({ x: start + t1, y: hFromt(D, M, t2) - h0 - delta });
    }

   return data;
}

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
}

function smartDuration(start, end) {
    var duration = end - start;
    return (Math.floor(duration).mod(24)) + (duration - Math.floor(duration));
}

function isEbbTide(highTideTime, lowTideTime) {
    var m1 = smartDuration(highTideTime, lowTideTime);
    var m2 = smartDuration(lowTideTime,highTideTime);
    return m1 < m2; 
}

function hFromt(D, M, t){
    var y = Math.sin(Math.PI * t / (2 * D));
    return M * y * y;
}

function devPressure() {
    var pressure = parseFloat($("#pressure").val());
    if (isNaN(pressure) || pressure < 960 || pressure > 1060) {
        alert(localizedErrors.InvalidPressure[lang]);
    }
    var delta = pressure - 1013;
    return delta / 100;
}

function h0FromLocalPoint(D, M, highTideTime) {
    var localPointTime = timeToFloat($("#onepoint_time").val());
    var localPointValue = parseFloat($("#onepoint_value").val());
    if (isNaN(localPointTime)) {
        alert(localizedErrors.InvalidPointDataTime[lang]);
    }
    if (isNaN(localPointValue)) {
        alert(localizedErrors.InvalidPointDataValue[lang]);
    }
    return hFromt(D, M, localPointTime - highTideTime) - localPointValue;
}

function floatToTime(value) {
    var hours = Math.floor(value).mod(24);
    var minutes = Math.floor((value - Math.floor(value)) * 60);
    if(minutes < 10){
        minutes = '0'+minutes;
    }
    if(hours < 10) {
        hours = '0' + hours;
    }
    return  hours+ ':' + minutes;
}

function timeToFloat(timeString) {
    var splitted = timeString.split(':');
    var hours = parseFloat(splitted[0]);
    var minutes = parseFloat(splitted[1]);

    return hours + minutes / 60.0;
}

function ValidateTideInput() {
    var lowTideTime = timeToFloat($("#lowtide_time").val());
    var highTideTime = timeToFloat($("#hightide_time").val());
    var M = parseFloat($("#tidal_value").val());

    if (isNaN(lowTideTime)) {
        alert(localizedErrors.LowTideInvalid[lang]);
    }

    if (isNaN(highTideTime)) {
        alert(localizedErrors.HighTideInvalid[lang]);
    }

    if (isNaN(M)) {
        alert(localizedErrors.Tidal[lang]);
    }

    var duration = Math.min(smartDuration(lowTideTime, highTideTime),smartDuration(highTideTime, lowTideTime));
    if (duration < 1 || duration > 10) {
        alert(localizedErrors.TidalPos[lang]);
    }

    if (M <= 0) {
        alert(localizedErrors.SupiciousTideDur[lang]);
    }
}

function LocalizePage(lang) {
    $("#hightideheader").text(localizedStrings.High_tide[lang]);
    $("#lowtideheader").text(localizedStrings.Low_tide[lang]);
    $("#lowtideheader").text(localizedStrings.Low_tide[lang]);
    $("#tidalheader").text(localizedStrings.Tidal[lang]);
    $("#atmosphericheader").text(localizedStrings.Atmospheric_pressure[lang]);
    $("#one_pointheader").text(localizedStrings.Point_data[lang]);
    $("#compute").prop('value', localizedStrings.Display[lang]);
    $("#back").prop('value', localizedStrings.Back[lang]);
    $("#disclaimer").empty();
    $('<p>' + localizedStrings.Method[lang] + '</p>').appendTo("#disclaimer");
    $('<p>' + localizedStrings.Disclaimer[lang] + '</p>').appendTo("#disclaimer");
};