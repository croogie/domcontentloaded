var formatData = function(arr) {
    var i = 1;
    var narr = [];
    $.each(arr, function(index, value){
        narr.push([i++, value]);
    });
    return narr;
};

var rebuildChart = function(title, data) {
    var chartTitle = title || 'DomContentLoaded Chart';
    
    var line1 = data ? formatData(data[0]) : [];
    var line2 = data ? formatData(data[1]) : [];

    $('#chart-container').empty();
    var tbody = $('#table table tbody');
    tbody.empty();
    buildTable(line1, line2).appendTo(tbody);
    
    var plot1 = $.jqplot('chart-container', [line1, line2], {
        title: title,
        highlighter: {
            show: true,
            tooltipAxes: 'y',
            tooltipFormatString: '$%.2f'
        },
        cursor: {
            show: false
        }
    });
};

var buildTable = function(dcl, avg) {
    var row = $('<tbody><tr><td>${no}</td><td>${dcl}</td><td>${avg}</td></tr></tbody>');
    var data = [];
    var a = 0;
    
    for (var i in dcl){
        data.push({
            no: a+1,
            dcl: dcl[a][1],
            avg: avg[a][1].toFixed(2)
        });
        a++;
    }
    var tbody = $(row).tmpl(data);
    
    return tbody;
};

$('#widget-switch').click(function() {
    if ($(this).data('enabled') == 1) {
        self.port.emit('widgetSwitch', 0);
    } else {
        self.port.emit('widgetSwitch', 1);
    }
});

self.port.on("widgetSwitched", function(state) {
    var button = $('#widget-switch');
    if (state) {
        button.text('Disable widget').data('enabled', 1);
    } else {
        button.text('Enable widget').data('enabled', 0);
    }
});

self.port.on("reloadContent", function(title, data) {
    rebuildChart(title, data);
});