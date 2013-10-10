var _lang = 'en';
var _isCoeffComputed = false;



$(document).ready(function () {
	
	SetGraphContainerSize();
	
	ComputeAmGraph();
    $("#compute").click(function () {
		ComputeAmGraph();
        $("#input").toggle('slow');
    });
	
	$("#frommap").click( function(){
		_isCoeffComputed = $(this).is(':checked');
		$("#tidalcoeff").toggle('slow');
		$("#localcoeff").toggle('slow');
		$("#onepoint_time").parent().toggle('slow');
		LocalizePage();
	});

    $("#languageselector").on('change', function () {
        _lang = this.value;
        LocalizePage();
    });
    LocalizePage();
});

function SetGraphContainerSize(){
	var cw = $('#graphcontainer').parent().width();
	var usedWidth = Math.round((cw*95)/100); //90 percent of the parent.
	var ratio = Math.min(window.innerHeight/window.innerWidth,1.5);
	var usedHeight = Math.round(usedWidth*ratio);
	$('#graphcontainer').css({"width":usedWidth+"px","height":usedHeight+'px'});
}

var zoom = document.documentElement.clientWidth / window.innerWidth;

$(window).resize(function() {
        SetGraphContainerSize();
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
			graph.negativeLineColor =  "#d1655d"; // this line makes the graph to change color when it drops below 0
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
    var start = isEbb ? highTideTime : lowTideTime;//ebb -> descendante...
	
	var h0 =0;
	if(_isCoeffComputed){
		h0 = h0FromReferenceTide(D, M)
	}
    else{
		h0 = h0FromLocalPoint(D, M, start, isEbb);
	}
	
    var delta = devPressure();
	
	var N = 80;
    for (var i = 0; i < N; i++) {
        var t1 = i * D / N;
        var t2 = smartDuration(start ,start + t1);
		if(isEbb)
		{
			data.push({ T: floatToTime(start + t1), H: h0 - hFromt(D, M, t2)  - delta });
		}
		else
		{
			data.push({ T: floatToTime(start + t1), H:  h0 + hFromt(D, M, t2) - delta });
		}
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
        alert(localizedErrors.InvalidPressure[_lang]);
    }
    var delta = pressure - 1013;
    return delta / 100;
}

function h0FromLocalPoint(D, M, start, isEbb) {
    var localPointTime = timeToFloat($("#onepoint_time").val());
    var localPointValue = parseFloat($("#onepoint_value").val());
    if (isNaN(localPointTime)) {
        alert(localizedErrors.InvalidPointDataTime[_lang]);
    }
    if (isNaN(localPointValue)) {
        alert(localizedErrors.InvalidPointDataValue[_lang]);
    }
	
	//h0 + hFromt = localPointValue if flow
	//h0 - hFromt = localPointValue if ebb
	if(isEbb){
		return localPointValue + hFromt(D, M, smartDuration(start,localPointTime));
	}
	
    return localPointValue- hFromt(D, M, smartDuration(start,localPointTime));
}

function ValidCoeff(coeff){
	if(isNaN(coeff)){
		return false;
	}
	return coeff >= 30 && coeff <= 150;
}

function h0FromReferenceTide(D, M) {
    var localCoeff = parseFloat($("#localcoeff_value").val());
    var tideCoeff = parseFloat($("#tidalcoeff_value").val());
	var localPointValue = parseFloat($("#onepoint_value").val());
	
    if (!ValidCoeff(localCoeff) || !ValidCoeff(tideCoeff)){
        alert(localizedErrors.InvalidCoefficient[_lang]);
    }
	if (isNaN(localPointValue)) {
        alert(localizedErrors.InvalidPointDataValue[_lang]);
    }
	
    return M*(localCoeff - tideCoeff)/200.0 + localPointValue;
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
        alert(localizedErrors.LowTideInvalid[_lang]);
    }

    if (isNaN(highTideTime)) {
        alert(localizedErrors.HighTideInvalid[_lang]);
    }

    if (isNaN(M)) {
        alert(localizedErrors.Tidal[_lang]);
    }

    var duration = Math.min(smartDuration(lowTideTime, highTideTime),smartDuration(highTideTime, lowTideTime));
    if (duration < 1 || duration > 10) {
        alert(localizedErrors.TidalPos[_lang]);
    }

    if (M <= 0) {
        alert(localizedErrors.SupiciousTideDur[_lang]);
    }
}

function LocalizePage() {
    $("#hightideheader").text(localizedStrings.High_tide[_lang]);
    $("#lowtideheader").text(localizedStrings.Low_tide[_lang]);
    $("#lowtideheader").text(localizedStrings.Low_tide[_lang]);
    $("#tidalheader").text(localizedStrings.Tidal[_lang]);
    $("#atmosphericheader").text(localizedStrings.Atmospheric_pressure[_lang]);
    $("#compute").prop('value', localizedStrings.Display[_lang]);
    $("#back").prop('value', localizedStrings.Back[_lang]);
    $("#disclaimer").empty();
    $('<p>' + localizedStrings.Method[_lang] + '</p>').appendTo("#disclaimer");
    $('<p>' + localizedStrings.Disclaimer[_lang] + '</p>').appendTo("#disclaimer");
	$("#tideparameters").text(localizedStrings.TideParameters[_lang]);
	$("#localdata").text(localizedStrings.LocalData[_lang]);
	$("#localtime").text(localizedStrings.LocalTime[_lang]);
	if(!_isCoeffComputed){
		$("#localdepth").text(localizedStrings.LocalDepth[_lang]);
		$("#localdata").text(localizedStrings.LocalData[_lang]);
	}
	else{
		$("#localdepth").text(localizedStrings.DepthAtLowTide[_lang]);//LocalDataRef
		$("#localdata").text(localizedStrings.LocalDataRef[_lang]);
	}
	
	
	$("#iscoeff").text(localizedStrings.CoeffCheckBox[_lang]);
	$("#localcoeff").children().eq(0).text(localizedStrings.Coeffs[_lang]);
	$("#tidalcoeff").children().eq(0).text(localizedStrings.Coeffs[_lang]);
};