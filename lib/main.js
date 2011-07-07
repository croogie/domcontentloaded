const widgets = require("widget");
const tabs = require("tabs");
const pageMod = require("page-mod");
const measure = require("measure");
const data = require("self").data;

var time1, time2;

var measureEvent = function(value, clearTime){
    if (clearTime) {
        time1 = value;
        time2 = null;
    } else {
        if (!time2) {
            time2 = value-time1;
            measure.add(tabs.activeTab.url, time2);

            console.log('TIME: ',(time2/1000.0), 's. SVG: ', measure.getAverage(tabs.activeTab.url), 's.');
        }
    }
};

pageMod.PageMod({
    include: "http://www.gamesgames.com/*",
    contentScriptWhen: 'start',
    contentScript: 'startTimer = new Date().getTime(); ' +
        'self.port.emit("measureEvent", startTimer, true);',
    onAttach: function(worker) {
        worker.port.on('measureEvent', measureEvent);
    }
});

pageMod.PageMod({
    include: "http://www.gamesgames.com/*",
    contentScriptWhen: 'ready',
    contentScript: 'endTime = new Date().getTime();' +
        'self.port.emit("measureEvent", endTime, false);',
    onAttach: function(worker) {
        worker.port.on('measureEvent', measureEvent);
    }
});


var widget = widgets.Widget({
    id: "mozilla-link",
    label: "GamesGames.com",
    contentURL: data.url('dom_disabled.png'),
    onMouseover: function() {
        this.contentURL = data.url('dom_enabled.png');
    },
    onMouseout: function() {
        this.contentURL = data.url('dom_disabled.png');
    }
});