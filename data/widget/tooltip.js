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
    console.info('DATA PROVIDED 0: ', data[0]);
    console.info('DATA PROVIDED 1: ', data[1]);
    rebuildChart(title, data);
});