const widgets = require("widget");
const tabs = require("tabs");
const pageMod = require("page-mod");

var measurements = {};
var time1, time2;

var measure = function(value, clearTime){
    if (clearTime) {
        time1 = value;
        time2 = null;
    } else {
        if (!time2) {
            if (!measurements[tabs.activeTab.url])
                measurements[tabs.activeTab.url] = [];

            time2 = value-time1;
            measurements[tabs.activeTab.url].push(value-time1);
            
            console.info(measurements[tabs.activeTab.url]);
        }
    }
};

var notifications = require("notifications");
    
pageMod.PageMod({
    include: "http://stg.*",
    contentScriptWhen: 'start',
    contentScript: 'startTimer = new Date(); ' +
        'self.port.emit("measure", startTimer.getTime(), true);',
    onAttach: function(worker) {
        worker.port.on('measure', measure);
    }
});

pageMod.PageMod({
    include: "http://stg.*",
    contentScriptWhen: 'ready',
    contentScript: 'endTime = new Date();' +
        'self.port.emit("measure", endTime.getTime(), false);',
    onAttach: function(worker) {
        worker.port.on('measure', measure);
    }
});


var widget = widgets.Widget({
    id: "mozilla-link",
    label: "GamesGames.com",
    contentURL: "http://www.gamesgames.com/favicon.ico",
    onClick: function() {
        tabs.open("http://stg.pl.gamesgames.com/");
    }
});

console.log("The add-on is running.");