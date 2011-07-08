const widgets = require("widget");
const tabs = require("tabs");
const pageWorker = require("page-worker");
const measure = require("measure");
const data = require("self").data;

var time1, time2;
var addonIsOn = false;

function toggleActivation() {
    addonIsOn = !addonIsOn;
    return addonIsOn;
}

var measureEvent = function(value, clearTime){
    if (!addonIsOn)
        return false;
    
    if (clearTime) {
        time1 = value;
        time2 = null;
        console.log('cleared out');
    } else {
        if (!time2) {
            time2 = value-time1;
            measure.add(tabs.activeTab.url, time2);

            console.log('TIME: ',(time2/1000.0), 's. SVG: ', measure.getAverage(tabs.activeTab.url), 's.');
        }
    }
};

// event called at start of loading page
pageWorker.Page({
    contentUrl: "*",
    contentScript: 'startTimer = new Date().getTime(); ' +
        'self.port.emit("measureEvent", startTimer, true);' +
        'self.postMessage(window.location);',
    contentScriptWhen: 'start',
    onAttach: function(worker) {
        worker.port.on('measureEvent', measureEvent);
    },
    onMessage: function(message){
        console.info('START: '+message)
    }
});

// event called at page load
pageWorker.Page({
    contentUrl: "*",
    contentScript: 'endTime = new Date().getTime();' +
        'self.port.emit("measureEvent", endTime, false);' +
        'self.postMessage(window.location);',
    contentScriptWhen: 'ready',
    onAttach: function(worker) {
        worker.port.on('measureEvent', measureEvent);
    },
    onMessage: function(message){
        console.info('READY: '+message)
    }
});
 
// widget part
var widget = widgets.Widget({
    id: "mozilla-link",
    label: "GamesGames.com",
    contentURL: data.url('widget/dom_disabled.png'),
    contentScriptWhen: 'ready',
    contentScriptFile: data.url('widget/widget.js')
});

widget.port.on('left-click', function() {
    console.log('activate/deactivate');
    widget.contentURL = toggleActivation() ?
        data.url('widget/dom_enabled.png') :
        data.url('widget/dom_disabled.png');
});
 
widget.port.on('right-click', function() {
    console.log('show annotation list');
});
    