$(document).ready(function () {
    var lang = 'en';
	var cw = $('#graphcontainer').parent().width();
	var usedWidth = Math.round((cw*80)/100); //80 percent of the parent.
	var usedHeight = Math.round(usedWidth/2);
	$('#graphcontainer').css({"width":usedWidth+"px","height":usedHeight+'px'});
	
	ComputeAmGraph();
    $("#compute").click(function () {
		ComputeAmGraph();
        $("#input").toggle('slow');
    });

    $("#languageselector").on('change', function () {
        lang = this.value;
        LocalizePage(lang);
    });
    LocalizePage(lang);
});

function ComputeAmGraph(){
            // months in JS are zero-based, 0 means January 
            var chartData = ComputeGraphData();
			// // // SERIAL CHART
			var chart = new AmCharts.AmSerialChart();
			chart.panEventsEnabled = true;
			chart.pathToImages = "./js/images/";
			chart.dataProvider = chartData;
			chart.categoryField = "T";
			chart.numberFormatter = {precision:2, decimalSeparator:'.', thousandsSeparator:','};
			chart.marginRight = 10;

			// AXES
			// category
			var categoryAxis = chart.categoryAxis;
			categoryAxis.parseDates = true;
			categoryAxis.minPeriod = "mm";
			categoryAxis.equalSpacing = true;
			categoryAxis.boldPeriodBeginning = false;
			categoryAxis.gridAlpha = 0;
			
			// value
			var valueAxis = new AmCharts.ValueAxis();
			valueAxis.axisAlpha = 0;
			valueAxis.inside = true;
			chart.addValueAxis(valueAxis);

			// CURSOR
			var chartCursor = new AmCharts.ChartCursor();
			chartCursor.zoomable = false;
			chartCursor.categoryBalloonDateFormat = "JJ:NN";
			chart.addChartCursor(chartCursor);
			
			
			// GRAPH                
			var graph = new AmCharts.AmGraph();
			graph.type = "smoothedLine"; // this line makes the graph smoothed line.
			graph.lineColor ="#637bb6";
			// graph.negativeLineColor =  "#d1655d"; // this line makes the graph to change color when it drops below 0
			graph.bulletSize = 0;
			graph.lineThickness = 2;
			graph.valueField = "H";
			chart.addGraph(graph);

			// WRITE
			chart.write("graphcontainer");
}


function ComputeGraphData() {
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
	
	var N = 80;
    for (var i = 0; i < N; i++) {
        var t1 = i * D / N;
        var t2 = start + t1 - lowTideTime;
        data.push({ T: floatToTime(start + t1), H: hFromt(D, M, t2) - h0 - delta });
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

    return  new Date(1998,07,12,hours, minutes);
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
    $("#compute").prop('value', localizedStrings.Display[lang]);
    $("#back").prop('value', localizedStrings.Back[lang]);
    $("#disclaimer").empty();
    $('<p>' + localizedStrings.Method[lang] + '</p>').appendTo("#disclaimer");
    $('<p>' + localizedStrings.Disclaimer[lang] + '</p>').appendTo("#disclaimer");
	$("#tideparameters").text(localizedStrings.TideParameters[lang]);
	$("#localdata").text(localizedStrings.LocalData[lang]);
	$("#localtime").text(localizedStrings.LocalTime[lang]);
	$("#localdepth").text(localizedStrings.LocalDepth[lang]);
};